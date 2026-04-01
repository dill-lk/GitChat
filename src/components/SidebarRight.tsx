import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const SidebarRight = ({ activeChatUserId }: { activeChatUserId: string }) => {
  const [activeUser, setActiveUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeChatUserId) {
      setActiveUser(null);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', activeChatUserId));
        if (userDoc.exists()) {
          setActiveUser(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching active user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [activeChatUserId]);

  if (loading || !activeUser) {
    return (
      <aside className="w-[296px] min-w-[296px] bg-canvas-default border-l border-border-default overflow-y-auto flex items-center justify-center text-fg-muted">
        {loading ? 'Loading profile...' : 'Select a chat'}
      </aside>
    );
  }

  return (
    <aside className="w-[296px] min-w-[296px] bg-canvas-default border-l border-border-default overflow-y-auto">
      <div className="p-5 border-b border-border-muted">
        <div className="relative inline-block mb-3">
          <div className="w-[72px] h-[72px] rounded-full border-[3px] border-white/10 bg-[#21262d] flex items-center justify-center text-2xl font-semibold overflow-hidden">
            {(activeUser.avatarUrl || activeUser.avatar_url) ? (
              <img src={activeUser.avatarUrl || activeUser.avatar_url} alt={activeUser.login} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              activeUser.login?.substring(0, 2).toUpperCase() || 'U'
            )}
          </div>
          <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-success-fg rounded-full border-[3px] border-canvas-default"></div>
        </div>
        <div className="text-xl font-light text-fg-muted mb-2">{activeUser.login}</div>
        <div className="text-base font-semibold text-fg-default">{activeUser.name || activeUser.login}</div>
        
        <div className="text-[13px] text-fg-default leading-relaxed mt-2.5 mb-3">
          {activeUser.bio || 'No bio provided.'}
        </div>
        
        <div className="flex gap-3 text-xs text-fg-muted">
          <div className="flex items-center gap-1 cursor-pointer hover:text-accent-fg">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"/></svg>
            <strong className="text-fg-default font-semibold">{activeUser.followers || 0}</strong> followers
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-accent-fg">
            <strong className="text-fg-default font-semibold">{activeUser.following || 0}</strong> following
          </div>
        </div>
      </div>

      <div className="p-4 px-5 border-b border-border-muted">
        <div className="text-[11px] font-semibold uppercase text-fg-subtle tracking-wider mb-3 flex items-center justify-between">About</div>
        {activeUser.company && (
          <div className="text-[13px] text-fg-muted flex items-center gap-2 mb-1.5">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-fg-subtle flex-shrink-0"><path d="M1.75 0h8.5C11.216 0 12 .784 12 1.75v5a.75.75 0 0 1-1.5 0v-5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 0 9.25v-7.5C0 .784.784 0 1.75 0Z"/><path d="M5 12.25v-2.5A.75.75 0 0 1 5.75 9h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75Zm.75-1.75v1h1v-1Z"/><path d="M6.5 4.75a.25.25 0 0 1 .25-.25h4.5a.25.25 0 0 1 0 .5h-4.5a.25.25 0 0 1-.25-.25ZM6.75 6.75a.25.25 0 0 0 0 .5h2.5a.25.25 0 0 0 0-.5Z"/></svg>
            <span className="text-fg-default">{activeUser.company}</span>
          </div>
        )}
        {activeUser.location && (
          <div className="text-[13px] text-fg-muted flex items-center gap-2 mb-1.5">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-fg-subtle flex-shrink-0"><path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/></svg>
            {activeUser.location}
          </div>
        )}
        {activeUser.blog && (
          <div className="text-[13px] text-fg-muted flex items-center gap-2 mb-1.5">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-fg-subtle flex-shrink-0"><path d="M7.775 3.275 1.25 9.8a3.5 3.5 0 1 0 4.95 4.95l6.526-6.525a2.5 2.5 0 0 0-3.536-3.535Zm1.06 4.597-5.526 5.525a2 2 0 1 1-2.83-2.829l5.525-5.526z"/></svg>
            <a href={activeUser.blog.startsWith('http') ? activeUser.blog : `https://${activeUser.blog}`} target="_blank" rel="noreferrer" className="text-accent-fg no-underline hover:underline">{activeUser.blog}</a>
          </div>
        )}
        <div className="text-[13px] text-fg-muted flex items-center gap-2 mb-1.5">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-fg-subtle flex-shrink-0"><path d="M5.596 3.333 4.25 6.5H1.75a.75.75 0 0 0-.75.75v4a.75.75 0 0 0 .75.75h12.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 0-.75-.75H11.75L10.404 3.333a1 1 0 0 0-.929-.583H6.525a1 1 0 0 0-.929.583ZM2.5 11.5V8h11v3.5Zm9.5-4H4v-.5l1.25-3h5.5l1.25 3z"/></svg>
          Joined GitHub {new Date(activeUser.createdAt?.toDate ? activeUser.createdAt.toDate() : Date.now()).getFullYear()}
        </div>
      </div>
    </aside>
  );
};
