/*
  # Create missions table for coordinating aid delivery

  1. New Tables
    - `missions`
      - `id` (serial, primary key)
      - `report_id` (integer, foreign key to reports.id)
      - `donation_id` (integer, foreign key to donations.id)
      - `facilitator_id` (uuid, foreign key to profiles.id, nullable)
      - `status` (text) - Mission lifecycle states
      - `letter_of_thanks` (text, nullable) - AI-generated story
      - `estimated_distance` (numeric) - Distance in kilometers
      - `estimated_duration` (integer) - Duration in minutes
      - `pickup_completed_at` (timestamp, nullable)
      - `delivery_completed_at` (timestamp, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `missions` table
    - Add policies for facilitators to read assigned missions
    - Add policy for citizens to read missions related to their reports/donations

  3. Indexes
    - Add indexes for efficient querying
*/

-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
  id serial PRIMARY KEY,
  report_id integer NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  donation_id integer NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  facilitator_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'unassigned' CHECK (status IN ('unassigned', 'assigned', 'en_route_pickup', 'pickup_completed', 'en_route_delivery', 'completed', 'failed')),
  letter_of_thanks text,
  estimated_distance numeric,
  estimated_duration integer,
  pickup_completed_at timestamptz,
  delivery_completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS missions_status_idx ON missions (status);
CREATE INDEX IF NOT EXISTS missions_facilitator_id_idx ON missions (facilitator_id);
CREATE INDEX IF NOT EXISTS missions_report_id_idx ON missions (report_id);
CREATE INDEX IF NOT EXISTS missions_donation_id_idx ON missions (donation_id);
CREATE INDEX IF NOT EXISTS missions_created_at_idx ON missions (created_at);

-- Create policies
CREATE POLICY "Facilitators can read assigned missions"
  ON missions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'facilitator'
    ) AND (facilitator_id = auth.uid() OR facilitator_id IS NULL)
  );

CREATE POLICY "Facilitators can update assigned missions"
  ON missions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'facilitator'
    ) AND facilitator_id = auth.uid()
  );

CREATE POLICY "Citizens can read missions related to their reports"
  ON missions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reports 
      WHERE reports.id = missions.report_id 
      AND reports.reporter_id = auth.uid()
    )
  );

CREATE POLICY "Citizens can read missions related to their donations"
  ON missions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM donations 
      WHERE donations.id = missions.donation_id 
      AND donations.donor_id = auth.uid()
    )
  );

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_missions_updated_at
  BEFORE UPDATE ON missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();