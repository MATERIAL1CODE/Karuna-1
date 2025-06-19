import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Web-compatible MapView component
const MapView = React.forwardRef((props, ref) => {
  const { style, children, onPress, ...otherProps } = props;
  
  return (
    <View 
      ref={ref}
      style={[styles.mapContainer, style]} 
      onPress={onPress}
      {...otherProps}
    >
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map View</Text>
        <Text style={styles.mapSubtext}>Interactive map not available on web</Text>
      </View>
      {children}
    </View>
  );
});

// Web-compatible Marker component
const Marker = (props) => {
  const { coordinate, title, description, children, ...otherProps } = props;
  
  return (
    <View style={styles.marker} {...otherProps}>
      <View style={styles.markerPin} />
      {title && <Text style={styles.markerTitle}>{title}</Text>}
      }
      {children}
    </View>
  );
};

// Web-compatible Callout component
const Callout = (props) => {
  const { children, ...otherProps } = props;
  
  return (
    <View style={styles.callout} {...otherProps}>
      {children}
    </View>
  );
};

// Placeholder styles
const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerPin: {
    width: 20,
    height: 20,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerTitle: {
    fontSize: 12,
    color: '#374151',
    marginTop: 4,
    textAlign: 'center',
  },
  callout: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
});

// Export components
export default MapView;
export { Marker, Callout };

// Export additional types and constants that might be used
export const PROVIDER_DEFAULT = 'default';
export const PROVIDER_GOOGLE = 'google';