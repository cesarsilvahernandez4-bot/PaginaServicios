// Middleware de autenticación y control por roles (RF05 / RF08).
const { verifyToken } = require('../utils/security');
const UsuarioModel = require('../models/usuarioModel');

function extractToken(req) {
    const header = req.headers.authorization || '';
    return header.startsWith('Bearer ') ? header.slice(7) : null;
}

async function resolveUser(req) {
    const payload = verifyToken(extractToken(req));
    if (!payload) return null;
    // Se consulta la BD para reflejar cambios de rol/estado inmediatamente
    const { data } = await UsuarioModel.getById(payload.id);
    if (!data || data.estado !== 'Activo') return null;
    return data;
}

// Exige sesión válida
async function requireAuth(req, res, next) {
    const user = await resolveUser(req);
    if (!user) return res.status(401).json({ error: 'Sesión inválida o expirada' });
    req.user = user;
    next();
}

// Adjunta el usuario si hay sesión, pero no la exige
async function optionalAuth(req, res, next) {
    req.user = await resolveUser(req);
    next();
}

// Exige uno de los roles indicados (usar después de requireAuth)
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
        return res.status(403).json({ error: 'No tiene permisos para esta acción' });
    }
    next();
};

module.exports = { requireAuth, optionalAuth, requireRole };
