import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = '@pritech/tasks';

export async function loadStoredTasks() {
  const rawTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

  if (!rawTasks) {
    return [];
  }

  const parsedTasks = JSON.parse(rawTasks);
  return Array.isArray(parsedTasks) ? parsedTasks : [];
}

export async function saveStoredTasks(tasks) {
  await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}
