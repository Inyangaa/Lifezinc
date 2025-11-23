/*
  # Create journal_entries table for Emotional Recycle

  1. New Tables
    - `journal_entries`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)
      - `text_entry` (text, the main journaling content)
      - `mood` (text, emoji or mood label like 'happy', 'sad', 'anxious', etc.)
      - `tags` (text array, categories like 'Work', 'Family', 'Relationship', 'Health', etc.)
      - `voice_note_text` (text, optional transcribed voice notes)
      - `reframe_message` (text, the positive reframe shown to user)

  2. Security
    - Enable RLS on `journal_entries` table
    - Since this is a demo app without auth, create a public policy allowing all reads/writes
    - In production, this would be restricted to authenticated users only

  3. Indexes
    - Index on `created_at` for efficient date-based queries

  4. Notes
    - The `tags` column uses PostgreSQL's text array type for flexible categorization
    - All timestamps are in UTC timezone
*/

CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  text_entry text NOT NULL,
  mood text,
  tags text[],
  voice_note_text text,
  reframe_message text
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to journal entries"
  ON journal_entries
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
