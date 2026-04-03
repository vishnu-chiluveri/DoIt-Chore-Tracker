# DoIT - Chore Tracker 🏠✨

**Clean together, live better.** 

DoIT is a collaborative house chore management app built with **React Native** and **Expo**. It was designed specifically for shared households to fairly and automatically rotate weekly responsibilities like Kitchen Cleaning, Bathroom Cleaning, and more.

[![Expo Go Compatible](https://img.shields.io/badge/Expo-Go_Compatible-blue.svg)](https://expo.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Key Features

- **Admin-Led Flow:** One person creates the room and acts as the project administrator.
- **Dynamic Chores:** Admins can define custom chores for their specific household.
- **Fair Weekly Rotation:** Automatically shifts roles every week in a clockwise cycle after an initial random assignment.
- **Activity Feed:** See who has joined the room in real-time.
- **Multi-Room Support:** Join your university flat, your home, or your friend's place—and switch between them effortlessly.
- **Deep Linking:** Send invite links via WhatsApp or Join by Code for quick entry.

## 🛠 Tech Stack

- **Framework:** [Expo](https://expo.dev/) (React Native)
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for Native)
- **Database / Auth:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Navigation:** [React Navigation](https://reactnavigation.org/)

---

## 📦 Getting Started

### Prerequisites

You need [Node.js](https://nodejs.org/) installed on your computer and the [Expo Go](https://expo.dev/client) app installed on your phone.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/doit-chore-tracker.git
   cd doit-chore-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase** 
   - Create a project on [Firebase Console](https://console.firebase.google.com/).
   - Add a "Web App" to get your configuration.
   - Replace the config in `src/services/firebase.js`.
   - Enable **Firestore** and **Anonymous Authentication**.

4. **Start the app**
   ```bash
   npx expo start
   ```

5. **Scan the QR Code** 
   Using the **Expo Go** app on your phone, scan the QR code that appears in your terminal. 

---

## 🤝 Contributing & Issue Tracking

We love contributions! To keep our development clean and organized, please follow these guidelines.

### Reporting Issues

Before opening a new issue, please check the [existing issues](https://github.com/YOUR_USERNAME/doit-chore-tracker/issues) to avoid duplicates. When opening a new issue, please follow our **Naming Convention**:

> [!TIP]
> **Issue Naming Convention:** `[TYPE/Component] Short Description`
> 
> *   `[Bug/Auth]` Login button not clickable
> *   `[Feature/UI]` Add Dark Mode support 
> *   `[Docs/ReadMe]` Fix typo in installation steps
> *   `[Fix/Rotation]` Correct clockwise shift logic

### Submitting a PR

1. **Fork** the Project
2. **Create your Feature Branch** using the same naming scheme: `git checkout -b feature/AmazingFeature`
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

*Made with ❤️ for households everywhere.*
