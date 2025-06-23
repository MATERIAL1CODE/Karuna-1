import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import {
  Text,
  Appbar,
  Menu,
  TextInput,
  Button,
} from 'react-native-paper';
import { X, ChevronDown } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

interface MakeDonationModalProps {
  visible: boolean;
  onDismiss: () => void;
}

const resourceTypes = [
  'Cooked Meals',
  'Groceries',
  'Blankets',
  'Water',
  'Clothing',
  'Medicine',
  'Other',
];

export default function MakeDonationModal({ visible, onDismiss }: MakeDonationModalProps) {
  const [step, setStep] = useState(1);
  const [resourceType, setResourceType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const resetForm = () => {
    setStep(1);
    setResourceType('');
    setQuantity('');
    setPickupAddress('');
    setPickupTime('');
    setNotes('');
  };

  const handleNext = () => {
    if (!resourceType || !quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!pickupAddress || !pickupTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting donation:', {
        resourceType,
        quantity,
        pickupAddress,
        pickupTime,
        notes,
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert(
        'Donation Logged',
        'Thank you for your generous donation! A volunteer will contact you soon.',
        [{ text: 'OK', onPress: () => {
          onDismiss();
          resetForm();
        }}]
      );
    } catch (error) {
      console.error('Error submitting donation:', error);
      Alert.alert('Error', 'Failed to log donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = resourceType && quantity;
  const isStep2Valid = pickupAddress && pickupTime;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <View style={styles.modal}>
        <Appbar.Header style={styles.modalHeader}>
          <Appbar.Content title="Make a Donation" titleStyle={styles.modalTitle} />
          <Appbar.Action 
            icon={() => <X size={24} color={colors.neutral[800]} />} 
            onPress={onDismiss} 
          />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formCard}>
            <Text variant="titleMedium" style={styles.formTitle}>
              {step === 1 ? 'What are you donating?' : 'Where can we pick it up?'}
            </Text>

            {step === 1 ? (
              <>
                <Text variant="labelLarge" style={styles.fieldLabel}>
                  Resource Type *
                </Text>
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <TextInput
                      value={resourceType}
                      mode="outlined"
                      placeholder="Select resource type"
                      editable={false}
                      onPressIn={() => setMenuVisible(true)}
                      right={
                        <TextInput.Icon
                          icon={() => <ChevronDown size={20} color={colors.neutral[500]} />}
                          onPress={() => setMenuVisible(true)}
                        />
                      }
                      style={styles.input}
                      outlineColor={colors.neutral[200]}
                      activeOutlineColor={colors.primary[600]}
                      placeholderTextColor={colors.neutral[400]}
                    />
                  }
                  contentStyle={styles.menuContent}
                >
                  {resourceTypes.map((type) => (
                    <Menu.Item
                      key={type}
                      onPress={() => {
                        setResourceType(type);
                        setMenuVisible(false);
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
                  placeholderTextColor={colors.neutral[400]}
                />
              </>
            ) : (
              <>
                <Text variant="labelLarge" style={styles.fieldLabel}>
                  Pickup Address *
                </Text>
                <TextInput
                  value={pickupAddress}
                  onChangeText={setPickupAddress}
                  mode="outlined"
                  placeholder="Enter your address"
                  multiline
                  numberOfLines={2}
                  style={styles.input}
                  outlineColor={colors.neutral[200]}
                  activeOutlineColor={colors.primary[600]}
                  placeholderTextColor={colors.neutral[400]}
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
                  placeholderTextColor={colors.neutral[400]}
                />

                <Text variant="labelLarge" style={styles.fieldLabel}>
                  Additional Notes (Optional)
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  placeholder="e.g., perishable items, best time for pickup"
                  style={styles.textArea}
                  outlineColor={colors.neutral[200]}
                  activeOutlineColor={colors.primary[600]}
                  placeholderTextColor={colors.neutral[400]}
                />
              </>
            )}

            <View style={styles.buttonContainer}>
              {step === 2 && (
                <Button
                  mode="outlined"
                  onPress={handleBack}
                  style={[styles.button, styles.backButton]}
                  contentStyle={styles.buttonContent}
                  textColor={colors.neutral[600]}
                >
                  Back
                </Button>
              )}
              
              {step === 1 ? (
                <Button
                  mode="contained"
                  onPress={handleNext}
                  disabled={!isStep1Valid}
                  style={[styles.button, styles.nextButton]}
                  contentStyle={styles.buttonContent}
                >
                  Next
                </Button>
              ) : (
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={loading || !isStep2Valid}
                  style={[styles.button, styles.submitButton]}
                  contentStyle={styles.buttonContent}
                >
                  Log Donation
                </Button>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    backgroundColor: colors.surface,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  modalTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing['3xl'],
    ...shadows.md,
  },
  formTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Bold',
  },
  fieldLabel: {
    color: colors.neutral[800],
    marginBottom: spacing.md,
    marginTop: spacing.md,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  textArea: {
    marginBottom: spacing['3xl'],
    backgroundColor: colors.surface,
  },
  menuContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  menuItemTitle: {
    color: colors.neutral[800],
    fontFamily: 'Inter-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  button: {
    borderRadius: borderRadius.lg,
    flex: 1,
  },
  backButton: {
    borderColor: colors.neutral[300],
  },
  nextButton: {
    backgroundColor: colors.primary[600],
  },
  submitButton: {
    backgroundColor: colors.primary[600],
  },
  buttonContent: {
    paddingVertical: spacing.md,
  },
});