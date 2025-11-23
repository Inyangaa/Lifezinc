/*
  # Therapist Support System

  1. New Tables
    - `distress_tracking`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `journal_entry_id` (uuid, references journal_entries)
      - `distress_level` (text: low, moderate, high, severe)
      - `triggers` (jsonb: array of detected triggers)
      - `recommendation_shown` (boolean)
      - `created_at` (timestamptz)

    - `therapist_recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `category` (text: anxiety, trauma, depression, etc.)
      - `shown_at` (timestamptz)
      - `dismissed` (boolean)
      - `contacted_provider` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own data
    - Policies for authenticated users to read/write own data

  3. Notes
    - Tracks emotional distress patterns over time
    - Records when therapist support is recommended
    - Helps identify users who may benefit from professional help
    - All data is private and user-controlled
*/

-- Create distress tracking table
CREATE TABLE IF NOT EXISTS distress_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  journal_entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE,
  distress_level text NOT NULL CHECK (distress_level IN ('low', 'moderate', 'high', 'severe')),
  triggers jsonb DEFAULT '[]'::jsonb,
  recommendation_shown boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE distress_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own distress tracking"
  ON distress_tracking
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own distress tracking"
  ON distress_tracking
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own distress tracking"
  ON distress_tracking
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own distress tracking"
  ON distress_tracking
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create therapist recommendations table
CREATE TABLE IF NOT EXISTS therapist_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  shown_at timestamptz DEFAULT now(),
  dismissed boolean DEFAULT false,
  contacted_provider boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE therapist_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own therapist recommendations"
  ON therapist_recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own therapist recommendations"
  ON therapist_recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own therapist recommendations"
  ON therapist_recommendations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own therapist recommendations"
  ON therapist_recommendations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_distress_tracking_user_id ON distress_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_distress_tracking_created_at ON distress_tracking(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_distress_tracking_level ON distress_tracking(distress_level);

CREATE INDEX IF NOT EXISTS idx_therapist_recommendations_user_id ON therapist_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_therapist_recommendations_shown_at ON therapist_recommendations(shown_at DESC);
