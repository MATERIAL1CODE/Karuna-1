import React, { useState, useEffect, Platform } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  SegmentedButtons,
} from 'react-native-paper';
import { Link, router } from 'expo-router';
import { Heart, CircleCheck as CheckCircle, Smartphone, Mail } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';

// Import OTP verification only for mobile platforms
let useOtpVerify: any = null;
if (Platform.OS !== 'web') {
  try {
    const otpVerify = require('react-native-otp-verify');
    useOtpVerify = otpVerify.useOtpVerify;
  } catch (error) {
    console.log('OTP verification not available on this platform');
  }
}

export default function Signup() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signUp, sendOtp, verifyOtp } = useAuth();

  // Auto-fill OTP on mobile platforms
  useEffect(() => {
    if (Platform.OS !== 'web' && useOtpVerify && otpSent) {
      const { hash, otp: autoOtp, message, timeoutError, stopListener, startListener } = useOtpVerify({
        numberOfDigits: 6,
      });

      if (autoOtp) {
        setOtp(autoOtp);
      }

      return () => {
        stopListener();
      };
    }
  }, [otpSent]);

  const validateEmailForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const validatePhoneForm = () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return false;
    }

    // Basic Indian phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\D/g, '').slice(-10))) {
      setError('Please enter a valid 10-digit Indian phone number');
      return false;
    }

    return true;
  };

  const handleEmailSignup = async () => {
    if (!validateEmailForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await signUp(email, password, role);
      setSuccess(true);
      
      // For prototype mode - redirect immediately to login
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 2000);
    } catch (error: any) {
      console.error('Email signup error:', error);
      
      if (error.message?.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (error.message?.includes('Password should be at least')) {
        setError('Password must be at least 6 characters long');
      } else if (error.message?.includes('Invalid email')) {
        setError('Please enter a valid email address');
      } else {
        setError(error.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!validatePhoneForm()) {
      return;
    }

    setOtpLoading(true);
    setError(null);
    
    try {
      await sendOtp(phoneNumber);
      setOtpSent(true);
    } catch (error: any) {
      console.error('OTP send error:', error);
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await verifyOtp(phoneNumber, otp, role);
      setSuccess(true);
      
      // Redirect to main app
      setTimeout(() => {
        router.replace('/');
      }, 2000);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={[styles.iconContainer, styles.successIconContainer]}>
            <CheckCircle size={48} color="#10B981" />
          </View>
          <Text variant="headlineMedium" style={styles.successTitle}>
            Account Created Successfully!
          </Text>
          <Text variant="bodyLarge" style={styles.successText}>
            Welcome to Impact! Your account is ready to use. You can now start making a difference in your community.
          </Text>
          <View style={styles.successNote}>
            <Text variant="bodySmall" style={styles.successNoteText}>
              🚀 {authMethod === 'phone' ? 'Phone verified successfully' : 'Prototype Mode: No email confirmation required'}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Heart size={48} color="#2563EB" />
              </View>
              <Text variant="headlineLarge" style={styles.title}>
                Join Impact
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                Create your account to start making a difference
              </Text>
              <View style={styles.prototypeBadge}>
                <Text variant="bodySmall" style={styles.prototypeBadgeText}>
                  🚀 Multiple Signup Options Available
                </Text>
              </View>
            </View>

            <Card style={styles.card} mode="elevated">
              <Card.Content style={styles.cardContent}>
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <Text variant="labelLarge" style={styles.roleLabel}>
                  I want to join as:
                </Text>
                <SegmentedButtons
                  value={role}
                  onValueChange={(value) => {
                    setRole(value as UserRole);
                    setError(null);
                  }}
                  buttons={[
                    {
                      value: 'citizen',
                      label: 'Citizen',
                      style: role === 'citizen' ? styles.selectedSegment : undefined,
                    },
                    {
                      value: 'facilitator',
                      label: 'Facilitator',
                      style: role === 'facilitator' ? styles.selectedSegment : undefined,
                    },
                  ]}
                  style={styles.segmentedButtons}
                  disabled={loading || otpLoading}
                />

                <Text variant="labelLarge" style={styles.authMethodLabel}>
                  Signup method:
                </Text>
                <SegmentedButtons
                  value={authMethod}
                  onValueChange={(value) => {
                    setAuthMethod(value as 'email' | 'phone');
                    setError(null);
                    setOtpSent(false);
                    setOtp('');
                  }}
                  buttons={[
                    {
                      value: 'email',
                      label: 'Email',
                      icon: () => <Mail size={16} color={authMethod === 'email' ? '#FFFFFF' : '#64748B'} />,
                      style: authMethod === 'email' ? styles.selectedSegment : undefined,
                    },
                    {
                      value: 'phone',
                      label: 'Phone',
                      icon: () => <Smartphone size={16} color={authMethod === 'phone' ? '#FFFFFF' : '#64748B'} />,
                      style: authMethod === 'phone' ? styles.selectedSegment : undefined,
                    },
                  ]}
                  style={styles.segmentedButtons}
                  disabled={loading || otpLoading}
                />

                {authMethod === 'email' ? (
                  <>
                    <TextInput
                      label="Email address"
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        setError(null);
                      }}
                      mode="outlined"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      style={styles.input}
                      disabled={loading}
                    />

                    <TextInput
                      label="Password"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setError(null);
                      }}
                      mode="outlined"
                      secureTextEntry
                      autoComplete="password-new"
                      style={styles.input}
                      disabled={loading}
                    />

                    <TextInput
                      label="Confirm Password"
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        setError(null);
                      }}
                      mode="outlined"
                      secureTextEntry
                      autoComplete="password-new"
                      style={styles.input}
                      disabled={loading}
                    />

                    <Button
                      mode="contained"
                      onPress={handleEmailSignup}
                      loading={loading}
                      disabled={loading || !email || !password || !confirmPassword}
                      style={styles.button}
                      contentStyle={styles.buttonContent}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </>
                ) : (
                  <>
                    <TextInput
                      label="Phone number"
                      value={phoneNumber}
                      onChangeText={(text) => {
                        // Remove non-numeric characters and limit to 10 digits
                        const cleaned = text.replace(/\D/g, '').slice(0, 10);
                        setPhoneNumber(cleaned);
                        setError(null);
                      }}
                      mode="outlined"
                      keyboardType="phone-pad"
                      placeholder="9876543210"
                      style={styles.input}
                      disabled={loading || otpLoading || otpSent}
                      left={<TextInput.Affix text="+91 " />}
                    />

                    {!otpSent ? (
                      <Button
                        mode="contained"
                        onPress={handleSendOtp}
                        loading={otpLoading}
                        disabled={otpLoading || !phoneNumber}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                      >
                        {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                      </Button>
                    ) : (
                      <>
                        <TextInput
                          label="Enter OTP"
                          value={otp}
                          onChangeText={(text) => {
                            // Only allow numeric input and limit to 6 digits
                            const cleaned = text.replace(/\D/g, '').slice(0, 6);
                            setOtp(cleaned);
                            setError(null);
                          }}
                          mode="outlined"
                          keyboardType="number-pad"
                          placeholder="123456"
                          style={styles.input}
                          disabled={loading}
                          maxLength={6}
                        />

                        <View style={styles.otpActions}>
                          <Button
                            mode="outlined"
                            onPress={() => {
                              setOtpSent(false);
                              setOtp('');
                              setError(null);
                            }}
                            disabled={loading}
                            style={styles.resendButton}
                          >
                            Change Number
                          </Button>

                          <Button
                            mode="contained"
                            onPress={handleVerifyOtp}
                            loading={loading}
                            disabled={loading || otp.length !== 6}
                            style={styles.verifyButton}
                            contentStyle={styles.buttonContent}
                          >
                            {loading ? 'Verifying...' : 'Verify & Create Account'}
                          </Button>
                        </View>

                        <Text variant="bodySmall" style={styles.otpNote}>
                          {Platform.OS !== 'web' ? 
                            'OTP will be auto-filled when received' : 
                            'Enter the 6-digit code sent to your phone'
                          }
                        </Text>
                      </>
                    )}
                  </>
                )}
              </Card.Content>
            </Card>

            <View style={styles.footer}>
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Link href="/(auth)/login" asChild>
                  <Text style={styles.loginLink}>Sign in</Text>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    backgroundColor: '#EBF4FF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  prototypeBadge: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0EA5E9',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  prototypeBadgeText: {
    color: '#0369A1',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    borderRadius: 16,
  },
  cardContent: {
    padding: 32,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  roleLabel: {
    color: '#1E293B',
    marginBottom: 12,
    fontWeight: '600',
  },
  authMethodLabel: {
    color: '#1E293B',
    marginBottom: 12,
    marginTop: 16,
    fontWeight: '600',
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  selectedSegment: {
    backgroundColor: '#2563EB',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  otpActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  resendButton: {
    flex: 1,
    borderColor: '#64748B',
    borderRadius: 12,
  },
  verifyButton: {
    flex: 2,
    borderRadius: 12,
  },
  otpNote: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
  },
  loginText: {
    color: '#64748B',
  },
  loginLink: {
    color: '#2563EB',
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIconContainer: {
    backgroundColor: '#ECFDF5',
  },
  successTitle: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  successNote: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
  },
  successNoteText: {
    color: '#0369A1',
    textAlign: 'center',
  },
});