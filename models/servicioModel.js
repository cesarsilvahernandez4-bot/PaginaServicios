const db = require('../config/db');

const ServicioModel = {
    // filtros: { soloActivos: boolean, categoria: string }
    getAll: async ({ soloActivos = false, categoria = null } = {}) => {
        try {
            const conditions = [];
            const values = [];
            if (soloActivos) conditions.push(`estado = 'Activo'`);
            if (categoria) {
                values.push(categoria);
                conditions.push(`categoria = $${values.length}`);
            }
            const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
            const result = await db.query(`SELECT * FROM servicios ${where} ORDER BY id ASC`, values);
            return { data: result.rows, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    getById: async (id) => {
        try {
            const result = await db.query('SELECT * FROM servicios WHERE id = $1', [id]);
            return { data: result.rows[0] || null, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    create: async (data) => {
        try {
            const query = `
                INSERT INTO servicios (nombre, categoria, descripcion, precio, imagen, estado)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
            `;
            const values = [data.nombre, data.categoria, data.descripcion, data.precio, data.imagen, data.estado];
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
                SET nombre = $1, categoria = $2, descripcion = $3, precio = $4, imagen = $5, estado = $6
                WHERE id = $7 RETURNING *
            `;
            const values = [data.nombre, data.categoria, data.descripcion, data.precio, data.imagen, data.estado, id];
            const result = await db.query(query, values);
            return { data: result.rows[0] || null, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    delete: async (id) => {
        try {
            const result = await db.query('DELETE FROM servicios WHERE id = $1', [id]);
            return { deleted: result.rowCount > 0, error: null };
        } catch (err) {
            return { deleted: false, error: err };
        }
    }
};

module.exports = ServicioModel;
