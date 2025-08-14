import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface IconSymbolProps {
  name: string;
  size: number;
  color: string;
  style?: any;
}

export function IconSymbol({ name, size, color, style }: IconSymbolProps) {
  // Map SF Symbol names to Ionicons
  const iconMap: { [key: string]: string } = {
    'checklist': 'checkmark-circle-outline',
    'paperplane.fill': 'paper-plane',
    'house.fill': 'home',
  };

  const iconName = iconMap[name] || name;

  return (
    <Ionicons
      name={iconName as any}
      size={size}
      color={color}
      style={style}
    />
  );
}
