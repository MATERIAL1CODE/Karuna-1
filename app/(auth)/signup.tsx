import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  SegmentedButtons,
} from 'react-native-paper';
import { Link } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, role);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Signup failed');
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
        <View style={styles.content}>
          <View style={styles.header}>
            <Heart size={48} color="#2563EB" />
            <Text variant="headlineLarge" style={styles.title}>
              Join Impact
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Create your account to start making a difference.
            </Text>
          </View>

          <Card style={styles.card} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <Text variant="labelLarge" style={styles.roleLabel}>
                I want to join as:
              </Text>
              <SegmentedButtons
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
                buttons={[
                  {
                    value: 'citizen',
                    label: 'Citizen',
                  },
                  {
                    value: 'facilitator',
                    label: 'Facilitator',
                  },
                ]}
                style={styles.segmentedButtons}
              />

              <TextInput
                label="Email address"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
              />

              <Button
                mode="contained"
                onPress={handleSignup}
                loading={loading}
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Create Account
              </Button>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  cardContent: {
    padding: 32,
  },
  roleLabel: {
    marginBottom: 12,
    color: '#1E293B',
  },
  segmentedButtons: {
    marginBottom: 24,
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
});