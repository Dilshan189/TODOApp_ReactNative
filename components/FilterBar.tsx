import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type FilterStatus = 'all' | 'active' | 'completed';
export type FilterCategory = 'all' | 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Learning' | 'Other';

interface FilterBarProps {
  statusFilter: FilterStatus;
  categoryFilter: FilterCategory;
  onStatusChange: (status: FilterStatus) => void;
  onCategoryChange: (category: FilterCategory) => void;
}

export function FilterBar({
  statusFilter,
  categoryFilter,
  onStatusChange,
  onCategoryChange,
}: FilterBarProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'icon');

  const statusFilters = [
    { value: 'all', label: 'All', icon: 'list' },
    { value: 'active', label: 'Active', icon: 'radio-button-off' },
    { value: 'completed', label: 'Done', icon: 'checkmark-circle' },
  ] as const;

  const categoryFilters = [
    { value: 'all', label: 'All' },
    { value: 'Work', label: 'Work' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Health', label: 'Health' },
    { value: 'Learning', label: 'Learning' },
    { value: 'Other', label: 'Other' },
  ] as const;

  return (
    <View style={styles.container}>
      {/* Status Filters */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: 20, fontWeight: 'bold' }]}>
          Status
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterChip,
                {
                  backgroundColor: statusFilter === filter.value ? tintColor : 'rgba(0, 0, 0, 0.05)',
                  borderColor: statusFilter === filter.value ? tintColor : borderColor,
                },
              ]}
              onPress={() => onStatusChange(filter.value)}>
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={statusFilter === filter.value ? 'white' : textColor}
                style={styles.filterIcon}
              />
                             <Text
                 style={[
                   styles.filterText,
                   { color: statusFilter === filter.value ? 'white' : textColor },
                 ]}>
                 {filter.label}
               </Text>
            </TouchableOpacity>
          ))}
                 </ScrollView>
       </View>

       {/* Category Filters */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: 20, fontWeight: 'bold' }]}>
          Category
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}>
          {categoryFilters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterChip,
                {
                  backgroundColor: categoryFilter === filter.value ? tintColor : 'rgba(0, 0, 0, 0.05)',
                  borderColor: categoryFilter === filter.value ? tintColor : borderColor,
                },
              ]}
              onPress={() => onCategoryChange(filter.value)}>
                             <Text
                 style={[
                   styles.filterText,
                   { color: categoryFilter === filter.value ? 'white' : textColor },
                 ]}>
                 {filter.label}
               </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 16,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
