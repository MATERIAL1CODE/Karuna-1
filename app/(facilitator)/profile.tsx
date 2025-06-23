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
  useTheme,
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
  Truck,
  Moon,
  Sun
} from 'lucide-react-native';
import { useThemeContext } from '@/contexts/ThemeContext';
import { spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

export default function FacilitatorProfileScreen() {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeContext();
  
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

  const styles = createStyles(theme, isDark);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color={theme.colors.onSurface} />} 
          onPress={() => router.replace('/(home)')} 
        />
        <Appbar.Content title="Profile" titleStyle={styles.headerTitle} />
        <Appbar.Action 
          icon={() => <Save size={24} color={theme.colors.primary} />} 
          onPress={handleSave} 
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color={theme.colors.primary} />
          </View>
          <Text variant="headlineSmall" style={styles.name}>
            Community Volunteer
          </Text>
          <View style={styles.roleContainer}>
            <Text variant="bodyMedium" style={styles.role}>
              Verified Facilitator
            </Text>
            <Badge style={[styles.badge, { backgroundColor: theme.colors.secondary }]} size={20}>
              ACTIVE
            </Badge>
          </View>
          <View style={styles.ratingContainer}>
            <Star size={16} color={theme.colors.tertiary} fill={theme.colors.tertiary} />
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
                <View style={[styles.badgeIcon, { backgroundColor: theme.colors.tertiaryContainer }]}>
                  <Text style={styles.badgeEmoji}>🥉</Text>
                </View>
                <Text variant="bodySmall" style={styles.badgeLabel}>
                  First Delivery
                </Text>
              </View>
              <View style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
                  <Text style={styles.badgeEmoji}>🥈</Text>
                </View>
                <Text variant="bodySmall" style={styles.badgeLabel}>
                  Community Helper
                </Text>
              </View>
              <View style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Text style={styles.badgeEmoji}>🥇</Text>
                </View>
                <Text variant="bodySmall" style={styles.badgeLabel}>
                  Mission Master
                </Text>
              </View>
              <View style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: theme.colors.tertiaryContainer }]}>
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
                textColor={theme.colors.onSurface}
                left={<TextInput.Icon icon={() => <User size={20} color={theme.colors.onSurfaceVariant} />} />}
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
                textColor={theme.colors.onSurface}
                left={<TextInput.Icon icon={() => <Mail size={20} color={theme.colors.onSurfaceVariant} />} />}
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
                textColor={theme.colors.onSurface}
                left={<TextInput.Icon icon={() => <Smartphone size={20} color={theme.colors.onSurfaceVariant} />} />}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Appearance Settings */}
        <Card style={styles.sectionCard} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Appearance
            </Text>
            
            <List.Item
              title="Dark Mode"
              description="Switch between light and dark themes"
              left={() => isDark ? <Moon size={20} color={theme.colors.onSurfaceVariant} /> : <Sun size={20} color={theme.colors.onSurfaceVariant} />}
              right={() => (
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: theme.colors.outline, true: theme.colors.primaryContainer }}
                  thumbColor={isDark ? theme.colors.primary : theme.colors.onSurfaceVariant}
                />
              )}
              titleStyle={styles.listItemTitle}
              descriptionStyle={styles.listItemDescription}
              style={styles.listItem}
            />
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
              left={() => <Bell size={20} color={theme.colors.onSurfaceVariant} />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: theme.colors.outline, true: theme.colors.primaryContainer }}
                  thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.onSurfaceVariant}
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
              left={() => <Truck size={20} color={theme.colors.onSurfaceVariant} />}
              right={() => (
                <Switch
                  value={missionAlerts}
                  onValueChange={setMissionAlerts}
                  trackColor={{ false: theme.colors.outline, true: theme.colors.primaryContainer }}
                  thumbColor={missionAlerts ? theme.colors.primary : theme.colors.onSurfaceVariant}
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
              left={() => <Mail size={20} color={theme.colors.onSurfaceVariant} />}
              right={() => (
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: theme.colors.outline, true: theme.colors.primaryContainer }}
                  thumbColor={emailNotifications ? theme.colors.primary : theme.colors.onSurfaceVariant}
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
              left={() => <MapPin size={20} color={theme.colors.onSurfaceVariant} />}
              right={() => (
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{ false: theme.colors.outline, true: theme.colors.primaryContainer }}
                  thumbColor={locationEnabled ? theme.colors.primary : theme.colors.onSurfaceVariant}
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
              left={() => <Shield size={20} color={theme.colors.onSurfaceVariant} />}
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
              left={() => <Globe size={20} color={theme.colors.onSurfaceVariant} />}
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
              left={() => <HelpCircle size={20} color={theme.colors.onSurfaceVariant} />}
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
              left={() => <Info size={20} color={theme.colors.onSurfaceVariant} />}
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
          textColor={theme.colors.primary}
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

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.background,
    elevation: 0,
  },
  headerTitle: {
    fontWeight: typography.fontWeight.bold,
    color: theme.colors.onSurface,
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
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 50,
    padding: spacing['3xl'],
    marginBottom: spacing['2xl'],
  },
  name: {
    fontWeight: typography.fontWeight.bold,
    color: theme.colors.onSurface,
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
    color: theme.colors.onSurfaceVariant,
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  badge: {
    backgroundColor: theme.colors.secondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  rating: {
    color: theme.colors.tertiary,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  impactCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  impactCardContent: {
    padding: spacing['3xl'],
  },
  impactTitle: {
    fontWeight: typography.fontWeight.bold,
    color: theme.colors.onSurface,
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Bold',
  },
  heroMetric: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  heroNumber: {
    fontWeight: typography.fontWeight.extrabold,
    color: theme.colors.primary,
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  heroLabel: {
    color: theme.colors.onSurfaceVariant,
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
    color: theme.colors.onSurface,
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  supportingLabel: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  activeSince: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  achievementsCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  achievementsCardContent: {
    padding: spacing['3xl'],
  },
  achievementsTitle: {
    fontWeight: typography.fontWeight.bold,
    color: theme.colors.onSurface,
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
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  cardContent: {
    padding: spacing['3xl'],
  },
  sectionTitle: {
    fontWeight: typography.fontWeight.bold,
    color: theme.colors.onSurface,
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  inputGroup: {
    marginBottom: spacing['2xl'],
  },
  inputLabel: {
    color: theme.colors.onSurface,
    marginBottom: spacing.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  listItem: {
    paddingHorizontal: 0,
    paddingVertical: spacing.lg,
  },
  listItemTitle: {
    color: theme.colors.onSurface,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  listItemDescription: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    marginVertical: spacing.md,
    backgroundColor: theme.colors.outline,
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: spacing['4xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  menuSectionTitle: {
    color: theme.colors.onSurface,
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
    color: theme.colors.onSurface,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  menuItemDescription: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  switchRoleButton: {
    borderColor: theme.colors.primary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing['2xl'],
  },
  buttonContent: {
    paddingVertical: spacing.lg,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: borderRadius.lg,
    marginTop: spacing['2xl'],
  },
  saveButtonContent: {
    paddingVertical: spacing.lg,
  },
});