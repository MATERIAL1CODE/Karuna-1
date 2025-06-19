/*
  # Create missions table for facilitator assignments

  1. New Tables
    - `missions`
      - `id` (uuid, primary key)
      - `facilitator_id` (uuid, references profiles, optional)
      - `report_id` (uuid, references reports, optional)
      - `donation_id` (uuid, references donations, optional)
      - `title` (text)
      - `pickup_location` (text)
      - `pickup_latitude` (numeric)
      - `pickup_longitude` (numeric)
      - `delivery_location` (text)
      - `delivery_latitude` (numeric)
      - `delivery_longitude` (numeric)
      - `pickup_contact` (text)
      - `delivery_contact` (text)
      - `pickup_time` (text)
      - `delivery_time` (text)
      - `urgency` (text, default 'medium')
      - `status` (text, default 'available')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `missions` table
    - Add policies for authenticated users to read missions
    - Add policy for facilitators to accept and update missions
*/

-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facilitator_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  donation_id uuid REFERENCES donations(id) ON DELETE CASCADE,
  title text NOT NULL,
  pickup_location text NOT NULL,
  pickup_latitude numeric,
  pickup_longitude numeric,
  delivery_location text NOT NULL,
  delivery_latitude numeric,
  delivery_longitude numeric,
  pickup_contact text,
  delivery_contact text,
  pickup_time text,
  delivery_time text,
  urgency text DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  status text DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read all missions"
  ON missions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Facilitators can accept missions"
  ON missions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'facilitator'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'facilitator'
    )
  );

CREATE POLICY "System can create missions"
  ON missions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_missions_updated_at ON missions;
CREATE TRIGGER update_missions_updated_at
  BEFORE UPDATE ON missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS missions_facilitator_id_idx ON missions (facilitator_id);
CREATE INDEX IF NOT EXISTS missions_status_idx ON missions (status);
CREATE INDEX IF NOT EXISTS missions_urgency_idx ON missions (urgency);
CREATE INDEX IF NOT EXISTS missions_report_id_idx ON missions (report_id);
CREATE INDEX IF NOT EXISTS missions_donation_id_idx ON missions (donation_id);