import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Appbar,
  Card,
  Menu,
  Provider,
} from 'react-native-paper';
import { router } from 'expo-router';
import { MapPin, ChevronDown } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

const resourceTypes = [
  'Cooked Meals',
  'Groceries',
  'Blankets',
  'Water',
  'Clothing',
  'Medicine',
  'Other',
];

export default function DonateScreen() {
  const [resourceType, setResourceType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSubmit = async () => {
    if (!resourceType || !quantity || !pickupLocation || !pickupTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting donation:', {
        resourceType,
        quantity,
        pickupLocation,
        pickupTime,
        notes,
      });

      Alert.alert(
        'Donation Logged',
        'Thank you for your generous donation! A facilitator will contact you soon.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to log donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Log Donation" titleStyle={styles.headerTitle} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.formCard} mode="elevated">
            <Card.Content style={styles.formContent}>
              <Text variant="labelLarge" style={styles.fieldLabel}>
                Type of Resource *
              </Text>
              <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                  <TextInput
                    value={resourceType}
                    mode="outlined"
                    placeholder="Select resource type"
                    editable={false}
                    onPressIn={openMenu}
                    right={
                      <TextInput.Icon
                        icon={() => <ChevronDown size={20} color={colors.neutral[500]} />}
                        onPress={openMenu}
                      />
                    }
                    style={styles.input}
                    outlineColor={colors.neutral[200]}
                    activeOutlineColor={colors.primary[600]}
                    placeholderTextColor={colors.neutral[500]}
                    textColor={colors.neutral[800]}
                  />
                }
                contentStyle={styles.menuContent}
              >
                {resourceTypes.map((type) => (
                  <Menu.Item
                    key={type}
                    onPress={() => {
                      setResourceType(type);
                      closeMenu();
                    }}
                    title={type}
                    titleStyle={styles.menuItemTitle}
                  />
                ))}
              </Menu>

              <Text variant="labelLarge" style={styles.fieldLabel}>
                Quantity (approx.) *
              </Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                mode="outlined"
                placeholder="e.g., 15 meals, 5 blankets"
                style={styles.input}
                outlineColor={colors.neutral[200]}
                activeOutlineColor={colors.primary[600]}
                placeholderTextColor={colors.neutral[500]}
                textColor={colors.neutral[800]}
              />

              <Text variant="labelLarge" style={styles.fieldLabel}>
                Pickup Address *
              </Text>
              <TextInput
                value={pickupLocation}
                onChangeText={setPickupLocation}
                mode="outlined"
                placeholder="Enter your address"
                multiline
                numberOfLines={2}
                right={
                  <TextInput.Icon icon={() => <MapPin size={20} color={colors.neutral[500]} />} />
                }
                style={styles.input}
                outlineColor={colors.neutral[200]}
                activeOutlineColor={colors.primary[600]}
                placeholderTextColor={colors.neutral[500]}
                textColor={colors.neutral[800]}
              />

              <Text variant="labelLarge" style={styles.fieldLabel}>
                Pickup Time *
              </Text>
              <TextInput
                value={pickupTime}
                onChangeText={setPickupTime}
                mode="outlined"
                placeholder="e.g., Today, 8-9 PM"
                style={styles.input}
                outlineColor={colors.neutral[200]}
                activeOutlineColor={colors.primary[600]}
                placeholderTextColor={colors.neutral[500]}
                textColor={colors.neutral[800]}
              />

              <Text variant="labelLarge" style={styles.fieldLabel}>
                Additional Notes (Optional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                mode="outlined"
                multiline
                numberOfLines={4}
                placeholder="e.g., perishable items, best time for pickup"
                style={styles.textArea}
                outlineColor={colors.neutral[200]}
                activeOutlineColor={colors.primary[600]}
                placeholderTextColor={colors.neutral[500]}
                textColor={colors.neutral[800]}
              />

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
                contentStyle={styles.buttonContent}
              >
                Submit Donation
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Provider>
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
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  formContent: {
    padding: spacing['3xl'],
  },
  fieldLabel: {
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    marginTop: spacing['2xl'],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    marginBottom: spacing['2xl'],
    backgroundColor: colors.surface,
  },
  textArea: {
    marginBottom: spacing['4xl'],
    backgroundColor: colors.surface,
  },
  menuContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
  },
  menuItemTitle: {
    color: colors.neutral[800],
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[600],
  },
  buttonContent: {
    paddingVertical: spacing.lg,
  },
});