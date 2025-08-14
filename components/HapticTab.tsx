import * as Haptics from 'expo-haptics';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { children, onPress, style, accessibilityState } = props;

  const handlePress = (e: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={style}
      accessibilityState={accessibilityState}
    >
      {children}
    </TouchableOpacity>
  );
}
