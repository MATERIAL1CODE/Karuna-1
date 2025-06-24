import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BackendAPI, ReportSubmission, DonationSubmission, FacilitatorLocation } from '@/lib/api/backend';

interface BackendContextType {
  // Report methods
  submitReport: (data: ReportSubmission) => Promise<{ success: boolean; report_id?: number; error?: string }>;
  
  // Donation methods
  logDonation: (data: DonationSubmission) => Promise<{ success: boolean; donation_id?: number; error?: string }>;
  
  // Facilitator methods
  getAvailableMissions: (location?: FacilitatorLocation) => Promise<{ success: boolean; missions?: any[]; error?: string }>;
  acceptMission: (missionId: number) => Promise<{ success: boolean; mission?: any; error?: string }>;
  updateMissionStatus: (missionId: number, status: string, location?: FacilitatorLocation) => Promise<{ success: boolean; mission?: any; error?: string }>;
  getMissionDetails: (missionId: number) => Promise<{ success: boolean; mission?: any; error?: string }>;
  updateFacilitatorLocation: (location: FacilitatorLocation) => Promise<{ success: boolean; error?: string }>;
  
  // Data methods
  getUserReports: () => Promise<{ success: boolean; reports?: any[]; error?: string }>;
  getUserDonations: () => Promise<{ success: boolean; donations?: any[]; error?: string }>;
  getMissionStatistics: () => Promise<{ success: boolean; stats?: any; error?: string }>;
  
  // Loading states
  isSubmittingReport: boolean;
  isLoggingDonation: boolean;
  isLoadingMissions: boolean;
  isUpdatingMission: boolean;
}

const BackendContext = createContext<BackendContextType | undefined>(undefined);

interface BackendProviderProps {
  children: ReactNode;
}

export function BackendProvider({ children }: BackendProviderProps) {
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isLoggingDonation, setIsLoggingDonation] = useState(false);
  const [isLoadingMissions, setIsLoadingMissions] = useState(false);
  const [isUpdatingMission, setIsUpdatingMission] = useState(false);

  const submitReport = async (data: ReportSubmission) => {
    setIsSubmittingReport(true);
    try {
      const result = await BackendAPI.submitReport(data);
      return result;
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const logDonation = async (data: DonationSubmission) => {
    setIsLoggingDonation(true);
    try {
      const result = await BackendAPI.logDonation(data);
      return result;
    } finally {
      setIsLoggingDonation(false);
    }
  };

  const getAvailableMissions = async (location?: FacilitatorLocation) => {
    setIsLoadingMissions(true);
    try {
      const result = await BackendAPI.getAvailableMissions(location);
      return result;
    } finally {
      setIsLoadingMissions(false);
    }
  };

  const acceptMission = async (missionId: number) => {
    setIsUpdatingMission(true);
    try {
      const result = await BackendAPI.acceptMission(missionId);
      return result;
    } finally {
      setIsUpdatingMission(false);
    }
  };

  const updateMissionStatus = async (missionId: number, status: string, location?: FacilitatorLocation) => {
    setIsUpdatingMission(true);
    try {
      const result = await BackendAPI.updateMissionStatus(missionId, status, location);
      return result;
    } finally {
      setIsUpdatingMission(false);
    }
  };

  const getMissionDetails = async (missionId: number) => {
    const result = await BackendAPI.getMissionDetails(missionId);
    return result;
  };

  const updateFacilitatorLocation = async (location: FacilitatorLocation) => {
    const result = await BackendAPI.updateFacilitatorLocation(location);
    return result;
  };

  const getUserReports = async () => {
    const result = await BackendAPI.getUserReports();
    return result;
  };

  const getUserDonations = async () => {
    const result = await BackendAPI.getUserDonations();
    return result;
  };

  const getMissionStatistics = async () => {
    const result = await BackendAPI.getMissionStatistics();
    return result;
  };

  const value: BackendContextType = {
    submitReport,
    logDonation,
    getAvailableMissions,
    acceptMission,
    updateMissionStatus,
    getMissionDetails,
    updateFacilitatorLocation,
    getUserReports,
    getUserDonations,
    getMissionStatistics,
    isSubmittingReport,
    isLoggingDonation,
    isLoadingMissions,
    isUpdatingMission,
  };

  return (
    <BackendContext.Provider value={value}>
      {children}
    </BackendContext.Provider>
  );
}

export function useBackend() {
  const context = useContext(BackendContext);
  if (context === undefined) {
    throw new Error('useBackend must be used within a BackendProvider');
  }
  return context;
}