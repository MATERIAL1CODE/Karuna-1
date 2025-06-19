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
} from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MapPin, User, Clock } from 'lucide-react-native';

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams();

  const handleAcceptMission = () => {
    Alert.alert(
      'Accept Mission',
      'Are you sure you want to accept this mission?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            Alert.alert(
              'Mission Accepted',
              'Thank you for volunteering! Contact details have been shared.',
              [{ text: 'OK', onPress: () => router.back() }]
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
        <Card style={styles.section} mode="elevated">
          <Card.Content style={styles.sectionContent}>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Pickup
            </Text>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MapPin size={20} color="#2563EB" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Pickup Location
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  Anna's Cafe, Saket
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <User size={20} color="#2563EB" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Contact
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  Sarah Miller
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Clock size={20} color="#2563EB" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Time
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  2:00 PM
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.section} mode="elevated">
          <Card.Content style={styles.sectionContent}>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Delivery
            </Text>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MapPin size={20} color="#2563EB" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Delivery Location
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  Underneath Lajpat Nagar Flyover
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <User size={20} color="#2563EB" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Contact
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  David Chen
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Clock size={20} color="#2563EB" />
              </View>
              <View style={styles.detailContent}>
                <Text variant="labelMedium" style={styles.detailLabel}>
                  Time
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  3:00 PM
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.section} mode="elevated">
          <Card.Content style={styles.sectionContent}>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Route
            </Text>
            <View style={styles.routeContainer}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
                }}
                style={styles.routeImage}
              />
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleAcceptMission}
          style={styles.acceptButton}
          contentStyle={styles.buttonContent}
        >
          Accept Mission
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
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    padding: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    color: '#64748B',
    marginBottom: 4,
  },
  detailValue: {
    color: '#1E293B',
    fontWeight: '500',
  },
  routeContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  routeImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E2E8F0',
  },
  acceptButton: {
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  buttonContent: {
    paddingVertical: 12,
  },
});