import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
} from 'react-native';
import {
  Text,
  useTheme,
} from 'react-native-paper';
import { router } from 'expo-router';
import { Heart, Users, MapPin } from 'lucide-react-native';

export default function HomePage() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleCitizenPress = () => {
    router.push('/(citizen)/(tabs)/home');
  };

  const handleFacilitatorPress = () => {
    router.push('/(facilitator)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <View style={styles.iconContainer}>
              <Heart size={48} color={theme.colors.primary} />
            </View>
            <Text variant="displayMedium" style={styles.title}>
              Welcome to Sahayata
            </Text>
            <Text variant="headlineSmall" style={styles.subtitle}>
              Making a Difference Together
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Choose how you'd like to make a difference today
            </Text>
          </View>
        </View>

        <View style={styles.roleCards}>
          <Pressable onPress={handleCitizenPress}>
            <View style={[styles.roleCard, styles.citizenCard]}>
              <View style={styles.cardIcon}>
                <MapPin size={40} color={theme.colors.primary} />
              </View>
              <Text variant="headlineSmall" style={styles.cardTitle}>
                Citizen Mode
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Report people in need and donate surplus resources to help your community
              </Text>
              <View style={styles.features}>
                <Text style={styles.feature}>• Report people in need</Text>
                <Text style={styles.feature}>• Donate food & resources</Text>
                <Text style={styles.feature}>• Track your impact</Text>
              </View>
            </View>
          </Pressable>

          <Pressable onPress={handleFacilitatorPress}>
            <View style={[styles.roleCard, styles.facilitatorCard]}>
              <View style={styles.cardIcon}>
                <Users size={40} color={theme.colors.success} />
              </View>
              <Text variant="headlineSmall" style={styles.cardTitle}>
                Facilitator Mode
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Accept delivery missions and coordinate aid efforts to help those in need
              </Text>
              <View style={styles.features}>
                <Text style={styles.feature}>• Accept delivery missions</Text>
                <Text style={styles.feature}>• Coordinate aid efforts</Text>
                <Text style={styles.feature}>• Make direct impact</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Start making a positive impact in your community today
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 24,
    padding: 40,
    marginBottom: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontWeight: '800',
    color: theme.colors.onSurface,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    color: theme.colors.primary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  description: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 24,
    fontFamily: 'Inter-Regular',
  },
  roleCards: {
    gap: 40,
    marginBottom: 64,
  },
  roleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  citizenCard: {
    borderWidth: 2,
    borderColor: theme.colors.primaryContainer,
  },
  facilitatorCard: {
    borderWidth: 2,
    borderColor: theme.colors.secondaryContainer,
  },
  cardIcon: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
  },
  cardTitle: {
    color: theme.colors.onSurface,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter-Bold',
  },
  cardDescription: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
  },
  features: {
    alignItems: 'flex-start',
    gap: 16,
  },
  feature: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});