const db = require('../config/db');

const MensajeModel = {
    getAll: async () => {
        try {
            const result = await db.query('SELECT * FROM mensajes_contacto ORDER BY creado_en DESC');
            return { data: result.rows, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    create: async (data) => {
        try {
            const query = `
                INSERT INTO mensajes_contacto (nombre, telefono, correo, servicio, mensaje)
                VALUES ($1, $2, $3, $4, $5) RETURNING *
            `;
            const values = [data.nombre, data.telefono, data.correo, data.servicio, data.mensaje];
            const result = await db.query(query, values);
            return { data: result.rows[0], error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    updateEstado: async (id, estado) => {
        try {
            const result = await db.query(
                'UPDATE mensajes_contacto SET estado = $1 WHERE id = $2 RETURNING *',
                [estado, id]
            );
            return { data: result.rows[0] || null, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    delete: async (id) => {
        try {
            const result = await db.query('DELETE FROM mensajes_contacto WHERE id = $1', [id]);
            return { deleted: result.rowCount > 0, error: null };
        } catch (err) {
            return { deleted: false, error: err };
        }
    }
};

module.exports = MensajeModel;
