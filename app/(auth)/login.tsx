import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  SegmentedButtons,
} from 'react-native-paper';
import { Link } from 'expo-router';
import { Heart, Smartphone, Mail } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, sendOtp, verifyOtp } = useAuth();

  const handleEmailLogin = async () => {
    if (loading) {
      console.log('⚠️ Login: Already in progress, ignoring');
      return;
    }

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    console.log('🔄 Login: Starting login process...');
    setLoading(true);
    setError(null);
    
    try {
      await signIn(email, password);
      console.log('✅ Login: Sign in completed successfully');
    } catch (error: any) {
      console.error('❌ Login: Error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    // Basic Indian phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\D/g, '').slice(-10))) {
      setError('Please enter a valid 10-digit Indian phone number');
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
      await verifyOtp(phoneNumber, otp);
      console.log('✅ Login: OTP verification successful');
    } catch (error: any) {
      console.error('❌ Login: OTP verification error:', error);
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                <Heart size={48} color="#4F46E5" />
              </View>
              <Text variant="headlineLarge" style={styles.title}>
                Welcome Back
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                Sign in to continue making a difference
              </Text>
            </View>

            <Card style={styles.card} mode="elevated">
              <Card.Content style={styles.cardContent}>
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <Text variant="labelLarge" style={styles.authMethodLabel}>
                  Sign in with:
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
                      autoComplete="password"
                      style={styles.input}
                      disabled={loading}
                    />

                    <Button
                      mode="contained"
                      onPress={handleEmailLogin}
                      loading={loading}
                      disabled={loading || !email || !password}
                      style={styles.button}
                      contentStyle={styles.buttonContent}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </>
                ) : (
                  <>
                    <TextInput
                      label="Phone number"
                      value={phoneNumber}
                      onChangeText={(text) => {
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
                            {loading ? 'Verifying...' : 'Verify & Sign In'}
                          </Button>
                        </View>
                      </>
                    )}
                  </>
                )}
              </Card.Content>
            </Card>

            <View style={styles.footer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>.
              </Text>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <Link href="/(auth)/signup" asChild>
                  <Text style={styles.signupLink}>Sign up</Text>
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
    backgroundColor: '#F8F9FA',
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
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
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
  authMethodLabel: {
    color: '#1F2937',
    marginBottom: 12,
    fontWeight: '600',
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  selectedSegment: {
    backgroundColor: '#4F46E5',
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
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#4F46E5',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  signupText: {
    color: '#6B7280',
  },
  signupLink: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});