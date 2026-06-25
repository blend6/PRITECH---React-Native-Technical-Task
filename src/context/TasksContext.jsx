import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { loadStoredTasks, saveStoredTasks } from '../storage/tasksStorage';

const TasksContext = createContext(undefined);

function createTask(input) {
  return {
    id: `${Date.now()}-${Math.round(Math.random() * 1_000_000)}`,
    title: input.title.trim(),
    description: input.description.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    async function hydrateTasks() {
      try {
        const storedTasks = await loadStoredTasks();
        setTasks(storedTasks);
      } catch {
        setTasks([]);
      } finally {
        setHasLoaded(true);
        setIsLoading(false);
      }
    }

    hydrateTasks();
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    saveStoredTasks(tasks).catch(() => undefined);
  }, [hasLoaded, tasks]);

  const addTask = useCallback((input) => {
    const task = createTask(input);
    setTasks((currentTasks) => [task, ...currentTasks]);
    return task.id;
  }, []);

  const addTaskFromSuggestion = useCallback((suggestion) => {
    const task = createTask({
      title: suggestion.title,
      description: suggestion.description,
    });

    setTasks((currentTasks) => [task, ...currentTasks]);
    return task.id;
  }, []);

  const toggleTask = useCallback((taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }, []);

  const getTaskById = useCallback(
    (taskId) => tasks.find((task) => task.id === taskId),
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      isLoading,
      addTask,
      addTaskFromSuggestion,
      toggleTask,
      deleteTask,
      getTaskById,
    }),
    [
      addTask,
      addTaskFromSuggestion,
      deleteTask,
      getTaskById,
      isLoading,
      tasks,
      toggleTask,
    ],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasks must be used inside TasksProvider.');
  }

  return context;
}
