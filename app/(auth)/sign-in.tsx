import React from 'react';
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
import { useSignIn } from '@clerk/clerk-expo';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  // Form state
  const [authMethod, setAuthMethod] = React.useState<'email' | 'phone'>('email');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    const identifier = authMethod === 'email' ? emailAddress : phoneNumber;
    
    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (authMethod === 'email' && !emailAddress.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Starting sign-in process...');
      console.log('📝 Sign-in data:', { 
        method: authMethod, 
        identifier: authMethod === 'email' ? emailAddress : phoneNumber 
      });

      // Start the sign-in process using the email/phone and password provided
      const signInAttempt = await signIn.create({
        identifier: authMethod === 'email' ? emailAddress : (phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`),
        password,
      });

      console.log('📋 Sign-in attempt result:', signInAttempt.status);

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        console.log('✅ Sign-in complete, setting active session');
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(home)');
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error('⚠️ Sign in incomplete:', JSON.stringify(signInAttempt, null, 2));
        setError('Sign in failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('❌ Sign in error:', JSON.stringify(err, null, 2));
      
      if (err.errors?.[0]?.code === 'form_identifier_not_found') {
        setError("Couldn't find your account. Please check your email/phone or sign up.");
      } else if (err.errors?.[0]?.code === 'form_password_incorrect') {
        setError('Incorrect password. Please try again.');
      } else if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError('Invalid credentials. Please try again.');
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
                  autoComplete="password"
                  left={<TextInput.Icon icon={() => <Lock size={20} color="#64748B" />} />}
                  style={styles.input}
                  disabled={loading}
                />

                <Button
                  mode="contained"
                  onPress={onSignInPress}
                  loading={loading}
                  disabled={loading || (authMethod === 'email' ? (!emailAddress || !password) : (!phoneNumber || !password))}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  {loading ? 'Signing In...' : 'Continue'}
                </Button>

                <Button
                  mode="text"
                  onPress={() => {}}
                  disabled={loading}
                  style={styles.forgotButton}
                  textColor="#4F46E5"
                >
                  Forgot Password?
                </Button>
              </Card.Content>
            </Card>

            <View style={styles.footer}>
              <Text style={styles.termsText}>
                By signing in, you agree to our{' '}
                <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>.
              </Text>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <Link href="/(auth)/sign-up" asChild>
                  <Text style={styles.signUpLink}>Sign up</Text>
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
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  forgotButton: {
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
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  signUpText: {
    color: '#64748B',
  },
  signUpLink: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});