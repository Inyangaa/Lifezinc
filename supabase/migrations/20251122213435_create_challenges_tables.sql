/*
  # Create Mood Challenges System

  1. New Tables
    - `challenges`
      - `id` (uuid, primary key)
      - `title` (text) - Challenge name
      - `description` (text) - Challenge description
      - `duration_days` (integer) - Length of challenge
      - `theme` (text) - Theme like 'self-love', 'anxiety', 'growth'
      - `daily_prompts` (jsonb) - Array of daily prompts
      - `badge_name` (text) - Badge earned upon completion
      - `is_active` (boolean) - Whether challenge is currently available
      - `created_at` (timestamptz)

    - `user_challenge_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `challenge_id` (uuid, foreign key to challenges)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz, nullable)
      - `current_day` (integer) - Current day in challenge
      - `completed_days` (jsonb) - Array of completed day numbers
      - `is_completed` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Challenges are publicly readable
    - Users can only view and manage their own progress
*/

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  duration_days integer NOT NULL DEFAULT 7,
  theme text NOT NULL,
  daily_prompts jsonb NOT NULL DEFAULT '[]'::jsonb,
  badge_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user challenge progress table
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  current_day integer DEFAULT 1,
  completed_days jsonb DEFAULT '[]'::jsonb,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- Challenges policies (public read)
CREATE POLICY "Anyone can view active challenges"
  ON challenges
  FOR SELECT
  USING (is_active = true);

-- User challenge progress policies
CREATE POLICY "Users can view own challenge progress"
  ON user_challenge_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge progress"
  ON user_challenge_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress"
  ON user_challenge_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenge progress"
  ON user_challenge_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert starter challenges
INSERT INTO challenges (title, description, duration_days, theme, daily_prompts, badge_name) VALUES
(
  '7 Days of Self-Love',
  'Build a foundation of self-compassion and appreciation',
  7,
  'self-love',
  '[
    "What do I appreciate most about myself today?",
    "When did I show myself kindness this week?",
    "What is one thing I love about my personality?",
    "How have I grown as a person in the past year?",
    "What physical feature do I appreciate about myself?",
    "What accomplishment am I most proud of?",
    "How can I be kinder to myself tomorrow?"
  ]'::jsonb,
  'Self-Love Champion'
),
(
  '5 Days Overcoming Fear',
  'Face your fears with courage and compassion',
  5,
  'courage',
  '[
    "What fear am I ready to acknowledge today?",
    "When have I been brave in the past?",
    "What would I do if fear wasn''t holding me back?",
    "Who can support me in facing this fear?",
    "What small step can I take toward courage today?"
  ]'::jsonb,
  'Courage Warrior'
),
(
  '7 Days of Gratitude',
  'Cultivate appreciation and joy in daily life',
  7,
  'gratitude',
  '[
    "What three things am I grateful for today?",
    "Who made my life better this week? How?",
    "What challenge taught me something valuable?",
    "What simple pleasure did I enjoy today?",
    "What part of my body am I thankful for?",
    "What opportunity am I grateful to have?",
    "How has my life improved over the past year?"
  ]'::jsonb,
  'Gratitude Master'
),
(
  '5 Days Managing Anxiety',
  'Develop tools to calm your mind and find peace',
  5,
  'anxiety',
  '[
    "What triggers my anxiety? What can I control?",
    "What grounding technique helps me most?",
    "When do I feel most calm? How can I create that?",
    "What worry can I release for just today?",
    "How can I be gentle with my anxious mind?"
  ]'::jsonb,
  'Calm Mind'
),
(
  '7 Days of Joy',
  'Rediscover what brings lightness to your life',
  7,
  'joy',
  '[
    "What made me smile today?",
    "What activity brings me pure joy?",
    "When did I last laugh? What happened?",
    "What childhood joy can I reconnect with?",
    "Who brings joy into my life?",
    "What small pleasure can I savor today?",
    "How can I share joy with someone else?"
  ]'::jsonb,
  'Joy Seeker'
);
