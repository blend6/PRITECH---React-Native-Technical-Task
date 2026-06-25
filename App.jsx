import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TasksProvider } from './src/context/TasksContext';
import { AddTaskScreen } from './src/screens/AddTaskScreen';
import { TaskDetailsScreen } from './src/screens/TaskDetailsScreen';
import { TaskListScreen } from './src/screens/TaskListScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <TasksProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="dark" />
          <Stack.Navigator
            screenOptions={{
              contentStyle: { backgroundColor: colors.background },
              headerShadowVisible: false,
              headerStyle: { backgroundColor: colors.surface },
              headerTitleStyle: { color: colors.text },
              headerTintColor: colors.primary,
            }}
          >
            <Stack.Screen
              name="TaskList"
              component={TaskListScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddTask"
              component={AddTaskScreen}
              options={{ title: 'New task' }}
            />
            <Stack.Screen
              name="TaskDetails"
              component={TaskDetailsScreen}
              options={{ title: 'Task details' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TasksProvider>
    </SafeAreaProvider>
  );
}
