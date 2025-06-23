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
import { MapPin } from 'lucide-react-native';

const resourceTypes = [
  'Food',
  'Clothing',
  'Medicine',
  'Educational Materials',
  'Household Items',
  'Other',
];

export default function DonateScreen() {
  const [resourceType, setResourceType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSubmit = async () => {
    if (!resourceType || !quantity || !pickupLocation) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting donation:', {
        resourceType,
        quantity,
        pickupLocation,
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
                        icon="chevron-down"
                        onPress={openMenu}
                      />
                    }
                    style={styles.input}
                  />
                }
              >
                {resourceTypes.map((type) => (
                  <Menu.Item
                    key={type}
                    onPress={() => {
                      setResourceType(type);
                      closeMenu();
                    }}
                    title={type}
                  />
                ))}
              </Menu>

              <Text variant="labelLarge" style={styles.fieldLabel}>
                Quantity *
              </Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                mode="outlined"
                placeholder="e.g., 5 boxes, 2 bags"
                style={styles.input}
              />

              <Text variant="labelLarge" style={styles.fieldLabel}>
                Pickup Location *
              </Text>
              <TextInput
                value={pickupLocation}
                onChangeText={setPickupLocation}
                mode="outlined"
                placeholder="Enter address or select on map"
                right={
                  <TextInput.Icon icon={() => <MapPin size={20} color="#64748B" />} />
                }
                style={styles.input}
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontWeight: '600',
    color: '#1E293B',
  },
  scrollContent: {
    padding: 16,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
  },
  formContent: {
    padding: 24,
  },
  fieldLabel: {
    color: '#1E293B',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    marginBottom: 8,
  },
  textArea: {
    marginBottom: 24,
  },
  submitButton: {
    borderRadius: 12,
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});