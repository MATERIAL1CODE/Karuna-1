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
  useTheme,
} from 'react-native-paper';
import { X, AlertTriangle, MapPin, Package, Users, Shield } from 'lucide-react-native';

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
  const theme = useTheme();
  const styles = createStyles(theme);

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
            icon={() => <X size={24} color={theme.colors.onSurface} />} 
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
                    <IconComponent size={24} color={theme.colors.error} />
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

const createStyles = (theme: any) => StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    backgroundColor: theme.colors.surface,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  modalTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    padding: 32,
  },
  description: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 40,
    fontFamily: 'Inter-Regular',
  },
  optionsList: {
    gap: 24,
  },
  optionItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  optionIcon: {
    backgroundColor: theme.colors.errorContainer,
    borderRadius: 12,
    padding: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  optionDescription: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
});