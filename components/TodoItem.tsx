import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  TextInput,
  View,
  Text,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useThemeColor } from '@/hooks/useThemeColor';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onPress: (todo: Todo) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete, onPress }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const translateX = new Animated.Value(0);
  const scale = new Animated.Value(1);

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');

  const priorityColors = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336',
  };

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(todo.id);
  };

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(todo.id) },
      ]
    );
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      
      if (translationX < -100) {
        // Swipe left - delete
        Animated.timing(translateX, {
          toValue: -200,
          duration: 200,
          useNativeDriver: true,
        }).start(() => handleDelete());
      } else {
        // Reset position
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress(todo);
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX }, { scale }],
          },
        ]}>
        <TouchableOpacity
          style={[
            styles.todoItem,
            {
              backgroundColor,
              borderColor,
              opacity: todo.completed ? 0.6 : 1,
            },
          ]}
          onPress={handlePress}
          activeOpacity={0.7}>
          
          {/* Priority indicator */}
          <View
            style={[
              styles.priorityIndicator,
              { backgroundColor: priorityColors[todo.priority] },
            ]}
          />

          {/* Checkbox */}
          <TouchableOpacity
            style={[
              styles.checkbox,
              {
                borderColor,
                backgroundColor: todo.completed ? priorityColors[todo.priority] : 'transparent',
              },
            ]}
            onPress={handleToggle}>
            {todo.completed && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </TouchableOpacity>

          {/* Todo content */}
          <View style={styles.content}>
            {isEditing ? (
              <TextInput
                style={[
                  styles.todoText,
                  { 
                    textDecorationLine: todo.completed ? 'line-through' : 'none',
                    color: textColor,
                  },
                ]}
                value={editText}
                onChangeText={setEditText}
                onBlur={handleEdit}
                autoFocus
              />
            ) : (
              <Text
                style={[
                  styles.todoText,
                  { 
                    textDecorationLine: todo.completed ? 'line-through' : 'none',
                    color: textColor,
                  },
                ]}>
                {todo.text}
              </Text>
            )}
            
            {todo.category && (
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryText}>{todo.category}</Text>
              </View>
            )}
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsEditing(!isEditing)}>
              <Ionicons
                name={isEditing ? 'checkmark' : 'pencil'}
                size={20}
                color={textColor}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
});
