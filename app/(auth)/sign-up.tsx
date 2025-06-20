import * as React from 'react';
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
import { Link, useRouter } from 'expo-router';
import { Heart, Mail, Phone, Lock } from 'lucide-react-native';
import { useSignUp } from '@clerk/clerk-expo';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Form state
  const [authMethod, setAuthMethod] = React.useState<'email' | 'phone'>('email');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Handle email sign-up
  const onEmailSignUpPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!emailAddress.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Start sign-up process using email and password provided
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Email sign up error:', JSON.stringify(err, null, 2));
      
      if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle phone sign-up
  const onPhoneSignUpPress = async () => {
    if (!isLoaded) return;

    if (!phoneNumber || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[+]?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Start sign-up process using phone and password
      await signUp.create({
        phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`,
        password,
      });

      // Send user an SMS with verification code
      await signUp.preparePhoneNumberVerification({ strategy: 'phone_code' });

      // Set 'pendingVerification' to true to display second form
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Phone sign up error:', JSON.stringify(err, null, 2));
      
      if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle verification
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!code || code.length < 4) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = authMethod === 'email' 
        ? await signUp.attemptEmailAddressVerification({ code })
        : await signUp.attemptPhoneNumberVerification({ code });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/(home)');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error('Verification incomplete:', JSON.stringify(signUpAttempt, null, 2));
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Verification error:', JSON.stringify(err, null, 2));
      
      if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
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
                  {authMethod === 'email' ? (
                    <Mail size={48} color="#4F46E5" />
                  ) : (
                    <Phone size={48} color="#4F46E5" />
                  )}
                </View>
                <Text variant="headlineLarge" style={styles.title}>
                  Verify Your {authMethod === 'email' ? 'Email' : 'Phone'}
                </Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                  We've sent a verification code to{' '}
                  {authMethod === 'email' ? emailAddress : phoneNumber}
                </Text>
              </View>

              <Card style={styles.card} mode="elevated">
                <Card.Content style={styles.cardContent}>
                  {error && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  <TextInput
                    label="Verification Code"
                    value={code}
                    onChangeText={(text) => {
                      setCode(text.replace(/\D/g, ''));
                      setError(null);
                    }}
                    mode="outlined"
                    keyboardType="number-pad"
                    placeholder="Enter verification code"
                    style={styles.input}
                    disabled={loading}
                  />

                  <Button
                    mode="contained"
                    onPress={onVerifyPress}
                    loading={loading}
                    disabled={loading || !code}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </Button>

                  <Button
                    mode="text"
                    onPress={() => {
                      setPendingVerification(false);
                      setCode('');
                      setError(null);
                    }}
                    disabled={loading}
                    style={styles.backButton}
                  >
                    Back to Sign Up
                  </Button>
                </Card.Content>
              </Card>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
                  <>
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
                  </>
                ) : (
                  <>
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
                  </>
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
                    Password must be at least 8 characters long
                  </Text>
                </View>

                <Button
                  mode="contained"
                  onPress={authMethod === 'email' ? onEmailSignUpPress : onPhoneSignUpPress}
                  loading={loading}
                  disabled={loading || (authMethod === 'email' ? (!emailAddress || !password) : (!phoneNumber || !password))}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  {loading ? 'Creating Account...' : 'Continue'}
                </Button>
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
    color: '#1E293B',
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
  backButton: {
    marginTop: 16,
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