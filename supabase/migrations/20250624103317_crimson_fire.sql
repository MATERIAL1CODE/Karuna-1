/*
  # Enable required extensions for Karuna

  1. Extensions
    - Enable PostGIS for geospatial operations
    - Enable UUID extension for ID generation
    - Enable other required extensions

  2. Setup
    - Configure PostGIS properly
    - Set up spatial reference systems
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "postgis_topology";

-- Ensure we have the required spatial reference system (WGS84)
INSERT INTO spatial_ref_sys (srid, auth_name, auth_srid, proj4text, srtext)
VALUES (4326, 'EPSG', 4326, '+proj=longlat +datum=WGS84 +no_defs', 
'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]')
ON CONFLICT (srid) DO NOTHING;