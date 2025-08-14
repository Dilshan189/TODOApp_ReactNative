import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Todo } from './TodoItem';

interface AddTodoProps {
  onAdd: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [scale] = useState(new Animated.Value(1));

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'icon');

  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Other'];
  const priorities = [
    { value: 'low', label: 'Low', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', color: '#FF9800' },
    { value: 'high', label: 'High', color: '#F44336' },
  ] as const;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setIsVisible(true);
  };

  const handleAdd = () => {
    if (text.trim()) {
      onAdd({
        text: text.trim(),
        completed: false,
        category: category || undefined,
        priority,
      });
      
      // Reset form
      setText('');
      setCategory('');
      setPriority('medium');
      setIsVisible(false);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleCancel = () => {
    setText('');
    setCategory('');
    setPriority('medium');
    setIsVisible(false);
  };

  return (
    <>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: tintColor }]}
          onPress={handlePress}
          activeOpacity={0.8}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}>
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: 32, fontWeight: 'bold' }]}>
              Add New Todo
            </Text>
                         <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
               <Ionicons name="close" size={24} color={textColor} />
             </TouchableOpacity>
           </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Todo Text Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { fontSize: 20, fontWeight: 'bold' }]}>
                What needs to be done?
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor,
                    borderColor,
                    color: textColor,
                  },
                ]}
                value={text}
                onChangeText={setText}
                placeholder="Enter your todo..."
                placeholderTextColor={borderColor}
                multiline
                maxLength={200}
                autoFocus
              />
            </View>


            {/* Category Selection */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { fontSize: 20, fontWeight: 'bold' }]}>
                Category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: category === cat ? tintColor : 'rgba(0, 0, 0, 0.05)',
                        borderColor: category === cat ? tintColor : borderColor,
                      },
                    ]}
                    onPress={() => setCategory(cat)}>
                                         <Text
                       style={[
                         styles.categoryChipText,
                         { color: category === cat ? 'white' : textColor },
                       ]}>
                       {cat}
                     </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Priority Selection */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { fontSize: 20, fontWeight: 'bold' }]}>
                Priority
              </Text>
              <View style={styles.priorityContainer}>
                {priorities.map((p) => (
                  <TouchableOpacity
                    key={p.value}
                    style={[
                      styles.priorityChip,
                      {
                        backgroundColor: priority === p.value ? p.color : 'rgba(0, 0, 0, 0.05)',
                        borderColor: priority === p.value ? p.color : borderColor,
                      },
                    ]}
                    onPress={() => setPriority(p.value)}>
                                         <Text
                       style={[
                         styles.priorityChipText,
                         { color: priority === p.value ? 'white' : textColor },
                       ]}>
                       {p.label}
                     </Text>
                  </TouchableOpacity>
                ))}
                             </View>
             </View>
           </ScrollView>

           {/* Action Buttons */}
           <View style={styles.actions}>
             <TouchableOpacity
               style={[styles.button, styles.cancelButton, { borderColor }]}
               onPress={handleCancel}>
               <Text style={[styles.buttonText, { color: textColor }]}>
                 Cancel
               </Text>
             </TouchableOpacity>
             <TouchableOpacity
               style={[
                 styles.button,
                 styles.addButton,
                 { backgroundColor: text.trim() ? tintColor : borderColor },
               ]}
               onPress={handleAdd}
               disabled={!text.trim()}>
               <Text style={[styles.buttonText, { color: 'white' }]}>
                 Add Todo
               </Text>
             </TouchableOpacity>
           </View>
         </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  addButton: {
    borderColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
