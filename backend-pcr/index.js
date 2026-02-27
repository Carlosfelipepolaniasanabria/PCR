require("dotenv").config();
const { connectDB, sequelize } = require('./config/db');

const express = require('express');
const cors = require('cors');

require('./models/user.model.js');

const app = express();
const PORT = process.env.PORT || 8000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const startServer = async () => {
    try {
        await connectDB(); 
        await sequelize.sync({ alter: true });
        console.log("✅ Base de datos conectada correctamente");

        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
            });
        });

    } catch (error) {
        console.error("Error conectando a la base de datos:", error.message);
        process.exit(1); 
    }
};

startServer();


