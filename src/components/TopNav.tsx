import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export const TopNav = ({ user }: { user: any }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="h-12 bg-canvas-subtle border-b border-border-default flex items-center px-4 gap-4 fixed top-0 left-0 right-0 z-50">
      <div className="text-fg-default flex items-center">
        <svg height="32" viewBox="0 0 16 16" width="32" aria-label="GitHub" className="fill-current">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
        </svg>
      </div>

      <div className="flex-1 max-w-[280px] bg-canvas-default border border-border-default rounded-md px-3 py-1.5 text-fg-muted text-[13px] flex items-center gap-2 cursor-pointer hover:border-accent-fg transition-colors">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/></svg>
        Type / to search
        <span className="text-fg-subtle text-[11px] ml-auto border border-border-default px-1.5 py-[1px] rounded font-mono">/</span>
      </div>

      <div className="flex items-center gap-1 ml-2">
        <a href="#" className="text-accent-fg no-underline text-sm font-medium px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors">GitChat</a>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="bg-transparent border border-border-default text-fg-muted rounded-md p-1.5 cursor-pointer flex items-center justify-center relative hover:bg-white/5 hover:text-fg-default transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16ZM8 1.5A3.5 3.5 0 0 0 4.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.018.018 0 0 0-.003.01l.001.006c0 .002.002.004.004.006l.006.004.007.001h10.964l.007-.001.006-.004.004-.006.001-.007a.017.017 0 0 0-.003-.01l-1.703-2.554a1.75 1.75 0 0 1-.294-.97V5A3.5 3.5 0 0 0 8 1.5ZM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.518 1.518 0 0 1 13.482 13H2.518a1.518 1.518 0 0 1-1.263-2.36l1.703-2.554A.25.25 0 0 0 3 7.947Z"/></svg>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-emphasis rounded-full border-2 border-canvas-subtle"></div>
        </button>
        <button className="bg-transparent border border-border-default text-fg-muted rounded-md p-1.5 cursor-pointer flex items-center justify-center hover:bg-white/5 hover:text-fg-default transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"/></svg>
        </button>
        <div className="w-7 h-7 rounded-full border-2 border-border-default cursor-pointer overflow-hidden flex items-center justify-center bg-[#21262d] text-[11px] font-semibold text-fg-default" title={user.login}>
          <img src={user.avatarUrl || user.avatar_url} alt={user.login} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <button 
          onClick={handleSignOut}
          className="bg-transparent border-none text-fg-muted cursor-pointer text-xs hover:text-danger-fg transition-colors ml-2 font-medium"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
};
