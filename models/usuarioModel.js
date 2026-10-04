const db = require('../config/db');

// Columnas públicas: la contraseña nunca se devuelve en las consultas
const PUBLIC_COLUMNS = 'id, nombre, correo, rol, estado';

const UsuarioModel = {
    getAll: async () => {
        try {
            const result = await db.query(`SELECT ${PUBLIC_COLUMNS} FROM usuarios ORDER BY id ASC`);
            return { data: result.rows, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    getById: async (id) => {
        try {
            const result = await db.query(`SELECT ${PUBLIC_COLUMNS} FROM usuarios WHERE id = $1`, [id]);
            return { data: result.rows[0] || null, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    // Incluye la contraseña (hash) para validar el inicio de sesión
    findByEmailWithPassword: async (correo) => {
        try {
            const result = await db.query('SELECT * FROM usuarios WHERE LOWER(correo) = LOWER($1)', [correo]);
            return { data: result.rows[0] || null, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    countActiveAdmins: async (excludeId = null) => {
        const result = await db.query(
            `SELECT COUNT(*)::int AS count FROM usuarios
             WHERE rol = 'Administrador' AND estado = 'Activo' AND ($1::int IS NULL OR id <> $1)`,
            [excludeId]
        );
        return result.rows[0].count;
    },

    create: async (data) => {
        try {
            const query = `
                INSERT INTO usuarios (nombre, correo, password, rol, estado)
                VALUES ($1, $2, $3, $4, $5) RETURNING ${PUBLIC_COLUMNS}
            `;
            const values = [data.nombre, data.correo, data.password, data.rol, data.estado];
            const result = await db.query(query, values);
            return { data: result.rows[0], error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    // Si data.password es null/undefined se conserva la contraseña actual
    update: async (id, data) => {
        try {
            const query = `
                UPDATE usuarios
                SET nombre = $1, correo = $2, password = COALESCE($3, password), rol = $4, estado = $5
                WHERE id = $6 RETURNING ${PUBLIC_COLUMNS}
            `;
            const values = [data.nombre, data.correo, data.password || null, data.rol, data.estado, id];
            const result = await db.query(query, values);
            return { data: result.rows[0] || null, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    delete: async (id) => {
        try {
            const result = await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
            return { deleted: result.rowCount > 0, error: null };
        } catch (err) {
            return { deleted: false, error: err };
        }
    }
};

module.exports = UsuarioModel;
