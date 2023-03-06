import { NavLink } from 'solid-app-router';
import { createSignal } from 'solid-js';
import { useScrollDirection, useScrollPosition } from '../scrollDir';

export function Nav() {
  const [goingDown, setGoingDown] = createSignal(false);

  useScrollPosition(100, {
    whenAbove: () => setGoingDown(false),
    whenBelow: () => setGoingDown(true),
  });

  return (
    <nav
      class={`flex gap-6 text-sm font-medium sticky top-0 p-4 bg-black w-full ${
        goingDown() ? 'border-b border-b-gray-700' : ''
      }`}
    >
      <NavLink
        activeClass="text-green-500"
        class={`hover:text-green-500`}
        href="/"
        end
      >
        Home
      </NavLink>
      <NavLink
        activeClass="text-green-500"
        class={`hover:text-green-500`}
        href="/saved-repos"
      >
        Saved repos
      </NavLink>
    </nav>
  );
}
