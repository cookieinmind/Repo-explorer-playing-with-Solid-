import { Route, Routes, useRouteData } from 'solid-app-router';
import { Component, createEffect, createSignal } from 'solid-js';
import { Nav } from './components/Nav';
import HomePage from './pages/Home';
import SavedReposPage from './pages/SavedRepos';

function GetUsernameLink(username: string) {
  return `https://api.github.com/users/${username}/repos?sort=created`;
}

export type Repo = {
  node_id: string;
  full_name: string;
  name: string;
  private: boolean;
  html_url: string;
  description: string;
  language: string;
  open_issues: number;
  stargazers_count: number;
  watchers: number;
  created_at: string;
  owner: {
    avatar_url: string;
  };
};

export const [username, setUsername] = createSignal<string>('airbnb');
export const [repos, setRepos] = createSignal<Repo[]>([]);
export const [loadingRepos, setLoadingRepos] = createSignal(false);
export const [error, setError] = createSignal<string>();

const App: Component = () => {
  createEffect(async () => {
    const u = username();
    if (!u) return;
    setLoadingRepos(true);
    try {
      const res = await fetch(GetUsernameLink(u));
      const data = await res.json();
      setRepos(data);
      setLoadingRepos(false);
      setError('');
    } catch (error) {
      setError(`There has been an error fetching the repos for ${username()}`);
      setLoadingRepos(false);
    }
  });

  createEffect(() => console.log(repos()));

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/saved-repos" element={<SavedReposPage />} />
      </Routes>
    </div>
  );
};

export default App;
