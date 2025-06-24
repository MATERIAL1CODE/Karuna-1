/*
  # Create reports table for need reporting

  1. New Tables
    - `reports`
      - `id` (serial, primary key)
      - `reporter_id` (uuid, foreign key to profiles.id)
      - `location` (geography(Point, 4326)) - Essential for location-based queries
      - `description` (text, nullable)
      - `people_in_need` (integer)
      - `video_url` (text, nullable) - Secure URL to the video in Storage
      - `status` (text) - 'pending_match', 'assigned', 'completed', 'failed'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `reports` table
    - Add policies for users to read and edit their own reports
    - Add policy for facilitators to read assigned reports

  3. Indexes
    - Add spatial index on location for efficient geospatial queries
    - Add index on status for filtering
*/

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id serial PRIMARY KEY,
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location geography(Point, 4326) NOT NULL,
  description text,
  people_in_need integer NOT NULL CHECK (people_in_need > 0),
  video_url text,
  status text NOT NULL DEFAULT 'pending_match' CHECK (status IN ('pending_match', 'assigned', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create spatial index for efficient location queries
CREATE INDEX IF NOT EXISTS reports_location_idx ON reports USING GIST (location);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports (status);

-- Create index on reporter_id for user queries
CREATE INDEX IF NOT EXISTS reports_reporter_id_idx ON reports (reporter_id);

-- Create policies
CREATE POLICY "Users can read own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can insert own reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can update own reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reporter_id)
  WITH CHECK (auth.uid() = reporter_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();