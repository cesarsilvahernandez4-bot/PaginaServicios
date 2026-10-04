const db = require('../config/db');

const ServicioModel = {
    getAll: async () => {
        try {
            const result = await db.query('SELECT * FROM servicios ORDER BY id ASC');
            return { data: result.rows, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    create: async (data) => {
        try {
            const query = `
                INSERT INTO servicios (nombre, descripcion, precio, imagen, estado) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *
            `;
            const values = [data.nombre, data.descripcion, data.precio, data.imagen, data.estado];
            const result = await db.query(query, values);
            return { data: result.rows[0], error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    update: async (id, data) => {
        try {
            const query = `
                UPDATE servicios 
                SET nombre = $1, descripcion = $2, precio = $3, imagen = $4, estado = $5 
                WHERE id = $6 RETURNING *
            `;
            const values = [data.nombre, data.descripcion, data.precio, data.imagen, data.estado, id];
            const result = await db.query(query, values);
            return { data: result.rows[0], error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    delete: async (id) => {
        try {
            await db.query('DELETE FROM servicios WHERE id = $1', [id]);
            return { error: null };
        } catch (err) {
            return { error: err };
        }
    }
};

module.exports = ServicioModel;
