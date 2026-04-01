
# 💬 GitChat

**The missing DM feature for GitHub — Chat with developers using your GitHub identity**

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🤔 Why GitChat?

**GitHub has no DMs.** You can comment on issues and discussions, but there's no way to directly message other developers. GitChat solves this by:

- Connecting your **real GitHub profile** — no separate account needed
- Letting you **DM any developer** who's also on GitChat
- Showing your **GitHub identity** (username, avatar, bio, followers)
- Creating a **seamless experience** that feels native to GitHub

> *"What if GitHub had Discord-style DMs?"* — That's GitChat.

---

## ✨ Features

- 🔐 **GitHub OAuth Login** - Sign in with your GitHub account, no passwords to remember
- 👤 **Profile Sync** - Your GitHub avatar, bio, followers & following automatically imported
- 💬 **Real-time DMs** - Instant message delivery powered by Firebase Firestore
- ⌨️ **Typing Indicators** - See when others are typing in real-time
- 🎨 **GitHub Dark Theme** - Beautiful UI matching GitHub's design language
- 🔍 **Developer Discovery** - Find and chat with other GitHub users
- 📝 **Markdown Support** - Format messages with inline code blocks

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

## 🚀 Roadmap

Future features planned for GitChat:

- [ ] **Repo Rooms** - Group chat for repository collaborators
- [ ] **Code Snippet Sharing** - Share code with syntax highlighting
- [ ] **Issue/PR Cards** - Type `#123` to show live issue/PR status
- [ ] **Message Requests** - Accept/decline DMs to prevent spam
- [ ] **Online Status** - See who's currently online
- [ ] **Read Receipts** - Know when your message is seen
- [ ] **Mobile App** - React Native version

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

<parameter name="new_str">**Made with ❤️ for the GitHub Developer Community**

[🌐 Live Demo](https://gittchat.vercel.app) · [Report Bug](https://github.com/dill-lk/GitChat/issues) · [Request Feature](https://github.com/dill-lk/GitChat/issues)

</div>
