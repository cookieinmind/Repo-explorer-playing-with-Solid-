import { createEffect, createSignal } from 'solid-js';

export function useScrollDirection(
  behavior?: {
    whenMovingUp: (scrollPosition: number) => void;
    whenMovingDown: (scrollPosition: number) => void;
  },
  minPosition = 0
) {
  const [lastPosition, setLastPosition] = createSignal<number>(0);
  const [newPosition, setNewPosition] = createSignal<number>(0);

  const [isScrollingDown, setScrollingDown] = createSignal(true);

  createEffect(() => {
    const scrollable = window;
    const handleScroll = () => {
      setNewPosition(window.pageYOffset);

      if (newPosition() > minPosition) {
        if (newPosition() >= lastPosition()) {
          behavior?.whenMovingDown(newPosition());
          setScrollingDown(true);
        } else {
          behavior?.whenMovingUp(newPosition());
          setScrollingDown(false);
        }
        setLastPosition(newPosition());
      }
    };

    scrollable.addEventListener('scroll', handleScroll);

    return () => {
      scrollable.removeEventListener('scroll', handleScroll);
    };
  });

  return { newPosition, isScrollingDown };
}

export function useScrollPosition(
  minPosition = 0,
  behavior: { whenBelow: () => void; whenAbove: () => void }
) {
  const [currPosition, setCurrPos] = createSignal<number>();

  createEffect(() => {
    const handleScroll = () => {
      setCurrPos(window.scrollY);
      if ((currPosition() ?? 0) >= (minPosition ?? 0)) {
        behavior.whenBelow && behavior.whenBelow();
      } else behavior.whenAbove && behavior.whenAbove();
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  return currPosition;
}
