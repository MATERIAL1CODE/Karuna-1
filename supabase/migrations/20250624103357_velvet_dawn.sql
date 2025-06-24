/*
  # Database functions for geospatial operations and utilities

  1. Functions
    - calculate_distance: Calculate distance between two geography points
    - extract_coordinates: Extract lat/lng from geography point
    - find_nearby_points: Find points within a distance
    - get_mission_statistics: Get mission statistics

  2. Utilities
    - Geospatial helper functions
    - Statistics and reporting functions
*/

-- Function to calculate distance between two geography points
CREATE OR REPLACE FUNCTION calculate_distance(point1 geography, point2 geography)
RETURNS numeric AS $$
BEGIN
  RETURN ST_Distance(point1, point2);
END;
$$ LANGUAGE plpgsql;

-- Function to extract coordinates from geography point
CREATE OR REPLACE FUNCTION extract_coordinates(geography_point geography)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'lat', ST_Y(geography_point::geometry),
    'lng', ST_X(geography_point::geometry)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to find nearby points within a distance
CREATE OR REPLACE FUNCTION find_nearby_points(
  center_point geography,
  search_distance numeric DEFAULT 5000
)
RETURNS TABLE(
  point_id integer,
  distance numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id as point_id,
    ST_Distance(location, center_point) as distance
  FROM reports
  WHERE ST_DWithin(location, center_point, search_distance)
  ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Function to get mission statistics
CREATE OR REPLACE FUNCTION get_mission_statistics()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_missions', COUNT(*),
    'completed_missions', COUNT(*) FILTER (WHERE status = 'completed'),
    'active_missions', COUNT(*) FILTER (WHERE status IN ('assigned', 'en_route_pickup', 'pickup_completed', 'en_route_delivery')),
    'total_people_helped', COALESCE(SUM(
      CASE WHEN status = 'completed' THEN 
        (SELECT people_in_need FROM reports WHERE reports.id = missions.report_id)
      ELSE 0 END
    ), 0)
  ) INTO result
  FROM missions;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get user impact statistics
CREATE OR REPLACE FUNCTION get_user_impact_stats(user_id uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_reports', (
      SELECT COUNT(*) FROM reports WHERE reporter_id = user_id
    ),
    'total_donations', (
      SELECT COUNT(*) FROM donations WHERE donor_id = user_id
    ),
    'total_people_helped', (
      SELECT COALESCE(SUM(r.people_in_need), 0)
      FROM reports r
      JOIN missions m ON m.report_id = r.id
      WHERE r.reporter_id = user_id AND m.status = 'completed'
    ) + (
      SELECT COALESCE(SUM(r.people_in_need), 0)
      FROM donations d
      JOIN missions m ON m.donation_id = d.id
      JOIN reports r ON r.id = m.report_id
      WHERE d.donor_id = user_id AND m.status = 'completed'
    ),
    'completed_missions', (
      SELECT COUNT(DISTINCT m.id)
      FROM missions m
      LEFT JOIN reports r ON r.id = m.report_id
      LEFT JOIN donations d ON d.id = m.donation_id
      WHERE (r.reporter_id = user_id OR d.donor_id = user_id) AND m.status = 'completed'
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;