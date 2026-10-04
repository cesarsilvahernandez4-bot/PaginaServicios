require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'example-key';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
