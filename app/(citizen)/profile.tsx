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
  TextInput,
} from 'react-native-paper';
import { router } from 'expo-router';
import { 
  User, 
  Heart, 
  Settings, 
  ArrowLeft, 
  CircleHelp as HelpCircle, 
  Info, 
  TrendingUp,
  Bell,
  Shield,
  Globe,
  Smartphone,
  Mail,
  MapPin,
  Save
} from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

export default function ProfileScreen() {
  // Profile settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [name, setName] = useState('Community Member');
  const [email, setEmail] = useState('member@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');

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
            Community Member
          </Text>
          <Text variant="bodyMedium" style={styles.role}>
            Citizen
          </Text>
        </View>

        <Card style={styles.statsCard} mode="elevated">
          <Card.Content style={styles.statsCardContent}>
            <Text variant="titleMedium" style={styles.statsTitle}>
              Your Impact This Month
            </Text>
            
            {/* Placeholder for line graph */}
            <View style={styles.graphPlaceholder}>
              <TrendingUp size={32} color={colors.primary[600]} />
              <Text variant="bodySmall" style={styles.graphText}>
                Impact trend over time
              </Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: colors.primary[100] }]}>
                  <Heart size={20} color={colors.primary[600]} />
                </View>
                <Text variant="titleMedium" style={styles.statNumber}>12</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Reports</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: colors.success[100] }]}>
                  <Heart size={20} color={colors.success[500]} />
                </View>
                <Text variant="titleMedium" style={styles.statNumber}>8</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Donations</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: colors.warning[100] }]}>
                  <Heart size={20} color={colors.warning[500]} />
                </View>
                <Text variant="titleMedium" style={styles.statNumber}>45</Text>
                <Text variant="bodySmall" style={styles.statLabel}>People Helped</Text>
              </View>
            </View>
            
            <Text variant="bodyMedium" style={styles.lifetimeTotal}>
              You have helped a total of 150 people since joining.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.impactCard} mode="elevated">
          <Card.Content style={styles.impactCardContent}>
            <Text variant="titleMedium" style={styles.impactTitle}>
              Community Impact
            </Text>
            <Text variant="bodyMedium" style={styles.impactText}>
              Thank you for being an active member of our community! Your reports and donations have made a real difference in people's lives.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.milestonesCard} mode="elevated">
          <Card.Content style={styles.milestonesCardContent}>
            <Text variant="titleMedium" style={styles.milestonesTitle}>
              Your Milestones
            </Text>
            <View style={styles.badgesContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🏆</Text>
                <Text variant="bodySmall" style={styles.badgeLabel}>First Report</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>💝</Text>
                <Text variant="bodySmall" style={styles.badgeLabel}>First Donation</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🌟</Text>
                <Text variant="bodySmall" style={styles.badgeLabel}>Community Helper</Text>
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
              description="Receive notifications about new opportunities"
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
              title="Email Notifications"
              description="Receive weekly impact summaries via email"
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
              description="Allow app to access your location for reporting"
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
              title="My Activity"
              description="View your reports and donations"
              left={() => <List.Icon icon="history" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => router.push('/(citizen)/activity')}
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
          onPress={() => router.replace('/(facilitator)')}
          style={styles.switchRoleButton}
          contentStyle={styles.buttonContent}
          textColor={colors.primary[600]}
        >
          Switch to Facilitator Mode
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
  role: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  statsCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  statsCardContent: {
    padding: spacing['3xl'],
  },
  statsTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Bold',
  },
  graphPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.lg,
    padding: spacing['3xl'],
    marginBottom: spacing['3xl'],
  },
  graphText: {
    color: colors.neutral[500],
    marginTop: spacing.lg,
    fontFamily: 'Inter-Regular',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing['2xl'],
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  statIconContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  statNumber: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    color: colors.neutral[500],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  lifetimeTotal: {
    color: colors.neutral[600],
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
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
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  impactText: {
    color: colors.neutral[500],
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  milestonesCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  milestonesCardContent: {
    padding: spacing['3xl'],
  },
  milestonesTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    minWidth: 80,
  },
  badgeText: {
    fontSize: 24,
    marginBottom: spacing.lg,
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