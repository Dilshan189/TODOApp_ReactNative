import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Text, View } from 'react-native';
import { TodoItem, Todo } from '@/components/TodoItem';
import { AddTodo } from '@/components/AddTodo';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar, FilterStatus, FilterCategory } from '@/components/FilterBar';
import { EmptyState } from '@/components/EmptyState';
import { useThemeColor } from '@/hooks/useThemeColor';

// Demo data
const getDemoTodos = (): Todo[] => [
  {
    id: '1',
    text: 'Complete React Native project',
    completed: false,
    category: 'Work',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '2',
    text: 'Buy groceries for dinner',
    completed: true,
    category: 'Shopping',
    priority: 'medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
  {
    id: '3',
    text: 'Go for a 30-minute walk',
    completed: false,
    category: 'Health',
    priority: 'low',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
  },
  {
    id: '4',
    text: 'Read chapter 5 of React Native book',
    completed: false,
    category: 'Learning',
    priority: 'medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
  },
  {
    id: '5',
    text: 'Call mom to check in',
    completed: false,
    category: 'Personal',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
  },
];

export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>(getDemoTodos());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [refreshing, setRefreshing] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add new todo
  const handleAddTodo = useCallback((todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: generateId(),
      createdAt: new Date(),
    };
    setTodos(prev => [newTodo, ...prev]);
  }, []);

  // Toggle todo completion
  const handleToggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  // Edit todo
  const handleEditTodo = useCallback((id: string, text: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text } : todo
      )
    );
  }, []);

  // Delete todo
  const handleDeleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  // Handle todo press (for future detail view)
  const handleTodoPress = useCallback((todo: Todo) => {
    // Could open a detail modal or navigate to detail screen
    console.log('Todo pressed:', todo);
  }, []);

  // Filter and search todos
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (statusFilter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(todo => todo.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.category && todo.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort by priority and creation date
    return filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [todos, statusFilter, categoryFilter, searchQuery]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Get statistics
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, active, completionRate };
  }, [todos]);

  const renderTodoItem = useCallback(({ item }: { item: Todo }) => (
    <TodoItem
      todo={item}
      onToggle={handleToggleTodo}
      onEdit={handleEditTodo}
      onDelete={handleDeleteTodo}
      onPress={handleTodoPress}
    />
  ), [handleToggleTodo, handleEditTodo, handleDeleteTodo, handleTodoPress]);

  const renderEmptyState = useCallback(() => {
    if (searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') {
      return (
        <EmptyState
          title="No matching todos"
          message="Try adjusting your search or filters to find what you're looking for."
          icon="search-outline"
        />
      );
    }
    
    return (
      <EmptyState
        title="No todos yet"
        message="Start by adding your first todo to get organized!"
        icon="checkmark-circle-outline"
      />
    );
  }, [searchQuery, statusFilter, categoryFilter]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="default" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor, fontSize: 32, fontWeight: 'bold' }]}>
          My Todos
        </Text>
        {stats.total > 0 && (
          <View style={styles.statsContainer}>
            <Text style={[styles.statsText, { color: textColor }]}>
              {stats.completed}/{stats.total} completed
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${stats.completionRate}%` },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* Search Bar */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Filter Bar */}
      <FilterBar
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        onStatusChange={setStatusFilter}
        onCategoryChange={setCategoryFilter}
      />

      {/* Todo List */}
      <FlatList
        data={filteredTodos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={textColor}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={<View style={styles.listFooter} />}
      />

      {/* Add Todo Button */}
      <AddTodo onAdd={handleAddTodo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for FAB
  },
  listFooter: {
    height: 20,
  },
});
