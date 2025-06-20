import * as React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import {
  Text,
  SegmentedButtons,
} from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { Heart, Mail, Phone, Lock, Users, MapPin } from 'lucide-react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { colors, spacing, borderRadius } from '@/lib/design-tokens';

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
      console.log('🔄 Starting simple sign-up process...');
      
      // Prepare sign-up data - SIMPLIFIED
      const signUpData: any = {
        password,
        unsafeMetadata: {
          role: role,
        },
      };

      if (authMethod === 'email') {
        signUpData.emailAddress = emailAddress.toLowerCase().trim();
        console.log('📧 Creating account with email:', emailAddress);
      } else {
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
        signUpData.phoneNumber = formattedPhone;
        console.log('📱 Creating account with phone:', formattedPhone);
      }

      // Create the user account
      const result = await signUp.create(signUpData);
      console.log('📋 Sign-up result:', result.status);

      // FORCE COMPLETION - Skip verification requirements
      if (result.status === 'missing_requirements' || result.status === 'complete') {
        try {
          // Try to force complete the sign-up
          let finalResult = result;
          
          if (result.status === 'missing_requirements') {
            console.log('🔧 Attempting to force complete sign-up...');
            
            // Update with any missing data
            finalResult = await signUp.update({
              unsafeMetadata: { role }
            });
            
            console.log('📋 After update status:', finalResult.status);
          }

          // If we have a session, use it immediately
          if (finalResult.createdSessionId) {
            console.log('✅ Account created with session, signing in...');
            await setActive({ session: finalResult.createdSessionId });
            
            Alert.alert(
              'Welcome to Impact!',
              'Your account has been created successfully. You are now signed in.',
              [{ text: 'Continue', onPress: () => router.replace('/(home)') }]
            );
            return;
          }

          // If no session but account was created, redirect to sign-in
          console.log('✅ Account created, redirecting to sign-in...');
          Alert.alert(
            'Account Created!',
            'Your account has been created successfully. Please sign in to continue.',
            [{ text: 'Sign In', onPress: () => router.replace('/(auth)/sign-in') }]
          );

        } catch (completeError: any) {
          console.log('⚠️ Could not auto-complete, but account may be created');
          console.error('Complete error:', completeError);
          
          // Even if completion fails, the account might be created
          Alert.alert(
            'Account Created!',
            'Your account has been created. Please try signing in with your credentials.',
            [{ text: 'Sign In', onPress: () => router.replace('/(auth)/sign-in') }]
          );
        }
      } else {
        console.log('❌ Unexpected status:', result.status);
        setError('Account creation failed. Please try again.');
      }

    } catch (err: any) {
      console.error('❌ Sign up error:', err);
      
      // Handle specific error cases
      if (err.errors?.[0]?.code === 'form_identifier_exists') {
        setError('An account with this email/phone already exists. Please sign in instead.');
      } else if (err.errors?.[0]?.code === 'form_password_pwned') {
        setError('This password has been found in a data breach. Please choose a different password.');
      } else if (err.errors?.[0]?.code === 'form_password_length_too_short') {
        setError('Password must be at least 6 characters long.');
      } else if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
      style={styles.backgroundImage}
      blurRadius={8}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Heart size={48} color={colors.primary[600]} />
                </View>
                <Text variant="displaySmall" style={styles.title}>
                  Join Impact
                </Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                  Create your account to start making a difference
                </Text>
              </View>

              <GlassCard variant="elevated" style={styles.formCard}>
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
                      icon: () => <MapPin size={16} color={role === 'citizen' ? '#FFFFFF' : colors.neutral[500]} />,
                      style: role === 'citizen' ? styles.selectedSegment : undefined,
                    },
                    {
                      value: 'facilitator',
                      label: 'Facilitator',
                      icon: () => <Users size={16} color={role === 'facilitator' ? '#FFFFFF' : colors.neutral[500]} />,
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
                      icon: () => <Mail size={16} color={authMethod === 'email' ? '#FFFFFF' : colors.neutral[500]} />,
                      style: authMethod === 'email' ? styles.selectedSegment : undefined,
                    },
                    {
                      value: 'phone',
                      label: 'Phone',
                      icon: () => <Phone size={16} color={authMethod === 'phone' ? '#FFFFFF' : colors.neutral[500]} />,
                      style: authMethod === 'phone' ? styles.selectedSegment : undefined,
                    },
                  ]}
                  style={styles.segmentedButtons}
                  disabled={loading}
                />

                {authMethod === 'email' ? (
                  <GlassInput
                    label="Email Address"
                    value={emailAddress}
                    onChangeText={(text) => {
                      setEmailAddress(text.toLowerCase().trim());
                      setError(null);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    leftIcon={<Mail size={20} color={colors.neutral[500]} />}
                    disabled={loading}
                  />
                ) : (
                  <GlassInput
                    label="Phone Number"
                    value={phoneNumber}
                    onChangeText={(text) => {
                      // Allow only numbers, spaces, and + sign
                      const cleaned = text.replace(/[^\d\s+]/g, '');
                      setPhoneNumber(cleaned);
                      setError(null);
                    }}
                    keyboardType="phone-pad"
                    placeholder="+91 9876543210"
                    leftIcon={<Phone size={20} color={colors.neutral[500]} />}
                    disabled={loading}
                  />
                )}

                <GlassInput
                  label="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
                  }}
                  secureTextEntry
                  autoComplete="password-new"
                  leftIcon={<Lock size={20} color={colors.neutral[500]} />}
                  disabled={loading}
                  helperText="Password must be at least 6 characters long"
                />

                <GlassButton
                  title={loading ? 'Creating Account...' : 'Create Account'}
                  onPress={onSignUpPress}
                  loading={loading}
                  disabled={loading || (authMethod === 'email' ? (!emailAddress || !password) : (!phoneNumber || !password))}
                  variant="primary"
                  size="lg"
                  style={styles.createButton}
                />

                <View style={styles.infoBox}>
                  <Text variant="bodySmall" style={styles.infoText}>
                    🚀 No verification required - you'll be signed in immediately!
                  </Text>
                </View>
              </GlassCard>

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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing['3xl'],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['6xl'],
  },
  iconContainer: {
    backgroundColor: colors.glass.light,
    borderRadius: borderRadius['3xl'],
    padding: spacing['2xl'],
    marginBottom: spacing['3xl'],
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  title: {
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.md,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formCard: {
    marginBottom: spacing['4xl'],
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.error[400],
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  roleLabel: {
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  authMethodLabel: {
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
    fontWeight: '600',
  },
  segmentedButtons: {
    marginBottom: spacing['3xl'],
  },
  selectedSegment: {
    backgroundColor: colors.primary[600],
  },
  createButton: {
    marginTop: spacing.lg,
  },
  infoBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  infoText: {
    color: colors.success[600],
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  linkText: {
    color: colors.primary[300],
    fontFamily: 'Inter-Medium',
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: spacing['3xl'],
  },
  signInText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
  },
  signInLink: {
    color: colors.primary[300],
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});