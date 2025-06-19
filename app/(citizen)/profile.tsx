import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  List,
  Divider,
  Appbar,
} from 'react-native-paper';
import { router } from 'expo-router';
import { User, Heart, Settings, LogOut, CircleHelp as HelpCircle, Info } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const getUserName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (profile?.email) {
      return profile.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Content title="Profile" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#4F46E5" />
          </View>
          <Text variant="headlineSmall" style={styles.name}>
            {getUserName()}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {profile?.email}
          </Text>
          <Text variant="bodyMedium" style={styles.role}>
            Community Member
          </Text>
        </View>

        <Card style={styles.statsCard} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.statsTitle}>
              Your Impact
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Heart size={20} color="#4F46E5" />
                <Text variant="labelLarge" style={styles.statNumber}>12</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Reports</Text>
              </View>
              <View style={styles.statItem}>
                <Heart size={20} color="#10B981" />
                <Text variant="labelLarge" style={styles.statNumber}>8</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Donations</Text>
              </View>
              <View style={styles.statItem}>
                <Heart size={20} color="#F59E0B" />
                <Text variant="labelLarge" style={styles.statNumber}>45</Text>
                <Text variant="bodySmall" style={styles.statLabel}>People Helped</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.menuCard} mode="elevated">
          <List.Section>
            <List.Item
              title="Account Settings"
              left={() => <Settings size={20} color="#6B7280" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.menuItemTitle}
            />
            <Divider />
            <List.Item
              title="Help & Support"
              left={() => <HelpCircle size={20} color="#6B7280" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.menuItemTitle}
            />
            <Divider />
            <List.Item
              title="About Impact"
              left={() => <Info size={20} color="#6B7280" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.menuItemTitle}
            />
          </List.Section>
        </Card>

        <Button
          mode="outlined"
          onPress={handleSignOut}
          style={styles.signOutButton}
          contentStyle={styles.signOutContent}
          icon={() => <LogOut size={20} color="#EF4444" />}
          textColor="#EF4444"
        >
          Sign Out
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#F8F9FA',
    elevation: 0,
  },
  headerTitle: {
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollContent: {
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    backgroundColor: '#EBF4FF',
    borderRadius: 50,
    padding: 20,
    marginBottom: 16,
  },
  name: {
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  email: {
    color: '#6B7280',
    marginBottom: 4,
  },
  role: {
    color: '#4F46E5',
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  statsTitle: {
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    color: '#6B7280',
    textAlign: 'center',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    borderRadius: 16,
    elevation: 2,
  },
  menuItemTitle: {
    color: '#1F2937',
    fontWeight: '500',
  },
  signOutButton: {
    borderColor: '#EF4444',
    borderRadius: 12,
  },
  signOutContent: {
    paddingVertical: 8,
  },
});