// Apply the visitor's choice before styles load, so pages start in the right mode.
(() => {
  const key = 'saldi-color-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = readPreference();

  function readPreference() {
    try {
      const value = window.localStorage.getItem(key);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }

  function apply() {
    const mode = preference || (system.matches ? 'dark' : 'light');
    const dark = mode === 'dark';
    root.dataset.theme = mode;
    root.style.colorScheme = mode;
    const color = document.querySelector('meta[name="theme-color"]');
    if (color) color.content = dark ? '#14202e' : '#ffffff';
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
      button.setAttribute('aria-pressed', String(dark));
      button.title = `Switch to ${dark ? 'light' : 'dark'} mode`;
      button.hidden = false;
    }
  }

  function mount() {
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
      button.addEventListener('click', () => {
        preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try { window.localStorage.setItem(key, preference); } catch { /* Still works for this visit. */ }
        apply();
      });
    }
    apply();
  }

  apply();
  system.addEventListener('change', () => { if (!preference) apply(); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = readPreference();
      apply();
    }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
