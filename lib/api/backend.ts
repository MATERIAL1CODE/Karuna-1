import { supabase } from '@/lib/supabase';

export interface ReportSubmission {
  location: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  people_in_need: number;
  video_file?: File;
}

export interface DonationSubmission {
  resource_type: string;
  quantity: string;
  pickup_location: {
    latitude: number;
    longitude: number;
  };
  pickup_address: string;
  pickup_contact: string;
  pickup_time_preference: string;
  notes?: string;
}

export interface FacilitatorLocation {
  latitude: number;
  longitude: number;
}

export class BackendAPI {
  // Submit a new report
  static async submitReport(reportData: ReportSubmission): Promise<{ success: boolean; report_id?: number; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      // Create form data for file upload
      const formData = new FormData();
      formData.append('location', JSON.stringify(reportData.location));
      formData.append('people_in_need', reportData.people_in_need.toString());
      
      if (reportData.description) {
        formData.append('description', reportData.description);
      }
      
      if (reportData.video_file) {
        formData.append('video_file', reportData.video_file);
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/submit-report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit report');
      }

      return result;
    } catch (error) {
      console.error('Error submitting report:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Log a new donation
  static async logDonation(donationData: DonationSubmission): Promise<{ success: boolean; donation_id?: number; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/log-donation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to log donation');
      }

      return result;
    } catch (error) {
      console.error('Error logging donation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Facilitator API methods
  static async getAvailableMissions(location?: FacilitatorLocation): Promise<{ success: boolean; missions?: any[]; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/facilitator-api`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getAvailableMissions',
          location,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch missions');
      }

      return result;
    } catch (error) {
      console.error('Error fetching available missions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async acceptMission(missionId: number): Promise<{ success: boolean; mission?: any; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/facilitator-api`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'acceptMission',
          mission_id: missionId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to accept mission');
      }

      return result;
    } catch (error) {
      console.error('Error accepting mission:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async updateMissionStatus(
    missionId: number, 
    status: string, 
    location?: FacilitatorLocation
  ): Promise<{ success: boolean; mission?: any; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/facilitator-api`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateMissionStatus',
          mission_id: missionId,
          status,
          location,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update mission status');
      }

      return result;
    } catch (error) {
      console.error('Error updating mission status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async getMissionDetails(missionId: number): Promise<{ success: boolean; mission?: any; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/facilitator-api`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getMissionDetails',
          mission_id: missionId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch mission details');
      }

      return result;
    } catch (error) {
      console.error('Error fetching mission details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async updateFacilitatorLocation(location: FacilitatorLocation): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/facilitator-api`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateLocation',
          location,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update location');
      }

      return result;
    } catch (error) {
      console.error('Error updating facilitator location:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Get mission statistics
  static async getMissionStatistics(): Promise<{ success: boolean; stats?: any; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('get_mission_statistics');

      if (error) {
        throw error;
      }

      return {
        success: true,
        stats: data
      };
    } catch (error) {
      console.error('Error fetching mission statistics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Get user's reports
  static async getUserReports(): Promise<{ success: boolean; reports?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          missions(
            id,
            status,
            letter_of_thanks,
            facilitator_id,
            profiles!missions_facilitator_id_fkey(full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        success: true,
        reports: data
      };
    } catch (error) {
      console.error('Error fetching user reports:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Get user's donations
  static async getUserDonations(): Promise<{ success: boolean; donations?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          missions(
            id,
            status,
            letter_of_thanks,
            facilitator_id,
            profiles!missions_facilitator_id_fkey(full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        success: true,
        donations: data
      };
    } catch (error) {
      console.error('Error fetching user donations:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}