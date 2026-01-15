const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function run() {
  const migrationsDir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.error('No se encontró la carpeta de migraciones:', migrationsDir);
    process.exit(1);
  }

  const sqlFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  if (sqlFiles.length === 0) {
    console.error('No se encontraron archivos .sql en la carpeta de migraciones');
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL || process.env.DB_CONN_STRING;
  if (!connectionString) {
    console.error('REQUIRED: set DATABASE_URL or DB_CONN_STRING env var (postgres connection string)');
    process.exit(1);
  }

  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Conectado a la DB. Ejecutando migraciones...');
    for (const file of sqlFiles) {
      const sqlPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(sqlPath, 'utf8');
      console.log(`=> Ejecutando ${file}`);
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('COMMIT');
      console.log(`   ${file} ejecutado.`);
    }
    console.log('Todas las migraciones ejecutadas correctamente.');
  } catch (err) {
    console.error('Error ejecutando migración:', err.message || err);
    try { await client.query('ROLLBACK'); } catch(e){}
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
