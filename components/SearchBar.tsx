import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search todos...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');
  const [scale] = useState(new Animated.Value(1));

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleTextChange = (value: string) => {
    setText(value);
    onSearch(value);
  };

  const handleClear = () => {
    setText('');
    onSearch('');
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            borderColor: isFocused ? tintColor : borderColor,
          },
        ]}>
        <Ionicons
          name="search"
          size={20}
          color={isFocused ? tintColor : borderColor}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
            },
          ]}
          value={text}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={borderColor}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {text.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={borderColor} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});
