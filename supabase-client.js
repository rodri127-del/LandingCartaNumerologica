// supabase-client.js
// SUSTITUYE ESTOS VALORES POR LOS DE TU PROYECTO EN SUPABASE
const SUPABASE_URL = 'https://cnzldhhpwwwssaraxrcf.supabase.co';
const SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

// Inicializa el cliente de Supabase y lo hace disponible globalmente
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
