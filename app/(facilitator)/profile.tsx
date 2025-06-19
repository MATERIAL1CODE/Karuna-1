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
  Badge,
} from 'react-native-paper';
import { router } from 'expo-router';
import { User, Award, Settings, ArrowLeft, CircleHelp as HelpCircle, Info } from 'lucide-react-native';

export default function FacilitatorProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color="#6B7280" />} 
          onPress={() => router.replace('/')} 
        />
        <Appbar.Content title="Profile" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#4F46E5" />
          </View>
          <Text variant="headlineSmall" style={styles.name}>
            Volunteer
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
                <Award size={20} color="#4F46E5" />
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
              left={() => <Settings size={20} color="#6B7280" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.menuItemTitle}
            />
            <Divider />
            <List.Item
              title="Mission History"
              left={() => <List.Icon icon="history" />}
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
          onPress={() => router.replace('/')}
          style={styles.switchRoleButton}
          contentStyle={styles.buttonContent}
          textColor="#4F46E5"
        >
          Switch Role
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
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  role: {
    color: '#6B7280',
  },
  badge: {
    backgroundColor: '#10B981',
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
  switchRoleButton: {
    borderColor: '#4F46E5',
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});