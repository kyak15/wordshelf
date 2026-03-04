const THEME_STORAGE_KEY = "@wordshelf_theme";

/**
 * Inline script that runs before first paint to set data-theme on <html>.
 * Prevents flash of wrong theme when user has a saved preference or system dark mode.
 */
const script = `
(function() {
  var pref = localStorage.getItem("${THEME_STORAGE_KEY}");
  var scheme = "light";
  if (pref === "dark") scheme = "dark";
  else if (pref === "light") scheme = "light";
  else scheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", scheme);
})();
`;

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
