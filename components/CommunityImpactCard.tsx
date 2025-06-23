import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  Text,
  Card,
  useTheme,
} from 'react-native-paper';
import { MapPin, Gift, Truck, TrendingUp } from 'lucide-react-native';
import { CommunityImpactItem } from '@/contexts/DataContext';

interface CommunityImpactCardProps {
  item: CommunityImpactItem;
  onPress?: () => void;
}

export default function CommunityImpactCard({ item, onPress }: CommunityImpactCardProps) {
  const theme = useTheme();

  const getIconComponent = () => {
    switch (item.type) {
      case 'report':
        return MapPin;
      case 'donation':
        return Gift;
      case 'mission':
        return Truck;
      default:
        return TrendingUp;
    }
  };

  const getIconColor = () => {
    switch (item.type) {
      case 'report':
        return theme.colors.primary;
      case 'donation':
        return theme.colors.success;
      case 'mission':
        return theme.colors.secondary;
      default:
        return theme.colors.tertiary;
    }
  };

  const getIconBgColor = () => {
    switch (item.type) {
      case 'report':
        return theme.colors.primaryContainer;
      case 'donation':
        return theme.colors.secondaryContainer;
      case 'mission':
        return theme.colors.tertiaryContainer;
      default:
        return theme.colors.surfaceVariant;
    }
  };

  const IconComponent = getIconComponent();
  const iconColor = getIconColor();
  const iconBgColor = getIconBgColor();

  const styles = createStyles(theme);

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Card style={styles.impactCard} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
              <IconComponent size={20} color={iconColor} />
            </View>
            <View style={styles.impactInfo}>
              <Text variant="titleMedium" style={styles.impactTitle}>
                {item.title}
              </Text>
              <Text variant="bodyMedium" style={styles.impactDescription}>
                {item.description}
              </Text>
              <View style={styles.bottomRow}>
                <Text variant="bodySmall" style={styles.impactDate}>
                  {item.date}
                </Text>
                <Text variant="bodySmall" style={styles.peopleHelped}>
                  {item.peopleHelped} people helped
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  impactCard: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconContainer: {
    borderRadius: 10,
    padding: 16,
  },
  impactInfo: {
    flex: 1,
  },
  impactTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  impactDescription: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  impactDate: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  peopleHelped: {
    color: theme.colors.success,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});