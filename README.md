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
   - Copy the `.env.example` file and rename it to `.env`.
   - Fill in your own Firebase credentials in the `.env` file.
   - Enable **Firestore** and **Anonymous Authentication** in the console.

4. **Start the app**
   ```bash
   npx expo start
   ```

5. **Scan the QR Code** 
   Using the **Expo Go** app on your phone, scan the QR code that appears in your terminal. 

---

## 🤝 Contributing & Issue Tracking

We love contributions! To keep our development clean and organized, please follow our **Contribution Guidelines**.

👉 **[Read the Contributing Guide](./CONTRIBUTING.md)**

It covers:

- Our **4-Step Development Workflow** (Feature Branches & PRs).
- **Issue Naming Conventions** (e.g., `[Bug/Auth]`).
- Code style and how to submit a PR.


---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

*Made with ❤️ for households everywhere.*
