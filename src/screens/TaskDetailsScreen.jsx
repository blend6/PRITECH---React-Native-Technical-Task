import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { useTasks } from '../context/TasksContext';
import { colors, radius, spacing } from '../theme';
import { formatCreatedDate } from '../utils/dates';

export function TaskDetailsScreen({ navigation, route }) {
  const { deleteTask, getTaskById, toggleTask } = useTasks();
  const task = getTaskById(route.params.taskId);

  if (!task) {
    return (
      <View style={styles.missingContainer}>
        <EmptyState
          title="Task not found"
          message="This task may have already been deleted."
        />
      </View>
    );
  }

  function confirmDelete() {
    Alert.alert('Delete task?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View
          style={[
            styles.statusBadge,
            task.completed ? styles.doneBadge : styles.activeBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              task.completed ? styles.doneText : styles.activeText,
            ]}
          >
            {task.completed ? 'Completed' : 'Active'}
          </Text>
        </View>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.date}>{formatCreatedDate(task.createdAt)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{task.description}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => toggleTask(task.id)}
          style={({ pressed }) => [
            styles.primaryButton,
            task.completed && styles.secondaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
              task.completed && styles.secondaryButtonText,
            ]}
          >
            {task.completed ? 'Mark as active' : 'Mark as completed'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={confirmDelete}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
        >
          <Text style={styles.deleteButtonText}>Delete task</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
  },
  activeBadge: {
    backgroundColor: colors.warningSoft,
  },
  activeText: {
    color: colors.warning,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  date: {
    color: colors.muted,
    fontSize: 13,
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '900',
  },
  description: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  doneBadge: {
    backgroundColor: colors.successSoft,
  },
  doneText: {
    color: colors.success,
  },
  header: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  missingContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.78,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 50,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
  },
  secondaryButton: {
    backgroundColor: colors.chip,
    borderColor: colors.border,
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: colors.text,
  },
  section: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
  },
});
