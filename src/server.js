const app = require("./app");
const { sequelize } = require("./db");

const server = async () => {
  try {
    // sincronizar modelos con la base de datos
    await sequelize.sync();
    // si DB_SYNC_ALTER=true usaremos alter para aplicar cambios no destructivos (agregar columnas)
    const syncOptions = process.env.DB_SYNC_ALTER === "true" ? { alter: true } : {};
    await sequelize.sync(syncOptions);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor levantado en el puerto: ${PORT}`));
  } catch (error) {
    console.log(`ERROR AL LEVANTAR EL SERVIDOR: ${error}`);
    process.exit(1);
  }
};

server();
