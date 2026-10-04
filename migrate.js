require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function runMigration() {
    try {
        console.log('Conectando a la base de datos...');
        const sqlPath = path.join(__dirname, 'supabase_schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('Ejecutando script SQL...');
        await db.query(sql);
        console.log('¡Migración completada! Tablas creadas e insertado el admin por defecto.');
    } catch (err) {
        console.error('Error durante la migración:', err);
    } finally {
        // Cerrar la conexión para que el script pueda terminar
        await db.end();
    }
}

runMigration();
