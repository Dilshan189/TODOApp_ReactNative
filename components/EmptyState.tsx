import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

export function EmptyState({
  title = 'No todos yet',
  message = 'Start by adding your first todo to get organized!',
  icon = 'checkmark-circle-outline',
}: EmptyStateProps) {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'icon');

  return (
    <View style={styles.container}>
      <Animated.View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={80} color={borderColor} />
      </Animated.View>
      
      <Text style={[styles.title, { color: textColor, fontSize: 32, fontWeight: 'bold' }]}>
        {title}
      </Text>
      
      <Text style={[styles.message, { color: borderColor }]}>
        {message}
      </Text>
      
      <View style={styles.tipContainer}>
        <Ionicons name="bulb-outline" size={20} color={borderColor} />
        <Text style={[styles.tipText, { color: borderColor }]}>
          Tap the + button to add your first todo
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.6,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  tipText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});
