import { Component } from 'solid-js';
import { repos, username } from '../App';

const SavedReposPage: Component = () => {
  return (
    <div>
      <h1>
        Repos of @{username()} ({repos().length})
      </h1>

      <ol class="space-y-4 pl-8 list-decimal">
        {repos().map((repo) => (
          <li>{JSON.stringify(repo, null, 2)}</li>
        ))}
      </ol>
    </div>
  );
};

export default SavedReposPage;
