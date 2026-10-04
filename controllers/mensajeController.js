const MensajeModel = require('../models/mensajeModel');

const SERVICIOS = ['TAB', 'TAM', 'Eventos', 'Domiciliario'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const mensajeController = {
    // RF03 Formulario de contacto (público)
    create: async (req, res) => {
        const body = req.body || {};
        const data = {
            nombre: String(body.nombre || '').trim().slice(0, 255),
            telefono: String(body.telefono || '').trim().slice(0, 50),
            correo: String(body.correo || '').trim().slice(0, 255),
            servicio: SERVICIOS.includes(body.servicio) ? body.servicio : null,
            mensaje: String(body.mensaje || '').trim().slice(0, 2000)
        };
        if (!data.nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
        if (!/^[+\d\s()-]{7,}$/.test(data.telefono)) return res.status(400).json({ error: 'El teléfono no es válido' });
        if (!EMAIL_RE.test(data.correo)) return res.status(400).json({ error: 'El correo no es válido' });

        const { error } = await MensajeModel.create(data);
        if (error) return res.status(500).json({ error: 'No se pudo registrar el mensaje' });
        res.status(201).json({ message: '¡Gracias! Hemos recibido tu solicitud y te contactaremos pronto.' });
    },

    getAll: async (req, res) => {
        const { data, error } = await MensajeModel.getAll();
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    },

    updateEstado: async (req, res) => {
        const { estado } = req.body || {};
        if (!['Nuevo', 'Atendido'].includes(estado)) return res.status(400).json({ error: 'Estado inválido' });
        const { data, error } = await MensajeModel.updateEstado(req.params.id, estado);
        if (error) return res.status(500).json({ error: error.message });
        if (!data) return res.status(404).json({ error: 'Mensaje no encontrado' });
        res.json(data);
    },

    delete: async (req, res) => {
        const { deleted, error } = await MensajeModel.delete(req.params.id);
        if (error) return res.status(500).json({ error: error.message });
        if (!deleted) return res.status(404).json({ error: 'Mensaje no encontrado' });
        res.json({ message: 'Mensaje eliminado' });
    }
};

module.exports = mensajeController;
