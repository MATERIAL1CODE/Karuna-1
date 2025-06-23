import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Text,
  Appbar,
  Menu,
} from 'react-native-paper';
import { X, ChevronDown } from 'lucide-react-native';
import { GlassModal } from '@/components/ui/GlassModal';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { colors, spacing } from '@/lib/design-tokens';

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
  const [resourceType, setResourceType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const resetForm = () => {
    setResourceType('');
    setQuantity('');
    setPickupAddress('');
    setPickupTime('');
    setNotes('');
  };

  const handleSubmit = async () => {
    if (!resourceType || !quantity || !pickupAddress || !pickupTime) {
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

  const isFormValid = resourceType && quantity && pickupAddress && pickupTime;

  return (
    <GlassModal
      visible={visible}
      onClose={onDismiss}
      animationType="slide"
      style={styles.modalContent}
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
          <GlassCard variant="elevated" style={styles.formCard}>
            <Text variant="titleMedium" style={styles.formTitle}>
              Donation Details
            </Text>

            <Text variant="labelLarge" style={styles.fieldLabel}>
              Resource Type *
            </Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <GlassInput
                  value={resourceType}
                  placeholder="Select resource type"
                  editable={false}
                  onPressIn={() => setMenuVisible(true)}
                  rightIcon={<ChevronDown size={20} color={colors.neutral[500]} />}
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

            <GlassInput
              label="Quantity (approx.) *"
              value={quantity}
              onChangeText={setQuantity}
              placeholder="e.g., 15 meals, 5 blankets"
            />

            <GlassInput
              label="Pickup Address *"
              value={pickupAddress}
              onChangeText={setPickupAddress}
              placeholder="Enter your address"
              multiline
              numberOfLines={2}
            />

            <GlassInput
              label="Pickup Time *"
              value={pickupTime}
              onChangeText={setPickupTime}
              placeholder="e.g., Today, 8-9 PM"
            />

            <GlassInput
              label="Additional Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              placeholder="e.g., perishable items, best time for pickup"
            />

            <GlassButton
              title="Log Donation"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading || !isFormValid}
              variant="primary"
              size="lg"
              style={styles.submitButton}
            />
          </GlassCard>
        </ScrollView>
      </View>
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    margin: 0,
    padding: 0,
  },
  modal: {
    flex: 1,
  },
  modalHeader: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  modalTitle: {
    fontWeight: '700',
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  formCard: {
    marginBottom: spacing['2xl'],
  },
  formTitle: {
    fontWeight: '700',
    color: colors.neutral[800],
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Bold',
  },
  fieldLabel: {
    color: colors.neutral[800],
    marginBottom: spacing.md,
    marginTop: spacing.md,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  menuContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  menuItemTitle: {
    color: colors.neutral[800],
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});