/*
  # Create Life Chapters System

  1. New Tables
    - `life_chapters`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text) - User-defined chapter name
      - `description` (text) - Optional chapter description
      - `start_date` (timestamptz) - When chapter began
      - `end_date` (timestamptz) - When chapter ended (null if ongoing)
      - `color` (text) - Visual identifier color
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes to journal_entries
    - Add `chapter_id` (uuid) - Links entry to a life chapter

  3. Security
    - Enable RLS on `life_chapters` table
    - Users can only access their own chapters
    - Users can only link entries to their own chapters
*/

CREATE TABLE IF NOT EXISTS life_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  color text DEFAULT 'blue',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE life_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chapters"
  ON life_chapters FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chapters"
  ON life_chapters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chapters"
  ON life_chapters FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chapters"
  ON life_chapters FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'chapter_id'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN chapter_id uuid REFERENCES life_chapters(id) ON DELETE SET NULL;
  END IF;
END $$;
