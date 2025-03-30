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

// Serve a simple HTML page on "/"
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
        <h1>Himanshu Jajoun</h1>
        <button onclick="window.location.href='/api-docs'">Go to Swagger</button>
      </body>
    </html>
  `);
});

// Swagger Configuration
const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "eVoting API",
        version: "1.0.0",
        description: "API documentation for the eVoting system",
      },
      servers: [{ url: "http://localhost:5000" }],
    },
    apis: ["./routes/*.js"], // Ensure this correctly points to route files
  };
  
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/party", partyRoutes);
app.use("/api/vote", voteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
