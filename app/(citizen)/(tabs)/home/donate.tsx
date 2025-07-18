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
  useTheme,
} from 'react-native-paper';
import { router } from 'expo-router';
import { MapPin, ChevronDown } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import LoadingOverlay from '@/components/LoadingOverlay';
import { AIStorytellerService } from '@/components/AIStorytellerService';

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
  const theme = useTheme();
  const { addActivity } = useData();
  const [resourceType, setResourceType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // AI Storyteller loading state
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  const handleSubmit = async () => {
    if (!resourceType || !quantity || !pickupLocation || !pickupTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Show AI Storyteller loading overlay
      setIsGeneratingStory(true);
      
      // Call AI Storyteller service
      const storyResponse = await AIStorytellerService.generateDonationStory(
        resourceType,
        quantity,
        notes || undefined
      );
      
      // Create activity with AI-generated story
      const newActivity = {
        type: 'donation' as const,
        title: 'Donation Logged',
        subtitle: `Item: ${quantity} ${resourceType}`,
        status: 'pending' as const,
        resourceType,
        quantity,
        description: notes,
      };

      // Enhance with AI story
      const enhancedActivity = AIStorytellerService.enhanceActivityWithStory(
        { ...newActivity, id: '', date: '' },
        storyResponse
      );

      // Add to context
      addActivity(enhancedActivity);

      setIsGeneratingStory(false);

      Alert.alert(
        'Donation Logged Successfully!',
        'Thank you for your generous donation! A facilitator will contact you soon. Once your donation is delivered, you\'ll receive a personalized letter of thanks showing the impact of your kindness.',
        [{ text: 'View My Stories', onPress: () => router.push('/(citizen)/(tabs)/activity') }]
      );
    } catch (error) {
      setIsGeneratingStory(false);
      Alert.alert('Error', 'Failed to log donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const styles = createStyles(theme);

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
                        icon={() => <ChevronDown size={20} color={theme.colors.onSurfaceVariant} />}
                        onPress={openMenu}
                      />
                    }
                    style={styles.input}
                    outlineColor={theme.colors.outline}
                    activeOutlineColor={theme.colors.primary}
                    placeholderTextColor={theme.colors.onSurfaceVariant}
                    textColor={theme.colors.onSurface}
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
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
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
                  <TextInput.Icon icon={() => <MapPin size={20} color={theme.colors.onSurfaceVariant} />} />
                }
                style={styles.input}
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
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
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
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
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
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

        {/* AI Storyteller Loading Overlay */}
        <LoadingOverlay 
          isVisible={isGeneratingStory}
          message="Crafting your thank you story..."
        />
      </SafeAreaView>
    </Provider>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  headerTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    padding: 24,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  formContent: {
    padding: 32,
  },
  fieldLabel: {
    color: theme.colors.onSurface,
    marginBottom: 16,
    marginTop: 24,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    marginBottom: 24,
    backgroundColor: theme.colors.surface,
  },
  textArea: {
    marginBottom: 40,
    backgroundColor: theme.colors.surface,
  },
  menuContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginTop: 8,
  },
  menuItemTitle: {
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
  },
  buttonContent: {
    paddingVertical: 16,
  },
});