const ServicioModel = require('../models/servicioModel');

const servicioController = {
    getAll: async (req, res) => {
        const { data, error } = await ServicioModel.getAll();
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    },

    create: async (req, res) => {
        const { nombre, descripcion, precio, imagen, estado } = req.body;
        const { data, error } = await ServicioModel.create({ nombre, descripcion, precio, imagen, estado });
        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json(data);
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { nombre, descripcion, precio, imagen, estado } = req.body;
        const { data, error } = await ServicioModel.update(id, { nombre, descripcion, precio, imagen, estado });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    },

    delete: async (req, res) => {
        const { id } = req.params;
        const { error } = await ServicioModel.delete(id);
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: 'Servicio eliminado' });
    }
};

module.exports = servicioController;
