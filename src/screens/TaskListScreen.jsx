import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchTaskSuggestions } from '../api/todoSuggestions';
import { EmptyState } from '../components/EmptyState';
import { StatusFilterBar } from '../components/StatusFilterBar';
import { SuggestionCard } from '../components/SuggestionCard';
import { TaskCard } from '../components/TaskCard';
import { useTasks } from '../context/TasksContext';
import { colors, radius, spacing } from '../theme';

function getEmptyCopy(searchQuery, selectedFilter) {
  if (searchQuery.trim()) {
    return {
      title: 'No matching tasks',
      message: 'Try another title or clear the search field.',
    };
  }

  if (selectedFilter === 'active') {
    return {
      title: 'No active tasks',
      message: 'Everything in this filter is already completed.',
    };
  }

  if (selectedFilter === 'completed') {
    return {
      title: 'No completed tasks',
      message: 'Completed tasks will show up here.',
    };
  }

  return {
    title: 'No tasks yet',
    message: 'Add your first personal task or import one from suggestions.',
  };
}

export function TaskListScreen({ navigation }) {
  const {
    addTaskFromSuggestion,
    deleteTask,
    isLoading,
    tasks,
    toggleTask,
  } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadSuggestions() {
      try {
        setIsLoadingSuggestions(true);
        const remoteSuggestions = await fetchTaskSuggestions();

        if (isCurrent) {
          setSuggestions(remoteSuggestions);
          setSuggestionError('');
        }
      } catch {
        if (isCurrent) {
          setSuggestionError('Suggestions unavailable');
        }
      } finally {
        if (isCurrent) {
          setIsLoadingSuggestions(false);
        }
      }
    }

    loadSuggestions();

    return () => {
      isCurrent = false;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        selectedFilter === 'all' ||
        (selectedFilter === 'active' && !task.completed) ||
        (selectedFilter === 'completed' && task.completed);

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedFilter, tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;
  const emptyCopy = getEmptyCopy(searchQuery, selectedFilter);

  function confirmDelete(taskId, title) {
    Alert.alert('Delete task?', `"${title}" will be removed from your list.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTask(taskId),
      },
    ]);
  }

  function renderHeader() {
    return (
      <View style={styles.headerContent}>
        <View style={styles.hero}>
          <View>
            <Text style={styles.kicker}>PRITECH task manager</Text>
            <Text style={styles.title}>Personal tasks</Text>
          </View>

          <Pressable
            accessibilityLabel="Add new task"
            accessibilityRole="button"
            onPress={() => navigation.navigate('AddTask')}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{tasks.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{activeCount}</Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{completedCount}</Text>
            <Text style={styles.summaryLabel}>Done</Text>
          </View>
        </View>

        <TextInput
          autoCapitalize="none"
          clearButtonMode="while-editing"
          onChangeText={setSearchQuery}
          placeholder="Search by title"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={searchQuery}
        />

        <StatusFilterBar
          selectedFilter={selectedFilter}
          onChangeFilter={setSelectedFilter}
        />

        <View style={styles.suggestionsHeader}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          {isLoadingSuggestions ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : null}
        </View>

        {suggestionError ? (
          <Text style={styles.suggestionError}>{suggestionError}</Text>
        ) : null}

        {suggestions.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsScroller}
          >
            {suggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.externalId}
                suggestion={suggestion}
                onAdd={() => addTaskFromSuggestion(suggestion)}
              />
            ))}
          </ScrollView>
        ) : null}

        <Text style={styles.sectionTitle}>Tasks</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredTasks}
        keyExtractor={(task) => task.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState title={emptyCopy.title} message={emptyCopy.message} />
        }
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onDelete={() => confirmDelete(item.id, item.title)}
            onOpen={() => navigation.navigate('TaskDetails', { taskId: item.id })}
            onToggle={() => toggleTask(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 34,
  },
  headerContent: {
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  listContent: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  loadingScreen: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.78,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  suggestionError: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  suggestionsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  suggestionsScroller: {
    marginRight: -spacing.lg,
  },
  summaryItem: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  summaryNumber: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
  },
});
