const ServicioModel = require('../models/servicioModel');

const CATEGORIAS = ['TAB', 'TAM', 'Eventos', 'Domiciliario'];
const ESTADOS = ['Activo', 'Inactivo'];

function validar(body = {}) {
    const precio = body.precio === '' || body.precio == null ? null : Number(body.precio);
    const data = {
        nombre: String(body.nombre || '').trim(),
        categoria: body.categoria,
        descripcion: String(body.descripcion || '').trim(),
        precio,
        imagen: String(body.imagen || '').trim() || null,
        estado: body.estado || 'Activo'
    };
    if (!data.nombre) return { error: 'El nombre es obligatorio' };
    if (!CATEGORIAS.includes(data.categoria)) return { error: `Categoría inválida (${CATEGORIAS.join(', ')})` };
    if (precio !== null && (Number.isNaN(precio) || precio < 0)) return { error: 'El precio debe ser un número positivo' };
    if (!ESTADOS.includes(data.estado)) return { error: 'Estado inválido (Activo o Inactivo)' };
    return { data };
}

const servicioController = {
    // RF07 / RF10: el público solo ve servicios activos; con sesión se ven todos.
    getAll: async (req, res) => {
        const categoria = CATEGORIAS.includes(req.query.categoria) ? req.query.categoria : null;
        const soloActivos = !req.user;
        const { data, error } = await ServicioModel.getAll({ soloActivos, categoria });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    },

    getCategorias: (req, res) => res.json(CATEGORIAS),

    getById: async (req, res) => {
        const { data, error } = await ServicioModel.getById(req.params.id);
        if (error) return res.status(500).json({ error: error.message });
        if (!data || (!req.user && data.estado !== 'Activo')) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        res.json(data);
    },

    create: async (req, res) => {
        const { data: payload, error: vError } = validar(req.body);
        if (vError) return res.status(400).json({ error: vError });
        const { data, error } = await ServicioModel.create(payload);
        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json(data);
    },

    update: async (req, res) => {
        const { data: payload, error: vError } = validar(req.body);
        if (vError) return res.status(400).json({ error: vError });
        const { data, error } = await ServicioModel.update(req.params.id, payload);
        if (error) return res.status(500).json({ error: error.message });
        if (!data) return res.status(404).json({ error: 'Servicio no encontrado' });
        res.json(data);
    },

    delete: async (req, res) => {
        const { deleted, error } = await ServicioModel.delete(req.params.id);
        if (error) return res.status(500).json({ error: error.message });
        if (!deleted) return res.status(404).json({ error: 'Servicio no encontrado' });
        res.json({ message: 'Servicio eliminado' });
    }
};

module.exports = servicioController;
