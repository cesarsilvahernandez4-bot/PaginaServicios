const supabase = require('../config/supabase');

const ServicioModel = {
    getAll: async () => {
        return await supabase.from('servicios').select('*');
    },

    create: async (data) => {
        return await supabase.from('servicios').insert([data]).select();
    },

    update: async (id, data) => {
        return await supabase.from('servicios').update(data).eq('id', id).select();
    },

    delete: async (id) => {
        return await supabase.from('servicios').delete().eq('id', id);
    }
};

module.exports = ServicioModel;
