/*
  # Create donations table for resource donations

  1. New Tables
    - `donations`
      - `id` (serial, primary key)
      - `donor_id` (uuid, foreign key to profiles.id)
      - `resource_type` (text)
      - `quantity` (text)
      - `pickup_location` (geography(Point, 4326))
      - `pickup_address` (text) - Human readable address
      - `pickup_contact` (text) - Contact information
      - `pickup_time_preference` (text) - Preferred pickup time
      - `status` (text) - 'available', 'assigned', 'completed', 'failed'
      - `notes` (text, nullable) - Additional notes from donor
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `donations` table
    - Add policies for users to read and edit their own donations
    - Add policy for facilitators to read assigned donations

  3. Indexes
    - Add spatial index on pickup_location for efficient geospatial queries
    - Add index on status for filtering
*/

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id serial PRIMARY KEY,
  donor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_type text NOT NULL,
  quantity text NOT NULL,
  pickup_location geography(Point, 4326) NOT NULL,
  pickup_address text NOT NULL,
  pickup_contact text NOT NULL,
  pickup_time_preference text NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'completed', 'failed')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create spatial index for efficient location queries
CREATE INDEX IF NOT EXISTS donations_pickup_location_idx ON donations USING GIST (pickup_location);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS donations_status_idx ON donations (status);

-- Create index on donor_id for user queries
CREATE INDEX IF NOT EXISTS donations_donor_id_idx ON donations (donor_id);

-- Create index on resource_type for matching
CREATE INDEX IF NOT EXISTS donations_resource_type_idx ON donations (resource_type);

-- Create policies
CREATE POLICY "Users can read own donations"
  ON donations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = donor_id);

CREATE POLICY "Users can insert own donations"
  ON donations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Users can update own donations"
  ON donations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = donor_id)
  WITH CHECK (auth.uid() = donor_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();