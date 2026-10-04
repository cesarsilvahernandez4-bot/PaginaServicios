// Utilidades de seguridad sin dependencias externas (módulo nativo 'crypto').
// - Hash de contraseñas con scrypt.
// - Tokens firmados con HMAC-SHA256 (formato tipo JWT simplificado).
const crypto = require('crypto');

const SECRET = process.env.AUTH_SECRET
    || crypto.createHash('sha256').update(String(process.env.DATABASE_URL || 'ambulancias-dev-secret')).digest('hex');

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 horas

function hashPassword(plain) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(String(plain), salt, 64).toString('hex');
    return `scrypt$${salt}$${hash}`;
}

function isHashed(value) {
    return typeof value === 'string' && value.startsWith('scrypt$');
}

function verifyPassword(plain, stored) {
    if (!stored) return false;
    if (!isHashed(stored)) return String(plain) === stored; // compatibilidad con datos antiguos
    const [, salt, hash] = stored.split('$');
    const candidate = crypto.scryptSync(String(plain), salt, 64);
    const expected = Buffer.from(hash, 'hex');
    return expected.length === candidate.length && crypto.timingSafeEqual(expected, candidate);
}

const b64url = (buf) => Buffer.from(buf).toString('base64url');

function signToken(payload) {
    const body = b64url(JSON.stringify({ ...payload, exp: Date.now() + TOKEN_TTL_MS }));
    const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
    return `${body}.${sig}`;
}

function verifyToken(token) {
    if (!token || typeof token !== 'string' || !token.includes('.')) return null;
    const [body, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
    if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    try {
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
        if (!payload.exp || payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}

module.exports = { hashPassword, isHashed, verifyPassword, signToken, verifyToken };
