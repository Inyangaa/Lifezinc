/*
  # Add Inner Child Mode and Actionable Healing

  1. Changes to user_preferences
    - Add inner_child_mode (boolean) - Enable Inner Child journaling mode
    - Add guidance_voice (text) - Selected guidance personality

  2. Changes to journal_entries
    - Add is_inner_child_mode (boolean) - Track if entry was written in Inner Child mode
    - Add action_text (text) - The actionable step suggested
    - Add action_completed (boolean) - Track if user completed the action

  3. Security
    - Users can only access their own data
*/

-- Add Inner Child Mode preference
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'inner_child_mode'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN inner_child_mode boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'guidance_voice'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN guidance_voice text DEFAULT 'gentle_therapist';
  END IF;
END $$;

-- Add Inner Child Mode tracking to journal entries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'is_inner_child_mode'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN is_inner_child_mode boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'action_text'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN action_text text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'action_completed'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN action_completed boolean DEFAULT false;
  END IF;
END $$;
