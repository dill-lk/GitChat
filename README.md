<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 💬 GitChat

**A GitHub-styled real-time chat application**

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## ✨ Features

- 🔐 **GitHub Authentication** - Sign in securely with your GitHub account
- 💬 **Real-time Messaging** - Instant message delivery powered by Firebase Firestore
- ⌨️ **Typing Indicators** - See when others are typing in real-time
- 🎨 **GitHub-inspired UI** - Beautiful dark theme matching GitHub's design language
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔍 **User Discovery** - Find and chat with other GitHub users
- 📝 **Markdown Support** - Format your messages with inline code

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A Firebase project with Firestore and Authentication enabled
- GitHub OAuth App for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dill-lk/GitChat.git
   cd GitChat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the app running!

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Firebase** | Backend (Auth, Firestore) |
| **Tailwind CSS 4** | Styling |
| **Vite** | Build Tool |
| **Lucide React** | Icons |
| **Motion** | Animations |

---

## 📁 Project Structure

```
gitchat/
├── src/
│   ├── components/
│   │   ├── ChatMain.tsx      # Main chat interface
│   │   ├── Login.tsx         # GitHub authentication
│   │   ├── SidebarLeft.tsx   # User/chat list
│   │   ├── SidebarRight.tsx  # User profile panel
│   │   └── TopNav.tsx        # Navigation bar
│   ├── App.tsx               # Main app component
│   ├── firebase.ts           # Firebase configuration
│   ├── index.css             # Global styles
│   └── main.tsx              # Entry point
├── firebase-applet-config.json
├── firestore.rules
└── package.json
```

---

## 🔒 Firestore Security Rules

The app includes security rules in `firestore.rules` to protect user data. Make sure to deploy these to your Firebase project.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ by the GitChat Team**

[Report Bug](https://github.com/dill-lk/GitChat/issues) · [Request Feature](https://github.com/dill-lk/GitChat/issues)

</div>
