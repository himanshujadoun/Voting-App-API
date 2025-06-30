require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes = require("./routes/authRoutes");
const partyRoutes = require("./routes/partyRoutes");
const voteRoutes = require("./routes/voteRoutes");

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Welcome page
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Welcome</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          button { background: blue; color: white; padding: 10px 20px; border: none; cursor: pointer; }
        </style>
      </head>
      <body>
        <h1>Himanshu Jadoun</h1>
        <button onclick="window.location.href='/api-docs'">Go to Swagger</button>
      </body>
    </html>
  `);
});

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "eVoting API",
      version: "1.0.0",
      description: "API documentation for the eVoting system",
    },
    servers: [{ url: "https://voting-app-api-flame.vercel.app" }]
  },
  apis: [path.join(__dirname, 'routes/*.js')]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/party", partyRoutes);
app.use("/api/vote", voteRoutes);

module.exports = app;
app.use((err, req, res, next) => {
  console.error('UNCAUGHT ERROR:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});
