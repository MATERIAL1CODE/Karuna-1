import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {
  Text,
  SegmentedButtons,
} from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { Heart, Mail, Phone, Lock } from 'lucide-react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { colors, spacing, borderRadius } from '@/lib/design-tokens';

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
        setError('Sign in failed. Please check your credentials and try again.');
      }
    } catch (err: any) {
      console.error('❌ Sign in error:', JSON.stringify(err, null, 2));
      
      if (err.errors?.[0]?.code === 'form_identifier_not_found') {
        setError("Account not found. Please check your email/phone or create a new account.");
      } else if (err.errors?.[0]?.code === 'form_password_incorrect') {
        setError('Incorrect password. Please try again.');
      } else if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError('Sign in failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
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
                  Welcome Back
                </Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                  Sign in to continue making a difference
                </Text>
              </View>

              <GlassCard variant="elevated" style={styles.formCard}>
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
                    error={error && authMethod === 'email' ? error : undefined}
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
                    error={error && authMethod === 'phone' ? error : undefined}
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
                  autoComplete="password"
                  leftIcon={<Lock size={20} color={colors.neutral[500]} />}
                  disabled={loading}
                />

                <GlassButton
                  title={loading ? 'Signing In...' : 'Continue'}
                  onPress={onSignInPress}
                  loading={loading}
                  disabled={loading || (authMethod === 'email' ? (!emailAddress || !password) : (!phoneNumber || !password))}
                  variant="primary"
                  size="lg"
                  style={styles.signInButton}
                />

                <GlassButton
                  title="Forgot Password?"
                  onPress={() => {}}
                  disabled={loading}
                  variant="ghost"
                  size="md"
                  style={styles.forgotButton}
                />
              </GlassCard>

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
  authMethodLabel: {
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  segmentedButtons: {
    marginBottom: spacing['3xl'],
  },
  selectedSegment: {
    backgroundColor: colors.primary[600],
  },
  signInButton: {
    marginTop: spacing.lg,
  },
  forgotButton: {
    marginTop: spacing.lg,
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
  signUpContainer: {
    flexDirection: 'row',
    marginTop: spacing['3xl'],
  },
  signUpText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
  },
  signUpLink: {
    color: colors.primary[300],
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});