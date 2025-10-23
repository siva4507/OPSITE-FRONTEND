export const scrollTabIntoView = (
  tabsContainer: HTMLDivElement,
  tabElements: NodeListOf<Element>,
  tabIndex: number,
  padding: number = 20,
) => {
  const clickedTab = tabElements[tabIndex] as HTMLElement;
  if (!clickedTab) return;

  const containerWidth = tabsContainer.clientWidth;

  const tabOffsetLeft = clickedTab.offsetLeft;
  const tabWidth = clickedTab.offsetWidth;

  const targetScrollLeft = tabOffsetLeft - containerWidth / 2 + tabWidth / 2;

  const maxScrollLeft = tabsContainer.scrollWidth - containerWidth;
  const finalScrollLeft = Math.max(
    0,
    Math.min(targetScrollLeft - padding, maxScrollLeft),
  );

  tabsContainer.scrollTo({
    left: finalScrollLeft,
    behavior: "smooth",
  });
};
