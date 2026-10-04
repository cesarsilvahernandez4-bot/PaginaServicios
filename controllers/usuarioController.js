const UsuarioModel = require('../models/usuarioModel');
const { hashPassword } = require('../utils/security');

const ROLES = ['Administrador', 'Operador'];
const ESTADOS = ['Activo', 'Inactivo'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valida y normaliza el cuerpo de la petición. isUpdate permite omitir la contraseña.
function validar(body = {}, isUpdate = false) {
    const data = {
        nombre: String(body.nombre || '').trim(),
        correo: String(body.correo || '').trim().toLowerCase(),
        password: body.password ? String(body.password) : '',
        rol: body.rol,
        estado: body.estado || 'Activo'
    };
    if (!data.nombre) return { error: 'El nombre es obligatorio' };
    if (!EMAIL_RE.test(data.correo)) return { error: 'El correo no es válido' };
    if (!isUpdate && !data.password) return { error: 'La contraseña es obligatoria' };
    if (data.password && data.password.length < 6) return { error: 'La contraseña debe tener al menos 6 caracteres' };
    if (!ROLES.includes(data.rol)) return { error: 'Rol inválido (Administrador u Operador)' };
    if (!ESTADOS.includes(data.estado)) return { error: 'Estado inválido (Activo o Inactivo)' };
    data.password = data.password ? hashPassword(data.password) : null;
    return { data };
}

const dbError = (res, error) => {
    if (error.code === '23505') return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
    return res.status(500).json({ error: error.message });
};

const usuarioController = {
    getAll: async (req, res) => {
        const { data, error } = await UsuarioModel.getAll();
        if (error) return dbError(res, error);
        res.json(data);
    },

    getById: async (req, res) => {
        const { data, error } = await UsuarioModel.getById(req.params.id);
        if (error) return dbError(res, error);
        if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(data);
    },

    create: async (req, res) => {
        const { data: payload, error: vError } = validar(req.body);
        if (vError) return res.status(400).json({ error: vError });
        const { data, error } = await UsuarioModel.create(payload);
        if (error) return dbError(res, error);
        res.status(201).json(data);
    },

    update: async (req, res) => {
        const id = Number(req.params.id);
        const { data: payload, error: vError } = validar(req.body, true);
        if (vError) return res.status(400).json({ error: vError });

        // Evitar quedarse sin administradores activos
        const pierdeAdmin = payload.rol !== 'Administrador' || payload.estado !== 'Activo';
        if (pierdeAdmin && await UsuarioModel.countActiveAdmins(id) === 0) {
            return res.status(400).json({ error: 'Debe existir al menos un Administrador activo' });
        }

        const { data, error } = await UsuarioModel.update(id, payload);
        if (error) return dbError(res, error);
        if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(data);
    },

    delete: async (req, res) => {
        const id = Number(req.params.id);
        if (req.user && req.user.id === id) {
            return res.status(400).json({ error: 'No puede eliminar su propio usuario' });
        }
        if (await UsuarioModel.countActiveAdmins(id) === 0) {
            return res.status(400).json({ error: 'Debe existir al menos un Administrador activo' });
        }
        const { deleted, error } = await UsuarioModel.delete(id);
        if (error) return dbError(res, error);
        if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado' });
    }
};

module.exports = usuarioController;
