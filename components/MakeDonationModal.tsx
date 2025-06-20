import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  Appbar,
  Card,
  Menu,
} from 'react-native-paper';
import { X, ChevronDown } from 'lucide-react-native';

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
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const resetForm = () => {
    setResourceType('');
    setQuantity('');
    setPickupAddress('');
    setPickupTime('');
  };

  const handleSubmit = async () => {
    if (!resourceType || !quantity || !pickupAddress || !pickupTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Here you would submit to your backend
      console.log('Submitting donation:', {
        resourceType,
        quantity,
        pickupAddress,
        pickupTime,
      });

      Alert.alert(
        'Donation Logged',
        'Thank you for your generous donation! A volunteer will contact you soon.',
        [{ text: 'OK', onPress: () => {
          onDismiss();
          resetForm();
        }}]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to log donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = resourceType && quantity && pickupAddress && pickupTime;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modal}>
          <Appbar.Header style={styles.modalHeader}>
            <Appbar.Content title="Make a Donation" titleStyle={styles.modalTitle} />
            <Appbar.Action 
              icon={() => <X size={24} color="#1F2937" />} 
              onPress={onDismiss} 
            />
          </Appbar.Header>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Card style={styles.formCard} mode="elevated">
              <Card.Content style={styles.formContent}>
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
                    <TextInput
                      value={resourceType}
                      mode="outlined"
                      placeholder="Select resource type"
                      editable={false}
                      onPressIn={() => setMenuVisible(true)}
                      right={
                        <TextInput.Icon
                          icon={() => <ChevronDown size={20} color="#6B7280" />}
                          onPress={() => setMenuVisible(true)}
                        />
                      }
                      style={styles.input}
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
                />

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
                />

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={loading || !isFormValid}
                  style={styles.submitButton}
                  contentStyle={styles.buttonContent}
                >
                  Log Donation
                </Button>
              </Card.Content>
            </Card>
          </ScrollView>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modal: {
    flex: 1,
  },
  modalHeader: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  modalTitle: {
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollContent: {
    padding: 16,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 4,
  },
  formContent: {
    padding: 24,
  },
  formTitle: {
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
  },
  fieldLabel: {
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 8,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  menuContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  menuItemTitle: {
    color: '#1F2937',
  },
  submitButton: {
    borderRadius: 12,
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 12,
  },
});