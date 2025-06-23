import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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
import { User, Heart, Settings, ArrowLeft, CircleHelp as HelpCircle, Info } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color="#6B7280" />} 
          onPress={() => router.replace('/(home)')} 
        />
        <Appbar.Content title="Profile" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#4F46E5" />
          </View>
          <Text variant="headlineSmall" style={styles.name}>
            Community Member
          </Text>
          <Text variant="bodyMedium" style={styles.role}>
            Citizen
          </Text>
        </View>

        <Card style={styles.statsCard} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.statsTitle}>
              Your Impact This Month
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Heart size={20} color="#4F46E5" />
                </View>
                <Text variant="titleMedium" style={styles.statNumber}>12</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Reports</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Heart size={20} color="#10B981" />
                </View>
                <Text variant="titleMedium" style={styles.statNumber}>8</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Donations</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Heart size={20} color="#F59E0B" />
                </View>
                <Text variant="titleMedium" style={styles.statNumber}>45</Text>
                <Text variant="bodySmall" style={styles.statLabel}>People Helped</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.impactCard} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.impactTitle}>
              Community Impact
            </Text>
            <Text variant="bodyMedium" style={styles.impactText}>
              Thank you for being an active member of our community! Your reports and donations have made a real difference in people's lives.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.menuCard} mode="elevated">
          <List.Section>
            <List.Item
              title="Account Settings"
              description="Update your profile and preferences"
              left={() => <Settings size={20} color="#64748B" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.menuItemTitle}
              descriptionStyle={styles.menuItemDescription}
            />
            <Divider />
            <List.Item
              title="My Activity"
              description="View your reports and donations"
              left={() => <List.Icon icon="history" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => router.push('/(citizen)/activity')}
              titleStyle={styles.menuItemTitle}
              descriptionStyle={styles.menuItemDescription}
            />
            <Divider />
            <List.Item
              title="Help & Support"
              description="Get help or contact support"
              left={() => <HelpCircle size={20} color="#64748B" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.menuItemTitle}
              descriptionStyle={styles.menuItemDescription}
            />
            <Divider />
            <List.Item
              title="About Impact"
              description="Learn more about our mission"
              left={() => <Info size={20} color="#64748B" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.menuItemTitle}
              descriptionStyle={styles.menuItemDescription}
            />
          </List.Section>
        </Card>

        <Button
          mode="outlined"
          onPress={() => router.replace('/(home)')}
          style={styles.switchRoleButton}
          contentStyle={styles.buttonContent}
          textColor="#4F46E5"
        >
          Switch to Facilitator Mode
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
  header: {
    backgroundColor: '#F8FAFC',
    elevation: 0,
  },
  headerTitle: {
    fontWeight: '700',
    color: '#1E293B',
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
    color: '#1E293B',
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
    color: '#1E293B',
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
  statIconContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 8,
  },
  statNumber: {
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    color: '#64748B',
    textAlign: 'center',
  },
  impactCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  impactTitle: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  impactText: {
    color: '#64748B',
    lineHeight: 20,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    borderRadius: 16,
    elevation: 2,
  },
  menuItemTitle: {
    color: '#1E293B',
    fontWeight: '600',
  },
  menuItemDescription: {
    color: '#64748B',
    fontSize: 12,
  },
  switchRoleButton: {
    borderColor: '#4F46E5',
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});