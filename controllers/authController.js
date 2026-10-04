const UsuarioModel = require('../models/usuarioModel');

const authController = {
    login: async (req, res) => {
        const { correo, password } = req.body;
        const { data, error } = await UsuarioModel.findByEmailAndPassword(correo, password);
        
        if (error || !data) return res.status(401).json({ error: 'Credenciales inválidas' });
        if (data.estado !== 'Activo') return res.status(401).json({ error: 'Usuario inactivo' });
        
        res.json({ message: 'Login exitoso', user: data });
    }
};

module.exports = authController;
