require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const stripeController = require("./app/controllers/stripe.controller");

const app = express();
const PORT = process.env.PORT || 8082;

// 🌍 Configuración de CORS con variables de entorno
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map(origin => origin.trim())
  : ["http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ Origen no permitido por CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  optionsSuccessStatus: 200,
};

// ✅ Middleware CORS (antes de rutas)
app.use(cors(corsOptions));

// 🔹 OPCIONAL: si quieres responder manualmente los preflight, usa regex en lugar de "*"
// app.options(/.*/, cors(corsOptions));

// ⚠️ Webhook de Stripe debe ir ANTES del bodyParser.json()
app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeController.webhookStripe
);

// Middleware para JSON (después del webhook)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🗄️ Base de datos
const db = require("./app/models");
db.sequelize.sync({ alter: true }).then(() => {
  console.log("🗄️ Base de datos sincronizada con cambios.");
});

// 🌐 Ruta base
app.get("/", (req, res) => {
  res.json({ message: "UMG Web Application" });
});

// 📦 Rutas de la app
require("./app/routes/cliente.routes")(app);
require("./app/routes/sucursal.routes")(app);
require("./app/routes/producto.routes")(app);
require("./app/routes/inventario.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/usuario.routes")(app);
require("./app/routes/rol.routes")(app);
require("./app/routes/proveedor.routes")(app);
require("./app/routes/venta.routes")(app);
require("./app/routes/factura.routes")(app);
require("./app/routes/transaccion.routes")(app);
require("./app/routes/carrito.routes")(app);
require("./app/routes/stripe.routes")(app);

// 📘 Swagger
const swaggerDocs = require("./swagger");
swaggerDocs(app);

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Allowed Origins: ${allowedOrigins.join(", ")}`);
});
