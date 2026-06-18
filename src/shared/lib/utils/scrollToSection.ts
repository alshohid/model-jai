export const scrollToSection = (
  id: string,
  options?: ScrollIntoViewOptions,
) => {
  if (typeof window === "undefined") return;

  const element = document.getElementById(id);

  if (!element) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
    ...options,
  });
};
