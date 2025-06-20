import * as React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  SegmentedButtons,
} from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { Heart, Mail, Phone, Lock, Users, MapPin } from 'lucide-react-native';
import { useSignUp } from '@clerk/clerk-expo';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Form state
  const [role, setRole] = React.useState<'citizen' | 'facilitator'>('citizen');
  const [authMethod, setAuthMethod] = React.useState<'email' | 'phone'>('email');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) {
      Alert.alert('Error', 'Authentication service is not ready. Please try again.');
      return;
    }

    // Validate form
    if (authMethod === 'email') {
      if (!emailAddress || !password) {
        setError('Please fill in all fields');
        return;
      }
      if (!emailAddress.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
    } else {
      if (!phoneNumber || !password) {
        setError('Please fill in all fields');
        return;
      }
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Starting sign-up process...');
      
      // Prepare sign-up data
      const signUpData: any = {
        password,
        unsafeMetadata: {
          role: role,
        },
      };

      if (authMethod === 'email') {
        signUpData.emailAddress = emailAddress.toLowerCase().trim();
        console.log('📧 Signing up with email:', emailAddress);
      } else {
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
        signUpData.phoneNumber = formattedPhone;
        console.log('📱 Signing up with phone:', formattedPhone);
      }

      console.log('📝 Creating account with role:', role);

      // Create the user account
      const result = await signUp.create(signUpData);
      console.log('📋 Sign-up result status:', result.status);
      console.log('📋 Full sign-up result:', JSON.stringify(result, null, 2));

      // Handle different sign-up statuses
      if (result.status === 'complete') {
        console.log('✅ Sign-up completed successfully');
        
        if (result.createdSessionId) {
          console.log('🔐 Setting active session:', result.createdSessionId);
          await setActive({ session: result.createdSessionId });
          
          Alert.alert(
            'Account Created Successfully!',
            'Welcome to Impact! You are now signed in.',
            [{ text: 'Continue', onPress: () => router.replace('/(home)') }]
          );
        } else {
          console.log('⚠️ No session created, redirecting to sign-in');
          Alert.alert(
            'Account Created',
            'Your account has been created successfully! Please sign in to continue.',
            [{ text: 'Sign In', onPress: () => router.replace('/(auth)/sign-in') }]
          );
        }
      } else if (result.status === 'missing_requirements') {
        console.log('⚠️ Missing requirements, checking what is needed...');
        console.log('📋 Missing requirements:', result.missingFields);
        console.log('📋 Unverified fields:', result.unverifiedFields);
        
        // Check if email verification is required
        if (result.unverifiedFields?.includes('email_address')) {
          console.log('📧 Email verification required');
          Alert.alert(
            'Email Verification Required',
            'Please check your email and click the verification link to complete your account setup.',
            [
              { 
                text: 'I\'ll verify later', 
                onPress: () => router.replace('/(auth)/sign-in') 
              },
              { 
                text: 'Resend Email', 
                onPress: async () => {
                  try {
                    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                    Alert.alert('Email Sent', 'Verification email has been resent.');
                  } catch (error) {
                    console.error('Error resending email:', error);
                  }
                }
              }
            ]
          );
        } else if (result.unverifiedFields?.includes('phone_number')) {
          console.log('📱 Phone verification required');
          Alert.alert(
            'Phone Verification Required',
            'Please verify your phone number to complete your account setup.',
            [{ text: 'OK', onPress: () => router.replace('/(auth)/sign-in') }]
          );
        } else {
          console.log('❓ Unknown missing requirements');
          Alert.alert(
            'Account Setup Incomplete',
            'Your account was created but requires additional setup. Please try signing in.',
            [{ text: 'Sign In', onPress: () => router.replace('/(auth)/sign-in') }]
          );
        }
      } else {
        console.log('❌ Unexpected sign-up status:', result.status);
        setError(`Sign-up failed with status: ${result.status}. Please try again or contact support.`);
      }
    } catch (err: any) {
      console.error('❌ Sign up error:', err);
      console.error('❌ Error details:', JSON.stringify(err, null, 2));
      
      // Handle specific error cases
      if (err.errors?.[0]?.code === 'form_identifier_exists') {
        setError('An account with this email/phone already exists. Please sign in instead.');
      } else if (err.errors?.[0]?.code === 'form_password_pwned') {
        setError('This password has been found in a data breach. Please choose a different password.');
      } else if (err.errors?.[0]?.code === 'form_password_length_too_short') {
        setError('Password must be at least 8 characters long.');
      } else if (err.errors?.[0]?.code === 'form_password_validation_failed') {
        setError('Password does not meet security requirements. Please choose a stronger password.');
      } else if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create account. Please check your internet connection and try again.');
      }
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
                Join Impact
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                Create your account to start making a difference
              </Text>
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
                    setRole(value as 'citizen' | 'facilitator');
                    setError(null);
                  }}
                  buttons={[
                    {
                      value: 'citizen',
                      label: 'Citizen',
                      icon: () => <MapPin size={16} color={role === 'citizen' ? '#FFFFFF' : '#64748B'} />,
                      style: role === 'citizen' ? styles.selectedSegment : undefined,
                    },
                    {
                      value: 'facilitator',
                      label: 'Facilitator',
                      icon: () => <Users size={16} color={role === 'facilitator' ? '#FFFFFF' : '#64748B'} />,
                      style: role === 'facilitator' ? styles.selectedSegment : undefined,
                    },
                  ]}
                  style={styles.segmentedButtons}
                  disabled={loading}
                />

                <Text variant="labelLarge" style={styles.authMethodLabel}>
                  Sign up with:
                </Text>
                <SegmentedButtons
                  value={authMethod}
                  onValueChange={(value) => {
                    setAuthMethod(value as 'email' | 'phone');
                    setError(null);
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
                      icon: () => <Phone size={16} color={authMethod === 'phone' ? '#FFFFFF' : '#64748B'} />,
                      style: authMethod === 'phone' ? styles.selectedSegment : undefined,
                    },
                  ]}
                  style={styles.segmentedButtons}
                  disabled={loading}
                />

                {authMethod === 'email' ? (
                  <TextInput
                    label="Email Address"
                    value={emailAddress}
                    onChangeText={(text) => {
                      setEmailAddress(text.toLowerCase().trim());
                      setError(null);
                    }}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    left={<TextInput.Icon icon={() => <Mail size={20} color="#64748B" />} />}
                    style={styles.input}
                    disabled={loading}
                  />
                ) : (
                  <TextInput
                    label="Phone Number"
                    value={phoneNumber}
                    onChangeText={(text) => {
                      // Allow only numbers, spaces, and + sign
                      const cleaned = text.replace(/[^\d\s+]/g, '');
                      setPhoneNumber(cleaned);
                      setError(null);
                    }}
                    mode="outlined"
                    keyboardType="phone-pad"
                    placeholder="+91 9876543210"
                    left={<TextInput.Icon icon={() => <Phone size={20} color="#64748B" />} />}
                    style={styles.input}
                    disabled={loading}
                  />
                )}

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
                  left={<TextInput.Icon icon={() => <Lock size={20} color="#64748B" />} />}
                  style={styles.input}
                  disabled={loading}
                />

                <View style={styles.passwordRequirements}>
                  <Text variant="bodySmall" style={styles.requirementText}>
                    Password must be at least 6 characters long
                  </Text>
                </View>

                <Button
                  mode="contained"
                  onPress={onSignUpPress}
                  loading={loading}
                  disabled={loading || (authMethod === 'email' ? (!emailAddress || !password) : (!phoneNumber || !password))}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <View style={styles.infoBox}>
                  <Text variant="bodySmall" style={styles.infoText}>
                    ℹ️ You may need to verify your email/phone after account creation
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <View style={styles.footer}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>.
              </Text>

              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <Link href="/(auth)/sign-in" asChild>
                  <Text style={styles.signInLink}>Sign in</Text>
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
    backgroundColor: '#4F46E5',
  },
  input: {
    marginBottom: 16,
  },
  passwordRequirements: {
    marginBottom: 24,
  },
  requirementText: {
    color: '#64748B',
    fontSize: 12,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  infoText: {
    color: '#0369A1',
    textAlign: 'center',
    fontStyle: 'italic',
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
  signInContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  signInText: {
    color: '#64748B',
  },
  signInLink: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});