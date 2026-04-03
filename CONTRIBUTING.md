# Contributing to DoIT - Chore Tracker 🏠✨

First off, thank you for considering contributing to DoIT! It's people like you who make it a great tool for households everywhere.

To keep the project stable and high-quality, we follow a professional **Feature Branch Workflow**. Please follow these guidelines for every contribution.

---

## 🚦 The 4-Step Development Workflow

### 1. Create a Feature Branch

**Never work directly on the `main` branch.** Before starting any task, create a new branch from `main`:

```bash
git checkout -b feature/your-feature-name
# OR for bugs
git checkout -b bugfix/your-bug-name
```

### 2. Make Your Changes

Write your code, test it locally in **Expo Go**, and ensure everything works as expected.

### 3. Commit and Push

Save your work with a clear, descriptive commit message and push it to GitHub:

```bash
git add .
git commit -m "Add [Feature Name]: Brief description of changes"
git push origin feature/your-feature-name
```

### 4. Open a Pull Request (PR)

1. Go to the [GitHub Repository](https://github.com/YOUR_USERNAME/doit-chore-tracker).
2. Click **"Compare & pull request"**.
3. Describe what you've changed and why.
4. Wait for a review! The project maintainer will review your code and merge it into `main` once it's ready.

---

## 📌 Issue Naming Conventions

Before starting work, please ensure there is an issue for the task. When creating a new issue, use this format:

**Format:** `[TYPE/Component] Short Description`

- **Types:** `Bug`, `Feature`, `Fix`, `Docs`, `UI`
- **Components:** `Auth`, `Dashboard`, `Rotation`, `DeepLinks`, `Groups`

**Examples:**

- `[Bug/Auth] Login button not clickable`
- `[Feature/UI] Add Dark Mode support`
- `[Fix/Rotation] Correct clockwise shift logic`

---

## 🎨 Code Style

- Use **Functional Components** and **Hooks**.
- Use **NativeWind** (Tailwind CSS) for styling.
- Keep components small and reusable.

---

## 🛠 Need Help?

If you have any questions or get stuck, feel free to open a "Question" issue or reach out to the project maintainers!

*Happy Coding!* 🚀
