/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { TopNav } from './components/TopNav';
import { SidebarLeft } from './components/SidebarLeft';
import { ChatMain } from './components/ChatMain';
import { SidebarRight } from './components/SidebarRight';
import { Login } from './components/Login';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeChatUserId, setActiveChatUserId] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch full user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          } else {
            // Fallback if doc doesn't exist yet (e.g., right after signup)
            setUser({
              uid: firebaseUser.uid,
              login: firebaseUser.displayName?.replace(/\s+/g, '').toLowerCase() || 'user',
              name: firebaseUser.displayName || '',
              avatarUrl: firebaseUser.photoURL || '',
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-default flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fg-default"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-canvas-default text-fg-default font-sans">
      <TopNav user={user} />
      <div className="flex flex-1 mt-12 h-[calc(100vh-48px)]">
        <SidebarLeft user={user} activeId={activeChatUserId} onSelectChat={setActiveChatUserId} />
        <ChatMain user={user} activeChatUserId={activeChatUserId} />
        <SidebarRight activeChatUserId={activeChatUserId} />
      </div>
    </div>
  );
}

