import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type JournalEntry = {
  id: string;
  created_at: string;
  updated_at: string;
  text_entry: string;
  mood: string | null;
  tags: string[] | null;
  voice_note_text: string | null;
  reframe_message: string | null;
};
