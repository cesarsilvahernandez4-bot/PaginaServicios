const db = require('../config/db');

const UsuarioModel = {
    getAll: async () => {
        try {
            const result = await db.query('SELECT * FROM usuarios ORDER BY id ASC');
            return { data: result.rows, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    create: async (data) => {
        try {
            const query = `
                INSERT INTO usuarios (nombre, correo, password, rol, estado) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *
            `;
            const values = [data.nombre, data.correo, data.password, data.rol, data.estado];
            const result = await db.query(query, values);
            return { data: result.rows[0], error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    update: async (id, data) => {
        try {
            const query = `
                UPDATE usuarios 
                SET nombre = $1, correo = $2, password = $3, rol = $4, estado = $5 
                WHERE id = $6 RETURNING *
            `;
            const values = [data.nombre, data.correo, data.password, data.rol, data.estado, id];
            const result = await db.query(query, values);
            return { data: result.rows[0], error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    delete: async (id) => {
        try {
            await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
            return { error: null };
        } catch (err) {
            return { error: err };
        }
    },

    findByEmailAndPassword: async (correo, password) => {
        try {
            const query = 'SELECT * FROM usuarios WHERE correo = $1 AND password = $2';
            const result = await db.query(query, [correo, password]);
            return { data: result.rows[0], error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    }
};

module.exports = UsuarioModel;
