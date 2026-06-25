import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

export function SuggestionCard({ suggestion, onAdd }) {
  return (
    <View style={styles.card}>
      <Text numberOfLines={2} style={styles.title}>
        {suggestion.title}
      </Text>
      <Text numberOfLines={2} style={styles.description}>
        {suggestion.description}
      </Text>
      <Pressable
        accessibilityLabel={`Add ${suggestion.title}`}
        accessibilityRole="button"
        onPress={onAdd}
        style={({ pressed }) => [styles.button, pressed && styles.pressedButton]}
      >
        <Text style={styles.buttonText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    minHeight: 36,
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginRight: spacing.md,
    padding: spacing.md,
    width: 210,
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  pressedButton: {
    opacity: 0.76,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    minHeight: 40,
  },
});
