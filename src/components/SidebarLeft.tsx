import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase';

interface ChatItem {
  id: string;
  avatar: string;
  name: string;
  preview: string;
  time: string;
  unread?: number;
  online?: boolean;
  color?: string;
  bgColor?: string;
  isTeam?: boolean;
}

export const SidebarLeft = ({ user, activeId, onSelectChat }: { user: any, activeId: string, onSelectChat: (id: string) => void }) => {
  const [users, setUsers] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Fetch all users except the current user
    const qUsers = query(collection(db, 'users'), where('uid', '!=', user.uid));
    
    // Fetch chats for the current user
    const qChats = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));

    let fetchedUsers: any[] = [];
    let fetchedChats: Record<string, any> = {};

    const updateState = () => {
      const combinedUsers: ChatItem[] = fetchedUsers.map(u => {
        const chatId = [user.uid, u.uid].sort().join('_');
        const chatData = fetchedChats[chatId];
        
        let timeStr = '';
        if (chatData?.lastMessageTime) {
          const date = chatData.lastMessageTime.toDate ? chatData.lastMessageTime.toDate() : new Date(chatData.lastMessageTime);
          timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        return {
          id: u.uid,
          avatar: u.avatarUrl || u.avatar_url || '',
          name: u.login,
          preview: chatData?.lastMessage || u.bio || 'Available for chat',
          time: timeStr,
          online: true,
          lastMessageTime: chatData?.lastMessageTime?.toMillis?.() || 0
        };
      });

      // Sort by last message time descending
      combinedUsers.sort((a, b) => (b as any).lastMessageTime - (a as any).lastMessageTime);

      setUsers(combinedUsers);
      if (combinedUsers.length > 0 && !activeId) {
        onSelectChat(combinedUsers[0].id);
      }
      setLoading(false);
    };

    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      fetchedUsers = [];
      snapshot.forEach((doc) => {
        fetchedUsers.push(doc.data());
      });
      updateState();
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    const unsubscribeChats = onSnapshot(qChats, (snapshot) => {
      fetchedChats = {};
      snapshot.forEach((doc) => {
        fetchedChats[doc.id] = doc.data();
      });
      updateState();
    }, (error) => {
      console.error("Error fetching chats:", error);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeChats();
    };
  }, [user?.uid, activeId, onSelectChat]);

  const renderChatItem = (chat: ChatItem) => (
    <div 
      key={chat.id}
      onClick={() => onSelectChat(chat.id)}
      className={`flex items-center gap-2.5 p-2 cursor-pointer rounded-md mx-2 my-0.5 relative transition-colors ${activeId === chat.id ? 'bg-accent-emphasis' : 'hover:bg-white/5'}`}
    >
      <div className="w-9 h-9 flex-shrink-0 relative">
        {chat.avatar.startsWith('http') ? (
          <img src={chat.avatar} alt={chat.name} className={`w-full h-full object-cover border-2 border-white/10 ${chat.isTeam ? 'rounded-md' : 'rounded-full'}`} referrerPolicy="no-referrer" />
        ) : (
          <div 
            className={`w-full h-full border-2 border-white/10 flex items-center justify-center text-[13px] font-semibold overflow-hidden ${chat.isTeam ? 'rounded-md' : 'rounded-full'}`}
            style={{ backgroundColor: chat.bgColor || '#21262d', color: chat.color || 'var(--color-fg-default)' }}
          >
            {chat.avatar}
          </div>
        )}
      </div>
      {chat.online && <div className="w-2 h-2 bg-success-fg rounded-full border-2 border-canvas-subtle absolute bottom-2 left-10"></div>}
      
      <div className="flex-1 min-w-0">
        <div className={`text-[13px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis ${activeId === chat.id ? 'text-white' : 'text-fg-default'}`}>
          {chat.name}
        </div>
        <div className={`text-[12px] whitespace-nowrap overflow-hidden text-ellipsis mt-[1px] ${activeId === chat.id ? 'text-white/70' : 'text-fg-muted'}`}>
          {chat.preview}
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <div className={`text-[11px] ${activeId === chat.id ? 'text-white/60' : 'text-fg-subtle'}`}>
          {chat.time}
        </div>
        {chat.unread && activeId !== chat.id && (
          <div className="bg-accent-emphasis text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full min-w-[18px] text-center">
            {chat.unread}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <aside className="w-[280px] min-w-[280px] bg-canvas-subtle border-r border-border-default flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border-muted flex items-center justify-between">
        <div className="text-sm font-semibold text-fg-default flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-fg-muted"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/></svg>
          Messages
        </div>
        <button className="bg-transparent border-none text-fg-muted cursor-pointer p-1 rounded flex items-center hover:bg-white/5 hover:text-fg-default transition-colors" title="New message">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"/></svg>
        </button>
      </div>

      <div className="m-3 mb-2 bg-canvas-default border border-border-default rounded-md p-1.5 px-2.5 flex items-center gap-2 focus-within:border-accent-fg focus-within:shadow-[0_0_0_3px_rgba(31,111,235,.4)] transition-shadow">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-fg-subtle flex-shrink-0"><path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/></svg>
        <input type="text" placeholder="Find a conversation" className="bg-transparent border-none outline-none text-fg-default text-[13px] flex-1 font-sans placeholder:text-fg-subtle" />
      </div>

      <div className="flex-1 overflow-y-auto pb-2">
        <div className="px-4 py-2 pb-1 text-[11px] font-semibold uppercase text-fg-subtle tracking-wider">Users</div>
        {loading ? (
          <div className="p-4 text-center text-xs text-fg-muted">Loading users...</div>
        ) : users.length > 0 ? (
          users.map(renderChatItem)
        ) : (
          <div className="p-4 text-center text-xs text-fg-muted">No other users found. Invite some friends!</div>
        )}
      </div>
    </aside>
  );
};
