/*
  # Create Community Shares Table

  1. New Tables
    - `community_shares`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `reframe_text` (text) - The reframed emotion text to share
      - `mood` (text) - The original mood/emotion
      - `is_anonymous` (boolean) - Whether the share is anonymous
      - `reaction_count` (integer) - Count of supportive reactions
      - `created_at` (timestamptz)
      
  2. Security
    - Enable RLS on `community_shares` table
    - Add policy for authenticated users to insert their own shares
    - Add policy for all authenticated users to read shares
    - Add policy for users to update only their own shares (for reaction counts)
*/

CREATE TABLE IF NOT EXISTS community_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reframe_text text NOT NULL,
  mood text,
  is_anonymous boolean DEFAULT true,
  reaction_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own shares"
  ON community_shares
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "All authenticated users can view shares"
  ON community_shares
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own shares"
  ON community_shares
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own shares"
  ON community_shares
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
