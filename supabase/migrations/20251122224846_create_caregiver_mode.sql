/*
  # Create Caregiver Mode System

  1. New Tables
    - `caregiver_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users) - The caregiver logging
      - `relationship_type` (text) - child, partner, parent, friend, etc.
      - `relationship_name` (text) - Optional name/identifier
      - `emotion_observed` (text) - The emotion the caregiver observed
      - `context` (text) - What happened / situation
      - `suggested_response` (text) - AI-generated empathetic response guidance
      - `notes` (text) - Caregiver's personal notes
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `caregiver_logs` table
    - Users can only access their own logs
*/

CREATE TABLE IF NOT EXISTS caregiver_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  relationship_type text NOT NULL,
  relationship_name text,
  emotion_observed text NOT NULL,
  context text NOT NULL,
  suggested_response text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE caregiver_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own caregiver logs"
  ON caregiver_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own caregiver logs"
  ON caregiver_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own caregiver logs"
  ON caregiver_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own caregiver logs"
  ON caregiver_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
