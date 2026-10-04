const supabase = require('../config/supabase');

const UsuarioModel = {
    getAll: async () => {
        return await supabase.from('usuarios').select('*');
    },

    create: async (data) => {
        return await supabase.from('usuarios').insert([data]).select();
    },

    update: async (id, data) => {
        return await supabase.from('usuarios').update(data).eq('id', id).select();
    },

    delete: async (id) => {
        return await supabase.from('usuarios').delete().eq('id', id);
    },

    findByEmailAndPassword: async (correo, password) => {
        return await supabase.from('usuarios')
            .select('*')
            .eq('correo', correo)
            .eq('password', password)
            .single();
    }
};

module.exports = UsuarioModel;
