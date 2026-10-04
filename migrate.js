require('dotenv').config();
const db = require('./config/db');
const initDb = require('./config/initDb');

// Crea/actualiza las tablas y siembra los datos iniciales (idempotente).
async function runMigration() {
    try {
        console.log('Conectando a la base de datos...');
        await initDb();
        console.log('¡Migración completada! Tablas usuarios, servicios y mensajes_contacto listas.');
    } catch (err) {
        console.error('Error durante la migración:', err);
    } finally {
        // Cerrar la conexión para que el script pueda terminar
        await db.end();
    }
}

runMigration();
