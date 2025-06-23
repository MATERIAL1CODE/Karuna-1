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
  List,
  Divider,
  Appbar,
  TextInput,
  Button,
} from 'react-native-paper';
import { router } from 'expo-router';
import { 
  User, 
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

export default function FacilitatorSettingsScreen() {
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
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Account Settings" titleStyle={styles.headerTitle} />
        <Appbar.Action 
          icon={() => <Save size={24} color={colors.primary[600]} />} 
          onPress={handleSave} 
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Information */}
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
    backgroundColor: colors.surface,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    padding: spacing['2xl'],
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
  saveButton: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
    marginTop: spacing['2xl'],
  },
  saveButtonContent: {
    paddingVertical: spacing.lg,
  },
});