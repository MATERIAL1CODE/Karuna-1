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
  Badge,
} from 'react-native-paper';
import { router } from 'expo-router';
import { User, Award, Settings, LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function FacilitatorProfileScreen() {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#2563EB" />
          </View>
          <Text variant="headlineSmall" style={styles.name}>
            {profile?.email}
          </Text>
          <View style={styles.roleContainer}>
            <Text variant="bodyMedium" style={styles.role}>
              Verified Facilitator
            </Text>
            <Badge style={styles.badge}>ACTIVE</Badge>
          </View>
        </View>

        <Card style={styles.statsCard} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.statsTitle}>
              Your Impact
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Award size={20} color="#2563EB" />
                <Text variant="labelLarge" style={styles.statNumber}>25</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Missions</Text>
              </View>
              <View style={styles.statItem}>
                <Award size={20} color="#10B981" />
                <Text variant="labelLarge" style={styles.statNumber}>150</Text>
                <Text variant="bodySmall" style={styles.statLabel}>People Helped</Text>
              </View>
              <View style={styles.statItem}>
                <Award size={20} color="#F59E0B" />
                <Text variant="labelLarge" style={styles.statNumber}>4.9</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.menuCard} mode="elevated">
          <List.Section>
            <List.Item
              title="Account Settings"
              left={(props) => <Settings {...props} size={20} color="#64748B" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Mission History"
              left={(props) => <List.Icon {...props} icon="history" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Help & Support"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="About Impact"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
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
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
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
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  role: {
    color: '#64748B',
  },
  badge: {
    backgroundColor: '#10B981',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 16,
  },
  statsTitle: {
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
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
    color: '#1E293B',
  },
  statLabel: {
    color: '#64748B',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    borderRadius: 16,
  },
  signOutButton: {
    borderColor: '#EF4444',
    borderRadius: 12,
  },
  signOutContent: {
    paddingVertical: 8,
  },
});