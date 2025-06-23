import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import {
  Text,
  Appbar,
  Button,
  useTheme,
} from 'react-native-paper';
import { ArrowLeft, ExternalLink, Shield, Heart } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import { ActivityItem } from '@/contexts/DataContext';

interface LetterOfThanksModalProps {
  visible: boolean;
  onDismiss: () => void;
  letterData: ActivityItem | null;
}

export default function LetterOfThanksModal({ 
  visible, 
  onDismiss, 
  letterData 
}: LetterOfThanksModalProps) {
  const theme = useTheme();

  const handleBlockchainVerification = async () => {
    if (letterData?.blockchainTransactionLink) {
      if (Platform.OS === 'web') {
        window.open(letterData.blockchainTransactionLink, '_blank');
      } else {
        await WebBrowser.openBrowserAsync(letterData.blockchainTransactionLink);
      }
    }
  };

  const styles = createStyles(theme);

  if (!letterData || !letterData.fullAiGeneratedLetter) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.Action 
            icon={() => <ArrowLeft size={24} color={theme.colors.onSurface} />} 
            onPress={onDismiss} 
          />
          <Appbar.Content title="Your Letter of Thanks" titleStyle={styles.headerTitle} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Letter Header */}
          <View style={styles.letterHeader}>
            <View style={styles.letterHeaderIcon}>
              <Heart size={32} color={theme.colors.primary} />
            </View>
            <Text variant="headlineSmall" style={styles.letterHeaderTitle}>
              A Personal Letter of Thanks
            </Text>
            <Text variant="bodyMedium" style={styles.letterHeaderSubtitle}>
              Your {letterData.type === 'donation' ? 'donation' : 'report'} helped {letterData.peopleHelped} people • {letterData.date}
            </Text>
          </View>

          {/* Letter Content */}
          <View style={styles.letterContainer}>
            {/* Paper texture background */}
            <View style={styles.paperBackground}>
              {/* Letter content */}
              <View style={styles.letterContent}>
                <Text style={styles.letterText}>
                  {letterData.fullAiGeneratedLetter}
                </Text>
              </View>

              {/* Signature section */}
              <View style={styles.signatureSection}>
                <View style={styles.logoContainer}>
                  {letterData.ngoLogoUrl && (
                    <Image
                      source={{ uri: letterData.ngoLogoUrl }}
                      style={styles.ngoLogo}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.logoTextContainer}>
                    <Text variant="titleMedium" style={styles.organizationName}>
                      Sahayata
                    </Text>
                    <Text variant="bodySmall" style={styles.organizationTagline}>
                      Making a Difference Together
                    </Text>
                  </View>
                </View>

                {/* Blockchain verification */}
                {letterData.blockchainTransactionLink && (
                  <Pressable style={styles.verificationBadge} onPress={handleBlockchainVerification}>
                    <Shield size={16} color={theme.colors.success} />
                    <Text style={styles.verificationText}>
                      Verified on Polygon
                    </Text>
                    <ExternalLink size={14} color={theme.colors.success} />
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={onDismiss}
              style={styles.actionButton}
              contentStyle={styles.buttonContent}
              textColor={theme.colors.primary}
            >
              Close
            </Button>
            
            <Button
              mode="contained"
              onPress={onDismiss}
              style={styles.primaryActionButton}
              contentStyle={styles.buttonContent}
            >
              Continue Helping
            </Button>
          </View>

          {/* Impact reminder */}
          <View style={styles.impactReminder}>
            <Text variant="bodyMedium" style={styles.impactText}>
              Every act of kindness creates ripples of positive change. Thank you for being part of our community of compassion.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
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
    paddingBottom: 40,
  },
  letterHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  letterHeaderIcon: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  letterHeaderTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
  },
  letterHeaderSubtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  letterContainer: {
    marginBottom: 32,
  },
  paperBackground: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  letterContent: {
    marginBottom: 40,
  },
  letterText: {
    fontSize: 16,
    lineHeight: 28,
    color: theme.colors.onSurface,
    fontFamily: 'Lora-Regular',
    textAlign: 'left',
  },
  signatureSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    paddingTop: 32,
    gap: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ngoLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.surfaceVariant,
  },
  logoTextContainer: {
    flex: 1,
  },
  organizationName: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  organizationTagline: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.secondaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verificationText: {
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  actionButtons: {
    gap: 16,
    marginBottom: 32,
  },
  actionButton: {
    borderColor: theme.colors.primary,
    borderRadius: 12,
  },
  primaryActionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 16,
  },
  impactReminder: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  impactText: {
    color: theme.colors.onPrimaryContainer,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    fontStyle: 'italic',
  },
});