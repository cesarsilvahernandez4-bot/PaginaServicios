const UsuarioModel = require('../models/usuarioModel');
const { verifyPassword, signToken } = require('../utils/security');

const authController = {
    // RF05 Inicio de sesión
    login: async (req, res) => {
        const { correo, password } = req.body || {};
        if (!correo || !password) return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });

        const { data, error } = await UsuarioModel.findByEmailWithPassword(correo.trim());
        if (error) return res.status(500).json({ error: 'Error al consultar el usuario' });
        if (!data || !verifyPassword(password, data.password)) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        if (data.estado !== 'Activo') return res.status(403).json({ error: 'Usuario inactivo' });

        const user = { id: data.id, nombre: data.nombre, correo: data.correo, rol: data.rol, estado: data.estado };
        const token = signToken({ id: user.id, rol: user.rol });
        res.json({ message: 'Login exitoso', token, user });
    },

    // Devuelve el usuario de la sesión actual
    me: (req, res) => res.json({ user: req.user })
};

module.exports = authController;
