import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  Appbar,
  Card,
  Chip,
} from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MapPin, User, Clock, Phone } from 'lucide-react-native';

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams();

  const handleAcceptMission = () => {
    Alert.alert(
      'Accept Mission',
      'Are you sure you want to accept this mission? You will be responsible for completing the pickup and delivery.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept Mission',
          style: 'default',
          onPress: () => {
            Alert.alert(
              'Mission Accepted!',
              'Thank you for volunteering! Contact details have been shared. Please coordinate with both parties for pickup and delivery.',
              [{ text: 'Got it', onPress: () => router.back() }]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Mission Details" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.titleCard} mode="elevated">
          <Card.Content style={styles.titleContent}>
            <Text variant="headlineMedium" style={styles.missionTitle}>
              Food for 4 People
            </Text>
            <View style={styles.chipRow}>
              <Chip style={styles.foodChip} textStyle={styles.chipText}>
                Food
              </Chip>
              <Chip style={styles.urgentChip} textStyle={styles.chipText}>
                HIGH PRIORITY
              </Chip>
            </View>
            <Text variant="bodyMedium" style={styles.description}>
              Cooked meals needed for a family of 4 including 2 children. Pickup from restaurant, deliver to location under flyover.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.section} mode="elevated">
          <Card.Content style={styles.sectionContent}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              📍 Pickup Details
            </Text>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MapPin size={20} color="#10B981" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Location
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  Anna's Cafe, Saket District Centre
                </Text>
                <Text variant="bodySmall" style={styles.addressText}>
                  Shop 45, Ground Floor, Saket District Centre, New Delhi
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <User size={20} color="#10B981" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Contact Person
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  Sarah Miller (Manager)
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Clock size={20} color="#10B981" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Pickup Time
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  Today, 2:00 PM
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Phone size={20} color="#10B981" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Phone Number
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  +91 98765 43210
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.section} mode="elevated">
          <Card.Content style={styles.sectionContent}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              🎯 Delivery Details
            </Text>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MapPin size={20} color="#EF4444" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Location
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  Underneath Lajpat Nagar Flyover
                </Text>
                <Text variant="bodySmall" style={styles.addressText}>
                  Near Lajpat Nagar Metro Station, Ring Road
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <User size={20} color="#EF4444" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Contact Person
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  Local Coordinator
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Clock size={20} color="#EF4444" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Delivery Time
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  Today, 3:00 PM
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Phone size={20} color="#EF4444" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Phone Number
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  +91 87654 32109
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.section} mode="elevated">
          <Card.Content style={styles.sectionContent}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              🗺️ Route Preview
            </Text>
            <View style={styles.routeContainer}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
                }}
                style={styles.routeImage}
              />
              <View style={styles.routeOverlay}>
                <Text variant="bodyMedium" style={styles.routeText}>
                  3.2 km • Est. 15 minutes
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleAcceptMission}
          style={styles.acceptButton}
          contentStyle={styles.buttonContent}
        >
          Accept This Mission
        </Button>
      </ScrollView>
    </SafeAreaView>
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
  titleCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 4,
  },
  titleContent: {
    padding: 24,
  },
  missionTitle: {
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  foodChip: {
    backgroundColor: '#10B981',
  },
  urgentChip: {
    backgroundColor: '#EF4444',
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    color: '#64748B',
    lineHeight: 22,
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
  },
  sectionContent: {
    padding: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 16,
  },
  iconContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '600',
  },
  detailValue: {
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 2,
  },
  addressText: {
    color: '#64748B',
    lineHeight: 18,
  },
  routeContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  routeImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E2E8F0',
  },
  routeOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  routeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  acceptButton: {
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  buttonContent: {
    paddingVertical: 12,
  },
});