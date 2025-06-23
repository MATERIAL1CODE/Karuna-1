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
import { User, Award, Settings, ArrowLeft, CircleHelp as HelpCircle, Info, Star } from 'lucide-react-native';

export default function FacilitatorProfileScreen() {
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
            Community Volunteer
          </Text>
          <View style={styles.roleContainer}>
            <Text variant="bodyMedium" style={styles.role}>
              Verified Facilitator
            </Text>
            <Badge style={styles.badge} size={20}>
              ACTIVE
            </Badge>
          </View>
          <View style={styles.ratingContainer}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text variant="bodyMedium" style={styles.rating}>
              4.9 Rating
            </Text>
          </View>
        </View>

        <Card style={styles.statsCard} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.statsTitle}>
              Your Impact This Month
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Award size={20} color="#4F46E5" />
                </View>
                <Text variant="titleMedium" style={styles.statNumber}>25</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Missions</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Award size={20} color="#10B981" />
                </View>
                <Text variant="titleMedium" style={styles.statNumber}>150</Text>
                <Text variant="bodySmall" style={styles.statLabel}>People Helped</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Award size={20} color="#F59E0B" />
                </View>
                <Text variant="titleMedium" style={styles.statNumber}>45h</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Time Donated</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.achievementsCard} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.achievementsTitle}>
              Recent Achievements
            </Text>
            <View style={styles.achievementsList}>
              <View style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  <Award size={16} color="#F59E0B" />
                </View>
                <Text variant="bodyMedium" style={styles.achievementText}>
                  Completed 25 missions this month
                </Text>
              </View>
              <View style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  <Star size={16} color="#4F46E5" />
                </View>
                <Text variant="bodyMedium" style={styles.achievementText}>
                  Maintained 4.9+ rating for 3 months
                </Text>
              </View>
            </View>
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
              title="Mission History"
              description="View all your completed missions"
              left={() => <List.Icon icon="history" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
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
          onPress={() => router.replace('/(citizen)')}
          style={styles.switchRoleButton}
          contentStyle={styles.buttonContent}
          textColor="#4F46E5"
        >
          Switch to Citizen Mode
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
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  role: {
    color: '#64748B',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#10B981',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: '#F59E0B',
    fontWeight: '600',
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
  achievementsCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  achievementsTitle: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIcon: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 8,
  },
  achievementText: {
    color: '#64748B',
    flex: 1,
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