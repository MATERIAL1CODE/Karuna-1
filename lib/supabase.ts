import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type UserRole = 'citizen' | 'facilitator';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  address?: string;
  people_count: number;
  description?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  user_id: string;
  resource_type: string;
  quantity: string;
  pickup_location: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  notes?: string;
  status: 'available' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  facilitator_id?: string;
  report_id?: string;
  donation_id?: string;
  title: string;
  pickup_location: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  delivery_location: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  pickup_contact?: string;
  delivery_contact?: string;
  pickup_time?: string;
  delivery_time?: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'available' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}