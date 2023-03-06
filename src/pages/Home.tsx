import { Component, createEffect, createSignal } from 'solid-js';
import {
  error,
  loadingRepos,
  Repo,
  repos,
  setUsername,
  username,
} from '../App';
import { useScrollPosition } from '../scrollDir';

const [avatar_url, setAvatarUrl] = createSignal('');

const HomePage: Component = () => {
  function handleSubmit(e: Event) {
    e.preventDefault();
    const input = document.querySelector('#usernameInput') as HTMLInputElement;
    setUsername(input.value);
  }

  createEffect(() => {
    const avatarUrl = repos().find((repo) => repo.owner.avatar_url)?.owner
      .avatar_url;

    if (avatarUrl) setAvatarUrl(avatarUrl);
    else setAvatarUrl('');
  });

  return (
    <div class="space-y-4 mb-8">
      <Header handleSubmit={handleSubmit} />

      {!!error() && (
        <div class="bg-red-300 text-red-600 p-4 rounded-sm">
          <h4>There has been an error</h4>
          <p>{error()}</p>
        </div>
      )}

      {loadingRepos() ? (
        <p class="p-4 text-sm animate-pulse">Loading...</p>
      ) : (
        <ol class="space-y-6 pl-12 list-decimal marker:text-gray-600">
          {repos().map((repo) => (
            <RepoCard repo={repo} />
          ))}
        </ol>
      )}
    </div>
  );
};

export default HomePage;

const RepoCard: Component<{ repo: Repo }> = ({ repo }) => {
  return (
    <li class="space-y-2">
      <div>
        <div class="flex items-center gap-4">
          <a href={repo.html_url} target="_blank" class="hover:text-green-500">
            <h3>{repo.name}</h3>
          </a>
          <div class="text-xs text-gray-600 uppercase flex gap-4">
            <span>{repo.language}</span>
            <span>
              created {GetDateInString(new Date(repo.created_at))} ago
            </span>
          </div>
        </div>
        <p class="text-gray-400 whitespace-pre-wrap max-w-xl">
          {repo.description}
        </p>
      </div>

      <div class="text-xs text-green-800 uppercase flex gap-4">
        <span>{repo.open_issues} issues</span>
        <span>{repo.watchers} watchers</span>
        <span>{repo.stargazers_count} stars</span>
      </div>
    </li>
  );
};

function GetDateInString(date: Date, forceDays = false) {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const today = new Date();

  const diff = Math.abs(today.getTime() - date.getTime());

  const minutes = 1000 * 60;
  const hours = minutes * 60;
  const days = hours * 24;
  const diffOfMinutes = diff / minutes;
  const diffOfHours = diff / hours;
  const diffOfDays = diff / (hours * 24);
  const diffOfWeeks = diff / (days * 7);
  const diffOfMonnths = diff / (days * 31);
  const diffOfYears = diff / (days * 365);

  if (forceDays) {
    const x = Math.round(diffOfDays);
    return x.toString() + (x === 1 ? ' day' : ' days');
  }

  let dataLabel = '';
  if (diffOfYears >= 1) {
    const x = Math.round(diffOfYears);
    dataLabel = `${x}+ ${x === 1 ? ' year' : ' years'}`;
  } else if (diffOfMonnths >= 1) {
    const x = Math.round(diffOfMonnths);
    dataLabel = `${x}+ ${x === 1 ? ' month' : ' months'}`;
  } else if (diffOfWeeks >= 2) {
    const x = Math.round(diffOfWeeks);
    dataLabel = `${x}+ ${x === 1 ? ' week' : ' weeks'}`;
  } else if (diffOfDays >= 1) {
    const x = Math.round(diffOfDays);
    dataLabel = `${x}+ ${x === 1 ? ' day' : ' days'}`;
  } else if (diffOfHours >= 1) {
    const x = Math.round(diffOfHours);
    dataLabel = `${x}+ ${x === 1 ? ' hour' : ' hours'}`;
  } else if (diffOfMinutes >= 1) {
    const x = Math.round(diffOfMinutes);
    dataLabel = `${x}+ ${x === 1 ? ' minute' : ' minutes'}`;
  } else {
    dataLabel = 'a few seconds';
  }

  return dataLabel;
}

function Header({ handleSubmit }: { handleSubmit: (e: Event) => void }) {
  const [goingDown, setGoingDown] = createSignal(false);

  useScrollPosition(40, {
    whenAbove: () => setGoingDown(false),
    whenBelow: () => setGoingDown(true),
  });

  return (
    <header
      class={`text-sm font-medium sticky top-0 space-y-4 p-4 pb-6 bg-black w-full ${
        goingDown() ? 'border-b border-b-gray-700' : ''
      }`}
    >
      <div class="flex w-full items-center justify-between">
        <form onSubmit={(e) => handleSubmit(e)} class="flex gap-4 items-center">
          <input
            id="usernameInput"
            type="text"
            placeholder="Search for a Github username"
            class="bg-transparent border-b border-0 focus:border-green-500 focus:ring-0 min-w-[30rem]"
            value={username()}
          />
          <button class="grid text-sm place-items-center bg-green-600 text-white py-1.5 px-4 rounded font-medium hover:bg-green-700">
            Fetch
          </button>
        </form>

        {loadingRepos() ? (
          <div class="h-[4rem] w-[4rem] animate-pulse bg-gray-900 rounded"></div>
        ) : (
          <a href={`https://github.com/${username()}`} target="_blank">
            <figure class="aspect-square w-[4rem] h-[4rem] rounded overflow-hidden border border-black hover:border-green-500">
              <img src={avatar_url()} class="object-fit" />
            </figure>
          </a>
        )}
      </div>

      <h1>
        Repos of{' '}
        <a
          href={`https://github.com/${username()}`}
          target="_blank"
          class="hover:text-green-500 underline"
        >
          @{username()}
        </a>{' '}
        <span class="text-gray-500"> ({repos().length})</span>
      </h1>
    </header>
  );
}
