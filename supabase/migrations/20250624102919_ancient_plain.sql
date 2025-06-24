/*
  # Create storage policies for mission videos

  1. Storage Setup
    - Create mission_videos bucket (if not exists)
    - Set up RLS policies for secure video access

  2. Security
    - Users can upload videos for their own reports
    - Only assigned facilitators can view videos
    - Videos are private by default
*/

-- Create storage bucket for mission videos (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('mission_videos', 'mission_videos', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Users can upload videos for their own reports
CREATE POLICY "Users can upload videos for reports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'mission_videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own uploaded videos
CREATE POLICY "Users can view own uploaded videos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'mission_videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Facilitators can view videos for their assigned missions
CREATE POLICY "Facilitators can view assigned mission videos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'mission_videos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'facilitator'
  ) AND
  EXISTS (
    SELECT 1 FROM missions m
    JOIN reports r ON r.id = m.report_id
    WHERE m.facilitator_id = auth.uid()
    AND r.video_url LIKE '%' || name || '%'
  )
);

-- Policy: Service role can manage all videos
CREATE POLICY "Service role can manage all videos"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'mission_videos');