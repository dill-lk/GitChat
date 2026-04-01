import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

export const SidebarRight = ({ activeChatUserId }: { activeChatUserId: string }) => {
  const [activeUser, setActiveUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'repos'>('profile');

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
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-fg"></div>
            <span className="text-sm">Loading profile...</span>
          </div>
        ) : 'Select a chat'}
      </aside>
    );
  }

  const repos = activeUser.repos || [];

  return (
    <aside className="w-[296px] min-w-[296px] bg-canvas-default border-l border-border-default overflow-y-auto">
      {/* Profile Header */}
      <div className="p-5 border-b border-border-muted">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-[64px] h-[64px] rounded-full border-[3px] border-white/10 bg-[#21262d] flex items-center justify-center text-xl font-semibold overflow-hidden">
              {(activeUser.avatarUrl || activeUser.avatar_url) ? (
                <img src={activeUser.avatarUrl || activeUser.avatar_url} alt={activeUser.login} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                activeUser.login?.substring(0, 2).toUpperCase() || 'U'
              )}
            </div>
            <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-success-fg rounded-full border-[2px] border-canvas-default online-indicator"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-fg-default truncate">{activeUser.name || activeUser.login}</div>
            <div className="text-sm text-fg-muted">@{activeUser.login}</div>
            {activeUser.hireable && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-success-emphasis/20 text-success-fg text-[10px] font-medium rounded-full">
                <span className="w-1.5 h-1.5 bg-success-fg rounded-full"></span>
                Available for hire
              </span>
            )}
          </div>
        </div>
        
        {activeUser.bio && (
          <div className="text-[13px] text-fg-default leading-relaxed mt-3">
            {activeUser.bio}
          </div>
        )}
        
        {/* Stats Row */}
        <div className="flex gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1 text-fg-muted hover:text-accent-fg cursor-pointer">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"/></svg>
            <strong className="text-fg-default font-semibold">{activeUser.followers || 0}</strong> followers
          </div>
          <div className="flex items-center gap-1 text-fg-muted hover:text-accent-fg cursor-pointer">
            <strong className="text-fg-default font-semibold">{activeUser.following || 0}</strong> following
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <a 
            href={activeUser.githubUrl || `https://github.com/${activeUser.login}`} 
            target="_blank" 
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-canvas-subtle hover:bg-white/5 border border-border-default text-fg-default text-xs font-medium py-1.5 px-3 rounded-md transition-colors no-underline"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>
            GitHub
          </a>
          {activeUser.twitterUsername && (
            <a 
              href={`https://twitter.com/${activeUser.twitterUsername}`}
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-canvas-subtle hover:bg-white/5 border border-border-default text-fg-default text-xs font-medium py-1.5 px-3 rounded-md transition-colors no-underline"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-muted">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors relative ${activeTab === 'profile' ? 'text-fg-default' : 'text-fg-muted hover:text-fg-default'}`}
        >
          About
          {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-fg"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('repos')}
          className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors relative flex items-center justify-center gap-1.5 ${activeTab === 'repos' ? 'text-fg-default' : 'text-fg-muted hover:text-fg-default'}`}
        >
          Repos
          {activeUser.publicRepos > 0 && (
            <span className="bg-canvas-subtle text-fg-muted text-[10px] px-1.5 py-0.5 rounded-full">{activeUser.publicRepos}</span>
          )}
          {activeTab === 'repos' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-fg"></div>}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' ? (
        <div className="p-4 px-5">
          {activeUser.company && (
            <div className="text-[13px] text-fg-muted flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-fg-subtle flex-shrink-0"><path d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z"/></svg>
              <span className="text-fg-default">{activeUser.company}</span>
            </div>
          )}
          {activeUser.location && (
            <div className="text-[13px] text-fg-muted flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-fg-subtle flex-shrink-0"><path d="m12.596 11.596-3.535 3.536a1.5 1.5 0 0 1-2.122 0l-3.535-3.536a6.5 6.5 0 1 1 9.192 0ZM8 14.5l3.535-3.535a5 5 0 1 0-7.07 0L8 14.5Zm0-8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"/></svg>
              {activeUser.location}
            </div>
          )}
          {activeUser.blog && (
            <div className="text-[13px] text-fg-muted flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-fg-subtle flex-shrink-0"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"/></svg>
              <a href={activeUser.blog.startsWith('http') ? activeUser.blog : `https://${activeUser.blog}`} target="_blank" rel="noreferrer" className="text-accent-fg no-underline hover:underline truncate">{activeUser.blog}</a>
            </div>
          )}
          <div className="text-[13px] text-fg-muted flex items-center gap-2 mb-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-fg-subtle flex-shrink-0"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"/></svg>
            Joined {new Date(activeUser.createdAt?.toDate ? activeUser.createdAt.toDate() : Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>

          {/* GitHub Stats */}
          <div className="mt-4 pt-4 border-t border-border-muted">
            <div className="text-[11px] font-semibold uppercase text-fg-subtle tracking-wider mb-3">GitHub Stats</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-canvas-subtle rounded-md p-3 text-center">
                <div className="text-lg font-semibold text-fg-default">{activeUser.publicRepos || 0}</div>
                <div className="text-[10px] text-fg-muted uppercase">Repositories</div>
              </div>
              <div className="bg-canvas-subtle rounded-md p-3 text-center">
                <div className="text-lg font-semibold text-fg-default">{activeUser.publicGists || 0}</div>
                <div className="text-[10px] text-fg-muted uppercase">Gists</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3">
          {repos.length > 0 ? (
            <div className="space-y-2">
              {repos.map((repo: any, index: number) => (
                <a 
                  key={index}
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-3 bg-canvas-subtle hover:bg-white/5 rounded-md border border-border-muted hover:border-border-default transition-colors no-underline group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-fg-muted flex-shrink-0">
                      {repo.isPrivate ? (
                        <path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4Zm8.25 3.5h-8.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25ZM10.5 6V4a2.5 2.5 0 1 0-5 0v2Z"/>
                      ) : (
                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>
                      )}
                    </svg>
                    <span className="text-accent-fg text-sm font-medium truncate group-hover:underline">{repo.name}</span>
                    {repo.isPrivate && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-attention-fg/20 text-attention-fg rounded-full font-medium">Private</span>
                    )}
                  </div>
                  {repo.description && (
                    <div className="text-xs text-fg-muted mb-2 line-clamp-2">{repo.description}</div>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-fg-muted">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: languageColors[repo.language] || '#8b949e' }}></span>
                        {repo.language}
                      </div>
                    )}
                    {repo.stars > 0 && (
                      <div className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
                        {repo.stars}
                      </div>
                    )}
                    {repo.forks > 0 && (
                      <div className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>
                        {repo.forks}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-fg-muted">
              <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor" className="mx-auto mb-2 opacity-50"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>
              <p className="text-sm">No repositories yet</p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
