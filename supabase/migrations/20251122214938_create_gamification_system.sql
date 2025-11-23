/*
  # Create Gamification System

  1. New Tables
    - user_gamification: Tracks gems, levels, XP, and skill badges
    - user_activities: Records activities that earn rewards

  2. Security
    - Enable RLS on both tables
    - Users can only view and update their own data
*/

-- Create user gamification table
CREATE TABLE IF NOT EXISTS user_gamification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  gems integer DEFAULT 0,
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  skill_badges jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  gems_earned integer DEFAULT 0,
  xp_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- User gamification policies
CREATE POLICY "Users can view own gamification"
  ON user_gamification
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification"
  ON user_gamification
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification"
  ON user_gamification
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User activities policies
CREATE POLICY "Users can view own activities"
  ON user_activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON user_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to create default gamification for new users
CREATE OR REPLACE FUNCTION create_default_gamification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_gamification (user_id, gems, level, xp)
  VALUES (NEW.id, 0, 1, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create gamification when user signs up
DROP TRIGGER IF EXISTS on_user_created_gamification ON auth.users;
CREATE TRIGGER on_user_created_gamification
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_gamification();
