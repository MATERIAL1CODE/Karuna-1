import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  List,
  Divider,
  Appbar,
  Badge,
  TextInput,
} from 'react-native-paper';
import { router } from 'expo-router';
import { 
  User, 
  Award, 
  Settings, 
  ArrowLeft, 
  CircleHelp as HelpCircle, 
  Info, 
  Star, 
  TrendingUp,
  Bell,
  Shield,
  Globe,
  Smartphone,
  Mail,
  MapPin,
  Save,
  Truck
} from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

export default function FacilitatorProfileScreen() {
  // Profile settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [missionAlerts, setMissionAlerts] = useState(true);
  const [name, setName] = useState('Community Volunteer');
  const [email, setEmail] = useState('volunteer@example.com');
  const [phone, setPhone] = useState('+91 87654 32109');

  const handleSave = () => {
    // Handle save logic here
    console.log('Settings saved');
    // Show success feedback or navigate back
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color={colors.neutral[600]} />} 
          onPress={() => router.replace('/(home)')} 
        />
        <Appbar.Content title="Profile" titleStyle={styles.headerTitle} />
        <Appbar.Action 
          icon={() => <Save size={24} color={colors.primary[600]} />} 
          onPress={handleSave} 
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color={colors.primary[600]} />
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
            <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
            <Text variant="bodyMedium" style={styles.rating}>
              4.9 Rating
            </Text>
          </View>
        </View>

        {/* Impact Dashboard */}
        <Card style={styles.impactCard} mode="elevated">
          <Card.Content style={styles.impactCardContent}>
            <Text variant="titleMedium" style={styles.impactTitle}>
              Impact Dashboard
            </Text>
            
            {/* Hero Metric */}
            <View style={styles.heroMetric}>
              <Text variant="displaySmall" style={styles.heroNumber}>
                452
              </Text>
              <Text variant="titleMedium" style={styles.heroLabel}>
                People Helped
              </Text>
            </View>

            {/* Supporting Metrics */}
            <View style={styles.supportingMetrics}>
              <View style={styles.supportingMetric}>
                <Text variant="headlineSmall" style={styles.supportingNumber}>
                  112
                </Text>
                <Text variant="bodySmall" style={styles.supportingLabel}>
                  Missions Completed
                </Text>
              </View>
              <View style={styles.supportingMetric}>
                <Text variant="headlineSmall" style={styles.supportingNumber}>
                  45h
                </Text>
                <Text variant="bodySmall" style={styles.supportingLabel}>
                  Time Donated
                </Text>
              </View>
            </View>

            <Text variant="bodyMedium" style={styles.activeSince}>
              Active Since June 2024
            </Text>
          </Card.Content>
        </Card>

        {/* Milestone Badges */}
        <Card style={styles.achievementsCard} mode="elevated">
          <Card.Content style={styles.achievementsCardContent}>
            <Text variant="titleMedium" style={styles.achievementsTitle}>
              Achievements
            </Text>
            <View style={styles.badgesGrid}>
              <View style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: colors.warning[100] }]}>
                  <Text style={styles.badgeEmoji}>🥉</Text>
                </View>
                <Text variant="bodySmall" style={styles.badgeLabel}>
                  First Delivery
                </Text>
              </View>
              <View style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: colors.success[100] }]}>
                  <Text style={styles.badgeEmoji}>🥈</Text>
                </View>
                <Text variant="bodySmall" style={styles.badgeLabel}>
                  Community Helper
                </Text>
              </View>
              <View style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: colors.primary[100] }]}>
                  <Text style={styles.badgeEmoji}>🥇</Text>
                </View>
                <Text variant="bodySmall" style={styles.badgeLabel}>
                  Mission Master
                </Text>
              </View>
              <View style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: colors.purple[100] }]}>
                  <Text style={styles.badgeEmoji}>⭐</Text>
                </View>
                <Text variant="bodySmall" style={styles.badgeLabel}>
                  Top Rated
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Profile Information Section */}
        <Card style={styles.sectionCard} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Profile Information
            </Text>
            
            <View style={styles.inputGroup}>
              <Text variant="labelLarge" style={styles.inputLabel}>
                Full Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                outlineColor={colors.neutral[200]}
                activeOutlineColor={colors.primary[600]}
                textColor={colors.neutral[800]}
                left={<TextInput.Icon icon={() => <User size={20} color={colors.neutral[500]} />} />}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text variant="labelLarge" style={styles.inputLabel}>
                Email Address
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
                outlineColor={colors.neutral[200]}
                activeOutlineColor={colors.primary[600]}
                textColor={colors.neutral[800]}
                left={<TextInput.Icon icon={() => <Mail size={20} color={colors.neutral[500]} />} />}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text variant="labelLarge" style={styles.inputLabel}>
                Phone Number
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                outlineColor={colors.neutral[200]}
                activeOutlineColor={colors.primary[600]}
                textColor={colors.neutral[800]}
                left={<TextInput.Icon icon={() => <Smartphone size={20} color={colors.neutral[500]} />} />}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Notification Settings */}
        <Card style={styles.sectionCard} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Notifications
            </Text>
            
            <List.Item
              title="Push Notifications"
              description="Receive notifications about new missions"
              left={() => <Bell size={20} color={colors.neutral[500]} />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.neutral[300], true: colors.primary[200] }}
                  thumbColor={notificationsEnabled ? colors.primary[600] : colors.neutral[400]}
                />
              )}
              titleStyle={styles.listItemTitle}
              descriptionStyle={styles.listItemDescription}
              style={styles.listItem}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Mission Alerts"
              description="Get notified when new missions match your preferences"
              left={() => <Truck size={20} color={colors.neutral[500]} />}
              right={() => (
                <Switch
                  value={missionAlerts}
                  onValueChange={setMissionAlerts}
                  trackColor={{ false: colors.neutral[300], true: colors.primary[200] }}
                  thumbColor={missionAlerts ? colors.primary[600] : colors.neutral[400]}
                />
              )}
              titleStyle={styles.listItemTitle}
              descriptionStyle={styles.listItemDescription}
              style={styles.listItem}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Email Notifications"
              description="Receive mission summaries and updates via email"
              left={() => <Mail size={20} color={colors.neutral[500]} />}
              right={() => (
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: colors.neutral[300], true: colors.primary[200] }}
                  thumbColor={emailNotifications ? colors.primary[600] : colors.neutral[400]}
                />
              )}
              titleStyle={styles.listItemTitle}
              descriptionStyle={styles.listItemDescription}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Privacy & Security */}
        <Card style={styles.sectionCard} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Privacy & Security
            </Text>
            
            <List.Item
              title="Location Services"
              description="Allow app to access your location for missions"
              left={() => <MapPin size={20} color={colors.neutral[500]} />}
              right={() => (
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{ false: colors.neutral[300], true: colors.primary[200] }}
                  thumbColor={locationEnabled ? colors.primary[600] : colors.neutral[400]}
                />
              )}
              titleStyle={styles.listItemTitle}
              descriptionStyle={styles.listItemDescription}
              style={styles.listItem}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Data Privacy"
              description="Manage your data and privacy preferences"
              left={() => <Shield size={20} color={colors.neutral[500]} />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.listItemTitle}
              descriptionStyle={styles.listItemDescription}
              style={styles.listItem}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Language"
              description="English (US)"
              left={() => <Globe size={20} color={colors.neutral[500]} />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.listItemTitle}
              descriptionStyle={styles.listItemDescription}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        <Card style={styles.menuCard} mode="elevated">
          <List.Section>
            <Text variant="titleSmall" style={styles.menuSectionTitle}>Account</Text>
            <List.Item
              title="Mission History"
              description="View all your completed missions"
              left={() => <List.Icon icon="history" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => router.push('/(facilitator)/completed')}
              titleStyle={styles.menuItemTitle}
              descriptionStyle={styles.menuItemDescription}
              style={styles.menuItem}
            />
            
            <Text variant="titleSmall" style={[styles.menuSectionTitle, styles.menuSectionTitleSpaced]}>Support</Text>
            <Divider style={styles.divider} />
            <List.Item
              title="Help & Support"
              description="Get help or contact support"
              left={() => <HelpCircle size={20} color={colors.neutral[500]} />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.menuItemTitle}
              descriptionStyle={styles.menuItemDescription}
              style={styles.menuItem}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="About Sahayata"
              description="Learn more about our mission"
              left={() => <Info size={20} color={colors.neutral[500]} />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.menuItemTitle}
              descriptionStyle={styles.menuItemDescription}
              style={styles.menuItem}
            />
          </List.Section>
        </Card>

        <Button
          mode="outlined"
          onPress={() => router.replace('/(citizen)')}
          style={styles.switchRoleButton}
          contentStyle={styles.buttonContent}
          textColor={colors.primary[600]}
        >
          Switch to Citizen Mode
        </Button>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          contentStyle={styles.saveButtonContent}
        >
          Save Changes
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    elevation: 0,
  },
  headerTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    padding: spacing['2xl'],
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
    paddingVertical: spacing['2xl'],
  },
  avatarContainer: {
    backgroundColor: colors.primary[100],
    borderRadius: 50,
    padding: spacing['3xl'],
    marginBottom: spacing['2xl'],
  },
  name: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  role: {
    color: colors.neutral[500],
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  badge: {
    backgroundColor: colors.success[500],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  rating: {
    color: colors.warning[500],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  impactCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  impactCardContent: {
    padding: spacing['3xl'],
  },
  impactTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Bold',
  },
  heroMetric: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  heroNumber: {
    fontWeight: typography.fontWeight.extrabold,
    color: colors.primary[600],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  heroLabel: {
    color: colors.neutral[600],
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  supportingMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing['2xl'],
  },
  supportingMetric: {
    alignItems: 'center',
  },
  supportingNumber: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  supportingLabel: {
    color: colors.neutral[500],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  activeSince: {
    color: colors.neutral[500],
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  achievementsCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  achievementsCardContent: {
    padding: spacing['3xl'],
  },
  achievementsTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing['2xl'],
  },
  badgeItem: {
    alignItems: 'center',
    width: '22%',
  },
  badgeIcon: {
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    marginBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeLabel: {
    color: colors.neutral[600],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  cardContent: {
    padding: spacing['3xl'],
  },
  sectionTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  inputGroup: {
    marginBottom: spacing['2xl'],
  },
  inputLabel: {
    color: colors.neutral[700],
    marginBottom: spacing.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    backgroundColor: colors.surface,
  },
  listItem: {
    paddingHorizontal: 0,
    paddingVertical: spacing.lg,
  },
  listItemTitle: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  listItemDescription: {
    color: colors.neutral[500],
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    marginVertical: spacing.md,
  },
  menuCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing['4xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  menuSectionTitle: {
    color: colors.neutral[700],
    fontWeight: typography.fontWeight.semibold,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
    fontFamily: 'Inter-SemiBold',
  },
  menuSectionTitleSpaced: {
    paddingTop: spacing['3xl'],
  },
  menuItem: {
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.lg,
  },
  menuItemTitle: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  menuItemDescription: {
    color: colors.neutral[500],
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  switchRoleButton: {
    borderColor: colors.primary[600],
    borderRadius: borderRadius.lg,
    marginBottom: spacing['2xl'],
  },
  buttonContent: {
    paddingVertical: spacing.lg,
  },
  saveButton: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
    marginTop: spacing['2xl'],
  },
  saveButtonContent: {
    paddingVertical: spacing.lg,
  },
});