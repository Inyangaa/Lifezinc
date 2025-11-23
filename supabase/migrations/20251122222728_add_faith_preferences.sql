/*
  # Add Faith Preferences to User Preferences

  1. Changes to user_preferences
    - Add faith_support_enabled (boolean) - Whether user wants faith encouragement
    - Add faith_tradition (text) - Selected spiritual tradition

  2. Security
    - Users can only update their own preferences
*/

-- Add faith preference columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'faith_support_enabled'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN faith_support_enabled boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'faith_tradition'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN faith_tradition text;
  END IF;
END $$;
