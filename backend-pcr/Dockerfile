# Use official Node.js lightweight image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose port (Google Cloud Run expects 8080 by default)
EXPOSE 8080

# Start command
CMD [ "node", "server.js" ]
