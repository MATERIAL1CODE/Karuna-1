import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import {
  Text,
  Appbar,
  List,
} from 'react-native-paper';
import { X, AlertTriangle, MapPin, Package, Users, Shield } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

interface ReportIssueModalProps {
  visible: boolean;
  onDismiss: () => void;
}

const issueOptions = [
  {
    id: 'cannot_locate_donor',
    title: 'Cannot locate Donor',
    description: 'Unable to find the pickup location or contact person',
    icon: MapPin,
  },
  {
    id: 'donation_not_described',
    title: 'Donation not as described',
    description: 'Items differ from what was reported',
    icon: Package,
  },
  {
    id: 'cannot_locate_beneficiary',
    title: 'Cannot locate Beneficiary',
    description: 'Unable to find the delivery location',
    icon: Users,
  },
  {
    id: 'unsafe_situation',
    title: 'Unsafe situation',
    description: 'Safety concerns at pickup or delivery location',
    icon: Shield,
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Different issue not listed above',
    icon: AlertTriangle,
  },
];

export default function ReportIssueModal({ visible, onDismiss }: ReportIssueModalProps) {
  const handleIssueSelect = (issueId: string, issueTitle: string) => {
    Alert.alert(
      'Issue Reported',
      `Your report about "${issueTitle}" has been submitted. Our team will review this and contact you shortly.`,
      [{ text: 'OK', onPress: onDismiss }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <View style={styles.modal}>
        <Appbar.Header style={styles.modalHeader}>
          <Appbar.Content title="Report Issue" titleStyle={styles.modalTitle} />
          <Appbar.Action 
            icon={() => <X size={24} color={colors.neutral[800]} />} 
            onPress={onDismiss} 
          />
        </Appbar.Header>

        <View style={styles.content}>
          <Text variant="bodyLarge" style={styles.description}>
            Select the issue you're experiencing with this mission:
          </Text>

          <View style={styles.optionsList}>
            {issueOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Pressable
                  key={option.id}
                  style={styles.optionItem}
                  onPress={() => handleIssueSelect(option.id, option.title)}
                >
                  <View style={styles.optionIcon}>
                    <IconComponent size={24} color={colors.error[600]} />
                  </View>
                  <View style={styles.optionContent}>
                    <Text variant="titleMedium" style={styles.optionTitle}>
                      {option.title}
                    </Text>
                    <Text variant="bodyMedium" style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    backgroundColor: colors.surface,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  modalTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    padding: spacing['3xl'],
  },
  description: {
    color: colors.neutral[600],
    marginBottom: spacing['4xl'],
    fontFamily: 'Inter-Regular',
  },
  optionsList: {
    gap: spacing['2xl'],
  },
  optionItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing['3xl'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2xl'],
    ...shadows.md,
  },
  optionIcon: {
    backgroundColor: colors.error[100],
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-SemiBold',
  },
  optionDescription: {
    color: colors.neutral[500],
    fontFamily: 'Inter-Regular',
  },
});