import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Message {
  id: string;
  authorId: string;
  text: string;
  createdAt: any;
}

export const ChatMain = ({ user, activeChatUserId }: { user: any, activeChatUserId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [activeChatUser, setActiveChatUser] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const chatId = user?.uid && activeChatUserId 
    ? [user.uid, activeChatUserId].sort().join('_') 
    : '';

  useEffect(() => {
    if (!activeChatUserId) {
      setActiveChatUser(null);
      return;
    }

    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'users', activeChatUserId));
      if (userDoc.exists()) {
        setActiveChatUser(userDoc.data());
      }
    };
    fetchUser();
  }, [activeChatUserId]);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(fetchedMessages);
      scrollToBottom();
    });

    const unsubscribeChat = onSnapshot(doc(db, 'chats', chatId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsTyping(data.typing?.[activeChatUserId] || false);
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeChat();
    };
  }, [chatId, activeChatUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    if (!chatId || !user?.uid) return;

    setDoc(doc(db, 'chats', chatId), { typing: { [user.uid]: true } }, { merge: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setDoc(doc(db, 'chats', chatId), { typing: { [user.uid]: false } }, { merge: true });
    }, 2000);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !chatId || !user?.uid) return;

    const messageText = inputValue.trim();
    setInputValue('');
    setActiveTab('write');

    try {
      await setDoc(doc(db, 'chats', chatId), {
        participants: [user.uid, activeChatUserId],
        lastMessage: messageText,
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        typing: { [user.uid]: false }
      }, { merge: true });

      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        chatId,
        authorId: user.uid,
        text: messageText,
        createdAt: serverTimestamp(),
      });
      
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSend();
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderTextWithCode = (text: string) => {
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-xs text-fg-default">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (!activeChatUserId) {
    return (
      <main className="flex-1 flex flex-col bg-canvas-default items-center justify-center text-fg-muted">
        <svg height="48" viewBox="0 0 16 16" width="48" className="fill-fg-subtle mb-4">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
        </svg>
        <p>Select a user to start chatting</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-canvas-default">
      {/* Header */}
      <div className="p-3 px-4 border-b border-border-default flex items-center gap-3 bg-canvas-subtle flex-shrink-0">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 bg-[#21262d] flex items-center justify-center text-xs font-semibold overflow-hidden flex-shrink-0">
          {(activeChatUser?.avatarUrl || activeChatUser?.avatar_url) ? (
            <img src={activeChatUser.avatarUrl || activeChatUser.avatar_url} alt={activeChatUser.login} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            activeChatUser?.login?.substring(0, 2).toUpperCase() || 'U'
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-fg-default">{activeChatUser?.name || activeChatUser?.login || 'Loading...'} <span className="font-normal text-fg-muted text-xs">· {activeChatUser?.login}</span></div>
          <div className="text-xs text-success-fg flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-success-fg rounded-full online-indicator"></div>
            Active now
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="bg-transparent border-none text-fg-muted cursor-pointer p-1.5 rounded-md flex items-center hover:bg-white/5 hover:text-fg-default transition-colors" title="View profile">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.5 5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM12 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-.5 8.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1 0-1h6a.5.5 0 0 1 .5.5Z"/></svg>
          </button>
          <button className="bg-transparent border-none text-fg-muted cursor-pointer p-1.5 rounded-md flex items-center hover:bg-white/5 hover:text-fg-default transition-colors" title="Search messages">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/></svg>
          </button>
          <button className="bg-transparent border-none text-fg-muted cursor-pointer p-1.5 rounded-md flex items-center hover:bg-white/5 hover:text-fg-default transition-colors" title="More options">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 chat-messages">
        {messages.length === 0 ? (
          <div className="text-center text-fg-muted text-sm mt-10">
            No messages yet. Say hi to @{activeChatUser?.login}!
          </div>
        ) : (
          (() => {
            let lastDateStr = '';
            return messages.map((msg) => {
              const isOwn = msg.authorId === user?.uid;
              const author = isOwn ? user : activeChatUser;
              
              const msgDate = msg.createdAt?.toDate ? msg.createdAt.toDate() : new Date(msg.createdAt || Date.now());
              const dateStr = msgDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
              const showDate = dateStr !== lastDateStr;
              lastDateStr = dateStr;

              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div className="flex items-center justify-center my-2">
                      <div className="bg-canvas-subtle border border-border-default text-fg-muted text-xs px-3 py-1 rounded-full">
                        {dateStr}
                      </div>
                    </div>
                  )}
                  <div className={`flex flex-col gap-0 message-wrapper message-enter ${isOwn ? 'items-end message-wrapper-own' : ''}`}>
                    <div className={`relative rounded-md max-w-[68%] border message-comment ${isOwn ? 'border-[#1a3e6b] bg-[#0d2340]' : 'border-border-default bg-canvas-subtle'}`}>
                      <div className={`px-3 py-2 border-b rounded-t-md flex items-center gap-2 ${isOwn ? 'bg-[#0c1d30] border-[#1a3e6b]' : 'bg-[#161b22] border-border-muted'}`}>
                        <div className="w-5 h-5 rounded-full bg-[#21262d] border border-white/10 flex items-center justify-center text-[9px] font-semibold overflow-hidden flex-shrink-0">
                          {(author?.avatarUrl || author?.avatar_url) ? (
                            <img src={author.avatarUrl || author.avatar_url} alt={author.login} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            author?.login?.substring(0, 2).toUpperCase() || 'U'
                          )}
                        </div>
                        <span className="text-[13px] font-semibold text-fg-default">{author?.login}</span>
                        <span className="text-fg-subtle text-xs ml-1">commented</span>
                        <span className="text-xs text-fg-subtle ml-1">{formatTime(msg.createdAt)}</span>
                      </div>
                      <div className="p-3 text-sm leading-relaxed text-fg-default whitespace-pre-wrap">
                        {renderTextWithCode(msg.text)}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            });
          })()
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 py-2 text-xs text-fg-muted flex items-center gap-2 italic bg-canvas-default">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
          {activeChatUser?.login} is typing...
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 px-4 border-t border-border-default bg-canvas-subtle flex-shrink-0">
        <div className="bg-canvas-default border border-border-default rounded-md overflow-hidden focus-within:border-accent-fg focus-within:shadow-[0_0_0_3px_rgba(31,111,235,.4)] transition-shadow">
          <div className="flex border-b border-border-default bg-canvas-subtle">
            <button 
              className={`px-4 py-2 text-[13px] font-medium cursor-pointer border-none bg-transparent relative transition-colors ${activeTab === 'write' ? 'text-fg-default' : 'text-fg-muted hover:text-fg-default hover:bg-white/5'}`}
              onClick={() => setActiveTab('write')}
            >
              Write
              {activeTab === 'write' && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-accent-fg rounded-t-sm"></div>}
            </button>
            <button 
              className={`px-4 py-2 text-[13px] font-medium cursor-pointer border-none bg-transparent relative transition-colors ${activeTab === 'preview' ? 'text-fg-default' : 'text-fg-muted hover:text-fg-default hover:bg-white/5'}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
              {activeTab === 'preview' && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-accent-fg rounded-t-sm"></div>}
            </button>
          </div>
          
          {activeTab === 'write' ? (
            <div>
              <div className="px-2 py-1.5 border-b border-border-muted flex gap-0.5 items-center">
                <button className="bg-transparent border-none text-fg-muted cursor-pointer p-1 rounded flex items-center hover:bg-white/5 hover:text-fg-default" title="Bold"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2h4.5a3.501 3.501 0 0 1 2.852 5.53A3.499 3.499 0 0 1 9 14H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm1 7v3h4a1.5 1.5 0 0 0 0-3Zm3.5-2a1.5 1.5 0 0 0 0-3H5v3Z"/></svg></button>
                <button className="bg-transparent border-none text-fg-muted cursor-pointer p-1 rounded flex items-center hover:bg-white/5 hover:text-fg-default" title="Italic"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M6 2.75A.75.75 0 0 1 6.75 2h6.5a.75.75 0 0 1 0 1.5h-2.505l-3.858 9H9.25a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.505l3.858-9H6.75A.75.75 0 0 1 6 2.75Z"/></svg></button>
                <div className="w-px h-4 bg-border-default mx-1"></div>
                <button className="bg-transparent border-none text-fg-muted cursor-pointer p-1 rounded flex items-center hover:bg-white/5 hover:text-fg-default" title="Code"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"/></svg></button>
                <div className="w-px h-4 bg-border-default mx-1"></div>
                <button className="bg-transparent border-none text-fg-muted cursor-pointer p-1 rounded flex items-center hover:bg-white/5 hover:text-fg-default font-mono" title="Mention">@</button>
                <button className="bg-transparent border-none text-fg-muted cursor-pointer p-1 rounded flex items-center hover:bg-white/5 hover:text-fg-default font-mono" title="Issue / PR">#</button>
              </div>
              <textarea 
                className="w-full min-h-[80px] max-h-[200px] bg-transparent border-none outline-none p-3 text-fg-default text-sm font-sans leading-relaxed resize-y block placeholder:text-fg-subtle" 
                placeholder={`Message @${activeChatUser?.login || 'user'}...`}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              ></textarea>
            </div>
          ) : (
            <div className="p-3 min-h-[80px] text-sm text-fg-muted">
              {inputValue.trim() ? (
                <div className="text-fg-default leading-relaxed whitespace-pre-wrap">
                  {renderTextWithCode(inputValue)}
                </div>
              ) : (
                <em className="text-fg-muted">Nothing to preview</em>
              )}
            </div>
          )}
          
          <div className="p-2 px-3 flex items-center justify-between border-t border-border-muted">
            <div className="text-xs text-fg-subtle flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v9.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25ZM7.25 8.5h2l-3.5 3.5V10H3.5V7h2.25V5l3.5 3.5Z"/></svg>
              Markdown is supported
            </div>
            <div className="flex gap-2">
              <button 
                className="send-btn bg-success-emphasis border border-white/10 text-white px-4 py-1.5 rounded-md text-[13px] font-medium cursor-pointer flex items-center gap-1.5 transition-colors hover:bg-[#2ea043] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M.989 8 .064 2.68a1.342 1.342 0 0 1 1.85-1.462l13.402 5.744a1.13 1.13 0 0 1 0 2.076L1.913 14.782a1.343 1.343 0 0 1-1.85-1.463L.99 8Zm.603-5.288L2.38 7.25h4.87a.75.75 0 0 1 0 1.5H2.38l-.788 4.538L13.929 8Z"/></svg>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
