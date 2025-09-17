const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Signup
async function signup({ email, password }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

// Login
async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

// Save transcript
async function saveTranscript({ user_id, text ,title}) {
  const { data, error } = await supabase
    .from('transcripts')
    .insert([{ user_id, text,title }]);
  return { data, error };
}

// Get transcript history
async function getTranscripts(user_id) {
  const { data, error } = await supabase
    .from('transcripts')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  return { data, error };
}

// Edit transcript
// (This function can be expanded based on requirements)
async function editTranscript({ user_id, transcript_id, text, title }) {
  const { data, error } = await supabase
    .from('transcripts')
    .update({ text, title })
    .eq('id', transcript_id)
    .eq('user_id', user_id);
  return { data, error };
}

// Delete transcript
async function deleteTranscript({ user_id, transcript_id }) {
  const { data, error } = await supabase
    .from('transcripts')
    .delete()
    .eq('id', transcript_id)
    .eq('user_id', user_id);
  return { data, error };
}

module.exports = { signup, login, saveTranscript, getTranscripts , editTranscript, deleteTranscript };