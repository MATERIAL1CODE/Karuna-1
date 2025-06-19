/*
  # Create donations table for citizen resource donations

  1. New Tables
    - `donations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `resource_type` (text)
      - `quantity` (text)
      - `pickup_location` (text)
      - `pickup_latitude` (numeric, optional)
      - `pickup_longitude` (numeric, optional)
      - `notes` (text, optional)
      - `status` (text, default 'available')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `donations` table
    - Add policies for authenticated users to create and read donations
    - Add policy for users to update their own donations
*/

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resource_type text NOT NULL,
  quantity text NOT NULL,
  pickup_location text NOT NULL,
  pickup_latitude numeric,
  pickup_longitude numeric,
  notes text,
  status text DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'picked_up', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can create donations"
  ON donations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can read all donations"
  ON donations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own donations"
  ON donations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;
CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS donations_user_id_idx ON donations (user_id);
CREATE INDEX IF NOT EXISTS donations_status_idx ON donations (status);
CREATE INDEX IF NOT EXISTS donations_resource_type_idx ON donations (resource_type);