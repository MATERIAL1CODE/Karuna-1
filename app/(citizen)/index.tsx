import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { Heart, Gift, MapPin, Users } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function CitizenDashboard() {
  const { profile } = useAuth();

  const handleReportNeed = () => {
    router.push('/(citizen)/report');
  };

  const handleMakeDonation = () => {
    router.push('/(citizen)/donate');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.greeting}>
            Welcome back
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Ready to make a difference today?
          </Text>
        </View>

        <View style={styles.actionCards}>
          <TouchableOpacity onPress={handleReportNeed} activeOpacity={0.7}>
            <Card style={[styles.actionCard, styles.reportCard]} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardIcon}>
                  <MapPin size={32} color="#FFFFFF" />
                </View>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  Report a Need
                </Text>
                <Text variant="bodyMedium" style={styles.cardSubtitle}>
                  Help us locate people or families who need assistance
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleMakeDonation} activeOpacity={0.7}>
            <Card style={[styles.actionCard, styles.donateCard]} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardIcon}>
                  <Gift size={32} color="#FFFFFF" />
                </View>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  Make a Donation
                </Text>
                <Text variant="bodyMedium" style={styles.cardSubtitle}>
                  Share surplus food or resources with those in need
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.statsSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Community Impact
          </Text>
          
          <View style={styles.statsGrid}>
            <Card style={styles.statCard} mode="contained">
              <Card.Content style={styles.statContent}>
                <Heart size={24} color="#2563EB" />
                <Text variant="headlineSmall" style={styles.statNumber}>
                  1,247
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  People Helped
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard} mode="contained">
              <Card.Content style={styles.statContent}>
                <Users size={24} color="#06B6D4" />
                <Text variant="headlineSmall" style={styles.statNumber}>
                  89
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Active Volunteers
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748B',
  },
  actionCards: {
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    borderRadius: 16,
    elevation: 4,
  },
  reportCard: {
    backgroundColor: '#2563EB',
  },
  donateCard: {
    backgroundColor: '#06B6D4',
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
  },
  cardIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statContent: {
    alignItems: 'center',
    padding: 20,
  },
  statNumber: {
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    color: '#64748B',
    textAlign: 'center',
  },
});