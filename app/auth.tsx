import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
} from 'react-native-paper';
import { Heart, User, Users, Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

type AuthMode = 'signin' | 'signup';
type UserRole = 'citizen' | 'facilitator';

export default function AuthScreen() {
  const theme = useTheme();
  const { signIn, signUp, isLoading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (mode === 'signup' && !fullName) {
      setError('Please enter your full name');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      let result;
      
      if (mode === 'signup') {
        result = await signUp(email, password, fullName, selectedRole);
        if (!result.error) {
          setError('');
          // Show success message for email verification
          setMode('signin');
          setError('Account created! Please check your email to verify your account, then sign in.');
          return;
        }
      } else {
        // For sign-in, pass the selected role for validation
        result = await signIn(email, password, selectedRole);
        if (!result.error) {
          // Navigation will be handled automatically by the auth state change
          return;
        }
      }

      if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Heart size={48} color={theme.colors.primary} />
            </View>
            <Text variant="displaySmall" style={styles.title}>
              Welcome to Sahayata
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Making a difference together
            </Text>
          </View>

          {/* Auth Form */}
          <View style={styles.formContainer}>
            <Text variant="headlineSmall" style={styles.formTitle}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Full Name (Sign Up Only) */}
            {mode === 'signup' && (
              <View style={styles.inputContainer}>
                <Text variant="labelLarge" style={styles.inputLabel}>
                  Full Name *
                </Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  mode="outlined"
                  placeholder="Enter your full name"
                  style={styles.input}
                  left={<TextInput.Icon icon={() => <User size={20} color={theme.colors.onSurfaceVariant} />} />}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                />
              </View>
            )}

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text variant="labelLarge" style={styles.inputLabel}>
                Email Address *
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon={() => <Mail size={20} color={theme.colors.onSurfaceVariant} />} />}
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text variant="labelLarge" style={styles.inputLabel}>
                Password *
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon={() => <Lock size={20} color={theme.colors.onSurfaceVariant} />} />}
                right={
                  <TextInput.Icon 
                    icon={() => showPassword ? <EyeOff size={20} color={theme.colors.onSurfaceVariant} /> : <Eye size={20} color={theme.colors.onSurfaceVariant} />}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
              />
            </View>

            {/* Role Selection (Both Sign Up and Sign In) */}
            <View style={styles.inputContainer}>
              <Text variant="labelLarge" style={styles.inputLabel}>
                {mode === 'signup' ? 'I want to join as *' : 'I am signing in as *'}
              </Text>
              <View style={styles.roleSelector}>
                <Pressable
                  style={[
                    styles.roleOption,
                    selectedRole === 'citizen' && styles.roleOptionSelected
                  ]}
                  onPress={() => setSelectedRole('citizen')}
                >
                  <View style={styles.roleIconContainer}>
                    <User size={24} color={selectedRole === 'citizen' ? theme.colors.primary : theme.colors.onSurfaceVariant} />
                  </View>
                  <View style={styles.roleTextContainer}>
                    <Text variant="titleMedium" style={[
                      styles.roleTitle,
                      selectedRole === 'citizen' && styles.roleTitleSelected
                    ]}>
                      Citizen
                    </Text>
                    <Text variant="bodySmall" style={styles.roleDescription}>
                      Report needs and donate resources
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  style={[
                    styles.roleOption,
                    selectedRole === 'facilitator' && styles.roleOptionSelected
                  ]}
                  onPress={() => setSelectedRole('facilitator')}
                >
                  <View style={styles.roleIconContainer}>
                    <Users size={24} color={selectedRole === 'facilitator' ? theme.colors.primary : theme.colors.onSurfaceVariant} />
                  </View>
                  <View style={styles.roleTextContainer}>
                    <Text variant="titleMedium" style={[
                      styles.roleTitle,
                      selectedRole === 'facilitator' && styles.roleTitleSelected
                    ]}>
                      Facilitator
                    </Text>
                    <Text variant="bodySmall" style={styles.roleDescription}>
                      Accept missions and coordinate aid
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || isLoading}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>

            {/* Toggle Mode */}
            <View style={styles.toggleContainer}>
              <Text variant="bodyMedium" style={styles.toggleText}>
                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
              </Text>
              <Pressable onPress={toggleMode}>
                <Text variant="bodyMedium" style={styles.toggleLink}>
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
  },
  title: {
    fontWeight: '800',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  formContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  formTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Inter-Bold',
  },
  errorContainer: {
    backgroundColor: theme.colors.errorContainer,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    color: theme.colors.onSurface,
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  roleSelector: {
    gap: 16,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    backgroundColor: theme.colors.surface,
  },
  roleOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryContainer,
  },
  roleIconContainer: {
    marginRight: 16,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  roleTitleSelected: {
    color: theme.colors.primary,
  },
  roleDescription: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    marginTop: 16,
  },
  submitButtonContent: {
    paddingVertical: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  toggleText: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  toggleLink: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});