import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';
import { formatCreatedDate } from '../utils/dates';

export function TaskCard({ task, onOpen, onToggle, onDelete }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
    >
      <View style={styles.topRow}>
        <Pressable
          accessibilityLabel={task.completed ? 'Mark task as active' : 'Mark task as done'}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
          onPress={onToggle}
          style={[styles.checkbox, task.completed && styles.checkedBox]}
        >
          <Text style={[styles.checkboxText, task.completed && styles.checkedText]}>
            {task.completed ? 'X' : ''}
          </Text>
        </Pressable>

        <View style={styles.copy}>
          <Text
            numberOfLines={1}
            style={[styles.title, task.completed && styles.completedTitle]}
          >
            {task.title}
          </Text>
          <Text numberOfLines={2} style={styles.description}>
            {task.description}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
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

        <Text numberOfLines={1} style={styles.date}>
          {formatCreatedDate(task.createdAt)}
        </Text>

        <Pressable
          accessibilityLabel={`Delete ${task.title}`}
          accessibilityRole="button"
          onPress={onDelete}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  activeBadge: {
    backgroundColor: colors.warningSoft,
  },
  activeText: {
    color: colors.warning,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    marginTop: 1,
    width: 28,
  },
  checkboxText: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 20,
  },
  checkedBox: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkedText: {
    color: colors.surface,
  },
  completedTitle: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  date: {
    color: colors.muted,
    flex: 1,
    fontSize: 12,
  },
  deleteButton: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  doneBadge: {
    backgroundColor: colors.successSoft,
  },
  doneText: {
    color: colors.success,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pressedCard: {
    opacity: 0.72,
  },
  statusBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
