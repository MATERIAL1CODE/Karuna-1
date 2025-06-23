import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <View style={styles.iconContainer}>
              <AlertTriangle size={48} color="#EF4444" />
            </View>
            
            <Text style={styles.title}>Something went wrong</Text>
            
            <Text style={styles.message}>
              We're sorry, but something unexpected happened. Please try again.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Information:</Text>
                <Text style={styles.debugText}>{this.state.error.toString()}</Text>
                {this.state.errorInfo && (
                  <Text style={styles.debugText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}
            
            <Pressable style={styles.retryButton} onPress={this.handleRetry}>
              <RefreshCw size={20} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  iconContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
  },
  debugContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  debugText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});