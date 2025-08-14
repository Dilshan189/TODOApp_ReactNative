import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, View } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabBarBackground() {
  const backgroundColor = useThemeColor({}, 'background');

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={80}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor,
      }}
    />
  );
}
