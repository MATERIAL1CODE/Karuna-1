import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  List,
  Divider,
  Appbar,
  TextInput,
  useTheme,
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
  Save,
  LogOut
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { SkeletonLoader, StatsCardSkeleton } from '@/components/SkeletonLoader';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const { isLoadingData, fetchData, getUserImpactStats } = useData();
  
  // Profile settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [name, setName] = useState(user?.name || 'Community Member');
  const [email, setEmail] = useState(user?.email || 'member@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');

  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
  }, []);

  useEffect(() => {
    // Update local state when user data changes
    if (user) {
      setName(user.name);
      setEmail(user.email || 'member@example.com');
      setPhone(user.phone || '+91 98765 43210');
    }
  }, [user]);

  const handleSave = () => {
    // Update user data in context
    // updateUser({ name, email, phone });
    console.log('Settings saved');
    // Show success feedback or navigate back
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const userStats = getUserImpactStats();
  const styles = createStyles(theme);

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
            {user?.name || 'Community Member'}
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
            
            {isLoadingData ? (
              <StatsCardSkeleton />
            ) : (
              <>
                {/* Placeholder for line graph */}
                <View style={styles.graphPlaceholder}>
                  <TrendingUp size={32} color={theme.colors.primary} />
                  <Text variant="bodySmall" style={styles.graphText}>
                    Impact trend over time
                  </Text>
                </View>
                
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <View style={[styles.statIconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                      <Heart size={20} color={theme.colors.primary} />
                    </View>
                    <Text variant="titleMedium" style={styles.statNumber}>{userStats.totalReports}</Text>
                    <Text variant="bodySmall" style={styles.statLabel}>Reports</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={[styles.statIconContainer, { backgroundColor: theme.colors.secondaryContainer }]}>
                      <Heart size={20} color={theme.colors.secondary} />
                    </View>
                    <Text variant="titleMedium" style={styles.statNumber}>{userStats.totalDonations}</Text>
                    <Text variant="bodySmall" style={styles.statLabel}>Donations</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={[styles.statIconContainer, { backgroundColor: theme.colors.tertiaryContainer }]}>
                      <Heart size={20} color={theme.colors.tertiary} />
                    </View>
                    <Text variant="titleMedium" style={styles.statNumber}>{userStats.totalPeopleHelped}</Text>
                    <Text variant="bodySmall" style={styles.statLabel}>People Helped</Text>
                  </View>
                </View>
                
                <Text variant="bodyMedium" style={styles.lifetimeTotal}>
                  You have helped a total of {userStats.totalPeopleHelped} people since joining.
                </Text>
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.impactCard} mode="elevated">
          <Card.Content style={styles.impactCardContent}>
            <Text variant="titleMedium" style={styles.impactTitle}>
              Community Impact
            </Text>
            {isLoadingData ? (
              <SkeletonLoader width="100%" height={60} />
            ) : (
              <Text variant="bodyMedium" style={styles.impactText}>
                Thank you for being an active member of our community! Your reports and donations have made a real difference in people's lives.
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.milestonesCard} mode="elevated">
          <Card.Content style={styles.milestonesCardContent}>
            <Text variant="titleMedium" style={styles.milestonesTitle}>
              Your Milestones
            </Text>
            {isLoadingData ? (
              <View style={styles.badgesContainer}>
                <SkeletonLoader width={80} height={80} borderRadius={12} />
                <SkeletonLoader width={80} height={80} borderRadius={12} />
                <SkeletonLoader width={80} height={80} borderRadius={12} />
              </View>
            ) : (
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
            )}
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

        {/* Notification Settings */}
        <Card style={styles.sectionCard} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Notifications
            </Text>
            
            <List.Item
              title="Push Notifications"
              description="Receive notifications about new opportunities"
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
              title="Email Notifications"
              description="Receive weekly impact summaries via email"
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
              description="Allow app to access your location for reporting"
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
              title="My Activity"
              description="View your reports and donations"
              left={() => <List.Icon icon="history" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => router.push('/(citizen)/(tabs)/activity')}
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

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          contentStyle={styles.saveButtonContent}
        >
          Save Changes
        </Button>

        {/* Sign Out Button */}
        <Button
          mode="outlined"
          onPress={handleSignOut}
          style={styles.signOutButton}
          contentStyle={styles.signOutButtonContent}
          textColor={theme.colors.error}
          icon={() => <LogOut size={20} color={theme.colors.error} />}
        >
          Sign Out
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.background,
    elevation: 0,
  },
  headerTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  avatarContainer: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 50,
    padding: 32,
    marginBottom: 24,
  },
  name: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  role: {
    color: theme.colors.primary,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  statsCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statsCardContent: {
    padding: 32,
  },
  statsTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 32,
    fontFamily: 'Inter-Bold',
  },
  graphPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    padding: 32,
    marginBottom: 32,
  },
  graphText: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 16,
    fontFamily: 'Inter-Regular',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    gap: 16,
  },
  statIconContainer: {
    borderRadius: 12,
    padding: 16,
  },
  statNumber: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  lifetimeTotal: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  impactCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  impactCardContent: {
    padding: 32,
  },
  impactTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 24,
    fontFamily: 'Inter-Bold',
  },
  impactText: {
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  milestonesCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  milestonesCardContent: {
    padding: 32,
  },
  milestonesTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 24,
    fontFamily: 'Inter-Bold',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  badge: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    padding: 24,
    minWidth: 80,
  },
  badgeText: {
    fontSize: 24,
    marginBottom: 16,
  },
  badgeLabel: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardContent: {
    padding: 32,
  },
  sectionTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 24,
    fontFamily: 'Inter-Bold',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    color: theme.colors.onSurface,
    marginBottom: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  listItem: {
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  listItemTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  listItemDescription: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: theme.colors.outline,
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: 40,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  menuSectionTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    paddingHorizontal: 24,
    paddingTop: 24,
    fontFamily: 'Inter-SemiBold',
  },
  menuSectionTitleSpaced: {
    paddingTop: 32,
  },
  menuItem: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  menuItemTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  menuItemDescription: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    marginBottom: 16,
  },
  saveButtonContent: {
    paddingVertical: 16,
  },
  signOutButton: {
    borderColor: theme.colors.error,
    borderRadius: 12,
    marginBottom: 24,
  },
  signOutButtonContent: {
    paddingVertical: 16,
  },
});