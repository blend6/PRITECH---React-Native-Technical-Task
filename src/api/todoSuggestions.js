const SUGGESTIONS_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=6';

function toTitleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export async function fetchTaskSuggestions() {
  const response = await fetch(SUGGESTIONS_URL);

  if (!response.ok) {
    throw new Error('Unable to load task suggestions.');
  }

  const todos = await response.json();

  return todos.map((todo) => ({
    externalId: String(todo.id),
    title: toTitleCase(todo.title),
    description: todo.completed
      ? 'Imported from JSONPlaceholder as a completed idea.'
      : 'Imported from JSONPlaceholder as a task idea.',
  }));
}
