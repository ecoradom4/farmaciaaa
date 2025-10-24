require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// 🌍 Variables de entorno con valores por defecto
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8082";
const API_BASE_PATH = process.env.API_BASE_PATH || "/api";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Farmacia - UMG",
      version: "1.0.0",
      description:
        "Documentación de la API de la aplicación Farmacia con clientes, productos, ventas y más.",
    },
    servers: [
      {
        url: `${BACKEND_URL}${API_BASE_PATH}`, // ✅ Usa variables de entorno
        description: process.env.NODE_ENV === "production" ? "Servidor de Producción" : "Servidor Local",
      },
    ],
  },
  apis: ["./app/routes/*.js"], // busca anotaciones dentro de tus rutas
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📘 Swagger disponible en ${BACKEND_URL}/api-docs`);
}

module.exports = swaggerDocs;
