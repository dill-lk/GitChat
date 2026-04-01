import React, { useState } from 'react';
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const provider = new GithubAuthProvider();
      provider.addScope('read:user');
      provider.addScope('repo');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Get GitHub access token for API calls
      const credential = GithubAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken || '';
      
      // Get additional GitHub profile data
      // @ts-ignore
      const githubData = result._tokenResponse?.rawUserInfo ? JSON.parse(result._tokenResponse.rawUserInfo) : {};
      
      // Fetch user's repositories from GitHub API
      let repos: any[] = [];
      if (accessToken && githubData.login) {
        try {
          const reposResponse = await fetch(`https://api.github.com/users/${githubData.login}/repos?sort=updated&per_page=6`, {
            headers: { Authorization: `token ${accessToken}` }
          });
          if (reposResponse.ok) {
            const reposData = await reposResponse.json();
            repos = reposData.map((repo: any) => ({
              name: repo.name,
              description: repo.description || '',
              language: repo.language || '',
              stars: repo.stargazers_count || 0,
              forks: repo.forks_count || 0,
              url: repo.html_url,
              isPrivate: repo.private,
              updatedAt: repo.updated_at
            }));
          }
        } catch (e) {
          console.error('Error fetching repos:', e);
        }
      }
      
      // Save or update user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        login: githubData.login || user.displayName?.replace(/\s+/g, '').toLowerCase() || 'user',
        name: user.displayName || githubData.name || '',
        avatarUrl: user.photoURL || githubData.avatar_url || '',
        bio: githubData.bio || '',
        company: githubData.company || '',
        location: githubData.location || '',
        blog: githubData.blog || '',
        followers: githubData.followers || 0,
        following: githubData.following || 0,
        publicRepos: githubData.public_repos || 0,
        publicGists: githubData.public_gists || 0,
        twitterUsername: githubData.twitter_username || '',
        hireable: githubData.hireable || false,
        repos: repos,
        githubUrl: githubData.html_url || `https://github.com/${githubData.login}`,
        updatedAt: serverTimestamp(),
        createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : serverTimestamp()
      }, { merge: true });

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in with GitHub');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-default flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8">
        <svg height="48" viewBox="0 0 16 16" width="48" className="fill-fg-default">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
        </svg>
      </div>
      <div className="w-full max-w-[340px] bg-canvas-subtle border border-border-default rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-light text-center text-fg-default mb-2 tracking-tight">Sign in to GitChat</h1>
        <p className="text-center text-fg-muted text-sm mb-6">The missing DM for GitHub developers</p>
        
        {error && (
          <div className="mb-4 p-3 bg-danger-fg/10 border border-danger-fg/20 rounded-md text-danger-fg text-sm">
            {error}
          </div>
        )}
        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-success-emphasis hover:bg-[#2ea043] text-white font-medium py-2.5 px-4 rounded-md border border-white/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
        >
          <svg height="20" viewBox="0 0 16 16" width="20" fill="currentColor">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
          </svg>
          {loading ? 'Connecting to GitHub...' : 'Continue with GitHub'}
        </button>
        <div className="mt-4 p-3 bg-canvas-default rounded-md border border-border-muted">
          <p className="text-xs text-fg-muted text-center">
            🔒 We'll sync your GitHub profile, repos & activity
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-fg-muted">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
