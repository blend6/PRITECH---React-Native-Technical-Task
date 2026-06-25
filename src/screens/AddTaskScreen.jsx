import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTasks } from '../context/TasksContext';
import { colors, radius, spacing } from '../theme';

function validateTask(title, description) {
  const errors = {};
  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  if (!trimmedTitle) {
    errors.title = 'Title is required.';
  } else if (trimmedTitle.length < 3) {
    errors.title = 'Use at least 3 characters.';
  } else if (trimmedTitle.length > 80) {
    errors.title = 'Keep the title under 80 characters.';
  }

  if (!trimmedDescription) {
    errors.description = 'Description is required.';
  } else if (trimmedDescription.length > 240) {
    errors.description = 'Keep the description under 240 characters.';
  }

  return errors;
}

export function AddTaskScreen({ navigation }) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  function handleSubmit() {
    const nextErrors = validateTask(title, description);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    addTask({ title, description });
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            autoFocus
            maxLength={80}
            onChangeText={(value) => {
              setTitle(value);
              setErrors((currentErrors) => ({ ...currentErrors, title: undefined }));
            }}
            placeholder="Plan weekend groceries"
            placeholderTextColor={colors.muted}
            style={[styles.input, errors.title && styles.inputError]}
            value={title}
          />
          {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            maxLength={240}
            multiline
            onChangeText={(value) => {
              setDescription(value);
              setErrors((currentErrors) => ({
                ...currentErrors,
                description: undefined,
              }));
            }}
            placeholder="Add a short note about this task"
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              styles.textArea,
              errors.description && styles.inputError,
            ]}
            textAlignVertical="top"
            value={description}
          />
          <View style={styles.helperRow}>
            {errors.description ? (
              <Text style={styles.errorText}>{errors.description}</Text>
            ) : (
              <Text style={styles.helperText}>Short and specific works best.</Text>
            )}
            <Text style={styles.counter}>{description.length}/240</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleSubmit}
          style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
        >
          <Text style={styles.saveButtonText}>Save task</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  counter: {
    color: colors.muted,
    fontSize: 12,
    marginLeft: spacing.md,
  },
  errorText: {
    color: colors.danger,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  helperRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helperText: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  inputError: {
    borderColor: colors.danger,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.78,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 50,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '900',
  },
  screen: {
    flex: 1,
  },
  textArea: {
    minHeight: 132,
  },
});
