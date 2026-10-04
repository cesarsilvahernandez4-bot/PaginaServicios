const UsuarioModel = require('../models/usuarioModel');

const usuarioController = {
    getAll: async (req, res) => {
        const { data, error } = await UsuarioModel.getAll();
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    },

    create: async (req, res) => {
        const { nombre, correo, password, rol, estado } = req.body;
        const { data, error } = await UsuarioModel.create({ nombre, correo, password, rol, estado });
        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json(data);
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { nombre, correo, password, rol, estado } = req.body;
        const { data, error } = await UsuarioModel.update(id, { nombre, correo, password, rol, estado });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    },

    delete: async (req, res) => {
        const { id } = req.params;
        const { error } = await UsuarioModel.delete(id);
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: 'Usuario eliminado' });
    }
};

module.exports = usuarioController;
