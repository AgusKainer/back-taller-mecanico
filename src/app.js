const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const verificarToken = require("./middleware/verificarToken");
const authRoutes = require("./routes/authRoutes");
const autosRoutes = require("./routes/autosRoutes");

app.use(verificarToken);

app.use("/api/auth", authRoutes);
app.use("/api/autos", autosRoutes);

module.exports = app;
