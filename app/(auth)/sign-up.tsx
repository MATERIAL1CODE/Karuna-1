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
    if (!isLoaded) return;

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

      // Basic phone number validation
      const phoneRegex = /^[+]?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
        setError('Please enter a valid phone number');
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
      console.log('🔄 Starting simplified sign-up process...');
      
      // Create sign-up data
      const signUpData: any = {
        password,
        unsafeMetadata: {
          role: role,
        },
        // Skip verification by not requesting it
        skipVerification: true,
      };

      if (authMethod === 'email') {
        signUpData.emailAddress = emailAddress;
      } else {
        signUpData.phoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      }

      console.log('📝 Creating sign-up with data:', { 
        method: authMethod, 
        identifier: authMethod === 'email' ? emailAddress : phoneNumber,
        role 
      });

      // Create the user directly without verification
      const result = await signUp.create(signUpData);
      console.log('📋 Sign-up creation result:', result.status);

      // If sign-up is complete, set active session and redirect
      if (result.status === 'complete') {
        console.log('✅ Sign-up complete, setting active session');
        await setActive({ session: result.createdSessionId });
        router.replace('/(home)');
      } else {
        // If not complete, try to complete it manually
        console.log('⚠️ Sign-up not complete, attempting to complete...');
        
        try {
          // Try to complete the sign-up without verification
          const completeResult = await signUp.update({
            unsafeMetadata: {
              role: role,
            }
          });
          
          if (completeResult.status === 'complete') {
            console.log('✅ Sign-up completed after update');
            await setActive({ session: completeResult.createdSessionId });
            router.replace('/(home)');
          } else {
            console.error('⚠️ Could not complete sign-up:', completeResult.status);
            setError('Account created but could not sign in automatically. Please try signing in.');
          }
        } catch (completeError) {
          console.error('❌ Error completing sign-up:', completeError);
          setError('Account created but could not sign in automatically. Please try signing in.');
        }
      }
    } catch (err: any) {
      console.error('❌ Sign up error:', JSON.stringify(err, null, 2));
      
      if (err.errors?.[0]?.code === 'form_identifier_exists') {
        setError('An account with this email/phone already exists. Please sign in instead.');
      } else if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError('Failed to create account. Please try again.');
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
              <View style={styles.simplifiedBadge}>
                <Text variant="bodySmall" style={styles.simplifiedBadgeText}>
                  ✨ Quick Sign-Up - No Verification Required
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
                  {loading ? 'Creating Account...' : 'Create Account & Sign In'}
                </Button>

                <View style={styles.infoBox}>
                  <Text variant="bodySmall" style={styles.infoText}>
                    🚀 Your account will be created instantly without email/phone verification
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
  simplifiedBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  simplifiedBadgeText: {
    color: '#047857',
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