/* ============================================================
   Utilidades compartidas del panel administrativo
   - Sesión (token) y llamadas autenticadas a la API REST
   - Barra lateral según rol (RF08)
   - Notificaciones (toast) y escape de HTML
   ============================================================ */
(function () {
    const TOKEN_KEY = 'token';
    const USER_KEY = 'user';

    const ICONS = {
        servicios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="7" width="15" height="10" rx="2"/><path d="M16 10h4l3 3v4h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8.5 10v4M6.5 12h4"/></svg>',
        mensajes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v12H5.2L4 17.2z"/><path d="M8 9h8M8 12h5"/></svg>',
        usuarios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M16 4a4 4 0 0 1 0 8M22 21c0-3-2-5-5-5.5"/></svg>',
        edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg>',
        trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m5 12 5 5 9-10"/></svg>',
        undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>'
    };

    const NAV = [
        { key: 'servicios', label: 'Servicios', href: 'admin-servicios.html', roles: ['Administrador', 'Operador'] },
        { key: 'mensajes', label: 'Solicitudes', href: 'admin-mensajes.html', roles: ['Administrador', 'Operador'] },
        { key: 'usuarios', label: 'Usuarios', href: 'admin-usuarios.html', roles: ['Administrador'] }
    ];

    const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = 'login.html';
    }

    async function api(url, { method = 'GET', body } = {}) {
        const headers = { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) || ''}` };
        if (body !== undefined) headers['Content-Type'] = 'application/json';
        const res = await fetch(url, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
        if (res.status === 401) { logout(); throw new Error('Sesión expirada'); }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
        return data;
    }

    function toast(message, type = 'ok') {
        let stack = document.querySelector('.toast-stack');
        if (!stack) {
            stack = document.createElement('div');
            stack.className = 'toast-stack';
            document.body.appendChild(stack);
        }
        const el = document.createElement('div');
        el.className = `toast ${type === 'error' ? 'error' : ''}`;
        el.textContent = message;
        stack.appendChild(el);
        setTimeout(() => el.remove(), 3500);
    }

    function renderSidebar(user, active) {
        const aside = document.getElementById('sidebar');
        const links = NAV.filter((n) => n.roles.includes(user.rol)).map((n) => `
            <a class="sidebar-link ${n.key === active ? 'is-active' : ''}" href="${n.href}" id="nav-${n.key}">
                ${ICONS[n.key]} <span>${n.label}</span> <span class="count" data-count="${n.key}" hidden></span>
            </a>`).join('');
        aside.innerHTML = `
            <div class="sidebar-brand">
                <span class="brand-icon">+</span>
                <span>Ambulancias de los Llanos<small>Panel administrativo</small></span>
            </div>
            <p class="sidebar-label">Gestión</p>
            <nav class="sidebar-nav">${links}</nav>
            <div class="sidebar-footer">
                <div class="user-card">
                    <div class="user-avatar">${esc(user.nombre.charAt(0).toUpperCase())}</div>
                    <div><div class="user-name">${esc(user.nombre)}</div><div class="user-role">${esc(user.rol)}</div></div>
                </div>
                <div class="sidebar-actions">
                    <a href="index.html" id="btn-ver-sitio">Ver sitio</a>
                    <button type="button" id="btn-logout">Salir</button>
                </div>
            </div>`;
        document.getElementById('btn-logout').addEventListener('click', logout);
    }

    function setCount(key, value) {
        const el = document.querySelector(`[data-count="${key}"]`);
        if (!el) return;
        el.textContent = value;
        el.hidden = !value;
    }

    // Verifica la sesión contra el servidor y el rol requerido
    async function init({ active, roles }) {
        if (!localStorage.getItem(TOKEN_KEY)) return logout();
        const { user } = await api('/api/me');
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        if (roles && !roles.includes(user.rol)) {
            window.location.href = 'admin-servicios.html';
            throw new Error('Sin permisos');
        }
        renderSidebar(user, active);
        // Contador de solicitudes nuevas en el menú
        api('/api/contacto').then((m) => setCount('mensajes', m.filter((x) => x.estado === 'Nuevo').length)).catch(() => {});
        return user;
    }

    window.Admin = { api, init, toast, esc, logout, setCount, ICONS };
})();
