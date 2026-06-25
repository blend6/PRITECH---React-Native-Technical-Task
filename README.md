# PRITECH Task Manager

A small Expo React Native app for the PRITECH technical task. It lets a user manage a personal task list with local persistence, simple navigation, search, filtering, and public API suggestions.

## What's Included

- Task list screen
- Add task screen with validation
- Mark tasks as completed or active
- Delete tasks from the list or details screen
- Task details view
- Search by title
- Filter by status
- Local storage with AsyncStorage
- Public API data from JSONPlaceholder
- Empty states and reusable components

## Tech Stack

- Expo SDK 54
- JavaScript
- React Native
- React Navigation
- AsyncStorage

## Run Locally

```bash
npm install
npm start
```

For a physical iPhone or Android device, use the Expo QR code from the Metro screen. If you need LAN mode explicitly:

```bash
npx expo start --lan --clear
```

For emulators:

```bash
npm run android
npm run ios
```

## How to Test

1. Open the app and confirm the empty state.
2. Add a task with a title and description.
3. Try saving empty fields to verify validation.
4. Mark the task completed and then active again.
5. Open the task details screen.
6. Delete the task from the list or details view.
7. Add a suggestion from the public API section.
8. Search by title and use the status filters.
9. Close and reopen the app to confirm local persistence.

## Public API

The app uses JSONPlaceholder for task suggestions:

```text
https://jsonplaceholder.typicode.com/todos?_limit=6
```

## Implementation Notes

Task state lives in `src/context/TasksContext.jsx`.
Local persistence is handled in `src/storage/tasksStorage.js`.
Screens are split into list, add, and details views under `src/screens`.
Reusable UI pieces live in `src/components`.

## Screenshots

Below are the screenshots demonstrating the main screens. Add the image files to `assets/screenshots/` with these names if you want them to render on GitHub:

![Task list](assets/screenshots/sc1.jfif)
![Add task](assets/screenshots/sc2.jfif)
![Task details](assets/screenshots/sc3.jfif)
![Suggestions](assets/screenshots/sc4.jfif)

## Submission Checklist

- Push the repository to GitHub and make it public.
- Add 2 to 4 screenshots or a short screen recording.
- Verify the README steps work on a clean install.

