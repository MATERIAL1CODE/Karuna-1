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
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

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
              <View style={[styles.iconContainer, { backgroundColor: colors.success[100] }]}>
                <MapPin size={20} color={colors.success[500]} />
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
              <View style={[styles.iconContainer, { backgroundColor: colors.success[100] }]}>
                <User size={20} color={colors.success[500]} />
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
              <View style={[styles.iconContainer, { backgroundColor: colors.success[100] }]}>
                <Clock size={20} color={colors.success[500]} />
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
              <View style={[styles.iconContainer, { backgroundColor: colors.success[100] }]}>
                <Phone size={20} color={colors.success[500]} />
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
              <View style={[styles.iconContainer, { backgroundColor: colors.error[100] }]}>
                <MapPin size={20} color={colors.error[500]} />
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
              <View style={[styles.iconContainer, { backgroundColor: colors.error[100] }]}>
                <User size={20} color={colors.error[500]} />
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
              <View style={[styles.iconContainer, { backgroundColor: colors.error[100] }]}>
                <Clock size={20} color={colors.error[500]} />
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
              <View style={[styles.iconContainer, { backgroundColor: colors.error[100] }]}>
                <Phone size={20} color={colors.error[500]} />
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
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTitle: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    fontFamily: 'Inter-SemiBold',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  titleCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    ...shadows.md,
  },
  titleContent: {
    padding: spacing['3xl'],
  },
  missionTitle: {
    fontWeight: typography.fontWeight.extrabold,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  foodChip: {
    backgroundColor: colors.success[500],
  },
  urgentChip: {
    backgroundColor: colors.error[500],
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  description: {
    color: colors.neutral[500],
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  sectionContent: {
    padding: spacing['2xl'],
  },
  sectionTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing['2xl'],
    gap: spacing.lg,
  },
  iconContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    color: colors.neutral[500],
    marginBottom: spacing.sm,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  detailValue: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  addressText: {
    color: colors.neutral[500],
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  routeContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  routeImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.neutral[200],
  },
  routeOverlay: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  routeText: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  acceptButton: {
    borderRadius: borderRadius.xl,
    marginTop: spacing.lg,
    marginBottom: spacing['4xl'],
    backgroundColor: colors.primary[600],
  },
  buttonContent: {
    paddingVertical: spacing.lg,
  },
});