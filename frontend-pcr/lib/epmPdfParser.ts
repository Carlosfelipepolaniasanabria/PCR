"use client";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.mjs",
  import.meta.url
).toString();

export type DashboardRecord = {
  month: string;
  energy: number;
  water: number;
  gas: number;
  cost: number;
};

export type ParsedEpmResult = {
  isEpm: boolean;
  message?: string;
  currentPeriod?: string;
  records: DashboardRecord[];
  rawText: string;
};

const MONTHS_FULL = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const MONTHS_SHORT_MAP: Record<string, string> = {
  ENE: "Enero",
  FEB: "Febrero",
  MAR: "Marzo",
  ABR: "Abril",
  MAY: "Mayo",
  JUN: "Junio",
  JUL: "Julio",
  AGO: "Agosto",
  SEP: "Septiembre",
  OCT: "Octubre",
  NOV: "Noviembre",
  DIC: "Diciembre",
};

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function parseNumber(input: string) {
  const cleaned = input.replace(/\./g, "").replace(",", ".").trim();
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function extractSummaryPeriod(text: string): string | null {
  const match = text.match(/Resumen de facturación\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/i);
  if (!match) return null;
  return `${capitalize(match[1])} ${match[2]}`;
}

function extractSummaryValue(text: string, label: string) {
  const regex = new RegExp(
    `${label}\\s+([\\d.,]+)\\s*(?:m3|kwh|kWh)\\s+\\$\\s*([\\d.,]+)`,
    "i"
  );
  const match = text.match(regex);
  if (!match) {
    return { consumption: 0, billed: 0 };
  }
  return {
    consumption: parseNumber(match[1]),
    billed: parseNumber(match[2]),
  };
}

function extractSection(
  text: string,
  start: string,
  end?: string
): string {
  const startIndex = text.indexOf(start);
  if (startIndex === -1) return "";
  const endIndex = end ? text.indexOf(end, startIndex + start.length) : -1;
  if (end && endIndex !== -1) {
    return text.slice(startIndex, endIndex);
  }
  return text.slice(startIndex);
}

function extractHistoryMap(sectionText: string): Record<string, number> {
  const lines = sectionText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const labelRegex = /^(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|OCT|NOV|DIC)\/\d{2}$|^Actual$|^PROM$/i;
  const firstLabelIndex = lines.findIndex((line) => labelRegex.test(line));

  if (firstLabelIndex === -1) return {};

  const numericTokens: number[] = [];
  for (const line of lines.slice(1, firstLabelIndex)) {
    const matches = line.match(/[\d]+(?:[.,]\d+)?/g);
    if (!matches) continue;
    for (const token of matches) {
      numericTokens.push(parseNumber(token));
    }
  }

  const labels: string[] = [];
  for (const line of lines.slice(firstLabelIndex)) {
    if (labelRegex.test(line)) {
      labels.push(line);
    }
  }

  const size = Math.min(labels.length, numericTokens.length);
  const map: Record<string, number> = {};

  for (let i = 0; i < size; i++) {
    map[labels[i]] = numericTokens[i];
  }

  return map;
}

function periodFromShortLabel(label: string): string | null {
  const match = label.match(/^(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|OCT|NOV|DIC)\/(\d{2})$/i);
  if (!match) return null;
  const month = MONTHS_SHORT_MAP[match[1].toUpperCase()];
  const year = `20${match[2]}`;
  return `${month} ${year}`;
}

function extractPreviousTwoMonths(
  fullText: string
): Array<Pick<DashboardRecord, "month" | "water" | "energy" | "gas">> {
  const waterSection = extractSection(fullText, "Acueducto", "Alcantarillado");
  const energySection = extractSection(fullText, "Energía", "Gas");
  const gasSection = extractSection(fullText, "Gas", "Total Acueducto");

  const waterMap = extractHistoryMap(waterSection);
  const energyMap = extractHistoryMap(energySection);
  const gasMap = extractHistoryMap(gasSection);

  const waterLabels = Object.keys(waterMap).filter((k) => /\/\d{2}$/i.test(k));
  const energyLabels = Object.keys(energyMap).filter((k) => /\/\d{2}$/i.test(k));
  const gasLabels = Object.keys(gasMap).filter((k) => /\/\d{2}$/i.test(k));

  const lastTwo = waterLabels.slice(-2);

  return lastTwo
    .map((label) => {
      const period = periodFromShortLabel(label);
      if (!period) return null;

      return {
        month: period,
        water: waterMap[label] ?? 0,
        energy: energyMap[label] ?? 0,
        gas: gasMap[label] ?? 0,
      };
    })
    .filter(Boolean) as Array<
    Pick<DashboardRecord, "month" | "water" | "energy" | "gas">
  >;
}

export async function parseEpmPdf(file: File): Promise<ParsedEpmResult> {
  if (file.type !== "application/pdf") {
    return {
      isEpm: false,
      message: "El archivo no es un PDF.",
      records: [],
      rawText: "",
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join("\n");
    fullText += `\n${pageText}`;
  }

  const normalized = normalizeText(fullText);

  const markers = [
    /Empresas Públicas de Medellín E\.S\.P\./i,
    /Resumen de facturación/i,
    /Acueducto/i,
    /Energía/i,
    /Gas/i,
    /Contrato/i,
    /Documento Equivalente Electrónico/i,
  ];

  const markerCount = markers.filter((regex) => regex.test(normalized)).length;

  if (markerCount < 4) {
    return {
      isEpm: false,
      message: "El PDF no parece ser una factura EPM válida.",
      records: [],
      rawText: fullText,
    };
  }

  const currentPeriod = extractSummaryPeriod(normalized);
  if (!currentPeriod) {
    return {
      isEpm: false,
      message: "No se pudo detectar el período de facturación del recibo EPM.",
      records: [],
      rawText: fullText,
    };
  }

  const acueducto = extractSummaryValue(normalized, "Acueducto");
  const alcantarillado = extractSummaryValue(normalized, "Alcantarillado");
  const energia = extractSummaryValue(normalized, "Energía");
  const gas = extractSummaryValue(normalized, "Gas");

  const currentRecord: DashboardRecord = {
    month: currentPeriod,
    water: acueducto.consumption,
    energy: energia.consumption,
    gas: gas.consumption,
    cost:
      acueducto.billed +
      alcantarillado.billed +
      energia.billed +
      gas.billed,
  };

  const previousTwo = extractPreviousTwoMonths(fullText).map((item) => ({
    month: item.month,
    water: item.water,
    energy: item.energy,
    gas: item.gas,
    cost: 0,
  }));

  const uniqueMap = new Map<string, DashboardRecord>();

  for (const record of [...previousTwo, currentRecord]) {
    uniqueMap.set(record.month, record);
  }

  const records = Array.from(uniqueMap.values());

  return {
    isEpm: true,
    currentPeriod,
    records,
    rawText: fullText,
  };
}

export function sortPeriods(records: DashboardRecord[]) {
  return [...records].sort((a, b) => {
    const aIndex = normalizePeriod(a.month);
    const bIndex = normalizePeriod(b.month);
    return aIndex > bIndex ? 1 : -1;
  });
}

function normalizePeriod(period: string) {
  const [monthName, year] = period.split(" ");
  const monthIndex = MONTHS_FULL.indexOf(monthName);
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}