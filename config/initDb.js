// Inicialización idempotente de la base de datos.
// Se ejecuta al arrancar el servidor (y desde migrate.js) para que el esquema
// exista también en Render, sin depender de archivos SQL ignorados por git.
const db = require('./db');
const { hashPassword, isHashed } = require('../utils/security');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('Administrador', 'Operador')),
    estado VARCHAR(50) NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo'))
);

CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(12, 2),
    imagen VARCHAR(255),
    estado VARCHAR(50) NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo'))
);
ALTER TABLE servicios ADD COLUMN IF NOT EXISTS categoria VARCHAR(30);

CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    servicio VARCHAR(30),
    mensaje TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'Nuevo' CHECK (estado IN ('Nuevo', 'Atendido')),
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const SERVICIOS_INICIALES = [
    ['Traslado Asistencial Básico (TAB)', 'TAB', 'Traslados programados con camilla, oxígeno y personal básico capacitado.', 150000, 'img/TAB.png'],
    ['Traslado Asistencial Medicalizado (TAM)', 'TAM', 'Unidad medicalizada con médico y equipos de soporte vital avanzado.', 350000, 'img/TAM.png'],
    ['Cobertura de Eventos', 'Eventos', 'Acompañamiento prehospitalario para eventos deportivos, culturales y empresariales.', 500000, 'img/evento.jpg'],
    ['Servicio Domiciliario', 'Domiciliario', 'Atención y traslado desde tu hogar hacia centros médicos, de forma segura.', 120000, 'img/Recojer.jpg']
];

async function initDb() {
    await db.query(SCHEMA);

    // Asignar categoría a servicios existentes que no la tengan
    await db.query(`
        UPDATE servicios SET categoria = CASE
            WHEN nombre ILIKE '%medicalizado%' OR nombre ILIKE '%TAM%' THEN 'TAM'
            WHEN nombre ILIKE '%evento%' THEN 'Eventos'
            WHEN nombre ILIKE '%domicili%' THEN 'Domiciliario'
            ELSE 'TAB' END
        WHERE categoria IS NULL
    `);

    // Servicios iniciales (solo si la tabla está vacía)
    const { rows: [{ count: totalServicios }] } = await db.query('SELECT COUNT(*)::int AS count FROM servicios');
    if (totalServicios === 0) {
        for (const [nombre, categoria, descripcion, precio, imagen] of SERVICIOS_INICIALES) {
            await db.query(
                'INSERT INTO servicios (nombre, categoria, descripcion, precio, imagen, estado) VALUES ($1,$2,$3,$4,$5,$6)',
                [nombre, categoria, descripcion, precio, imagen, 'Activo']
            );
        }
    }

    // Administrador por defecto (solo si no hay usuarios)
    const { rows: [{ count: totalUsuarios }] } = await db.query('SELECT COUNT(*)::int AS count FROM usuarios');
    if (totalUsuarios === 0) {
        await db.query(
            'INSERT INTO usuarios (nombre, correo, password, rol, estado) VALUES ($1,$2,$3,$4,$5)',
            ['Admin Principal', 'admin@ambulancias.com', hashPassword('admin123'), 'Administrador', 'Activo']
        );
    }

    // Migrar contraseñas en texto plano a hash
    const { rows: usuarios } = await db.query('SELECT id, password FROM usuarios');
    for (const u of usuarios) {
        if (!isHashed(u.password)) {
            await db.query('UPDATE usuarios SET password = $1 WHERE id = $2', [hashPassword(u.password), u.id]);
        }
    }
}

module.exports = initDb;
