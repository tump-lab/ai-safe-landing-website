'use strict';
(() => {
  const themes = {research: 'Research', care: 'Care', human: 'Human', clarity: 'Clarity'};
  const colors = {research: '#122333', care: '#183b32', human: '#f5ede1', clarity: '#eaf4f4'};
  const valid = value => Object.hasOwn(themes, value);
  const key = 'ai-safe-landing-theme';
  let saved;
  try {saved = localStorage.getItem(key);} catch (_) { /* Preference storage is optional. */ }
  const requested = new URLSearchParams(location.search).get('theme');
  let active = valid(requested) ? requested : valid(saved) ? saved : 'research';
  function apply(value) {
    active = value;
    document.documentElement.dataset.theme = value;
    const favicon = document.querySelector('#site-favicon');
    if (favicon) favicon.href = favicon.dataset.base + value + '.svg';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors[value]);
    try {localStorage.setItem(key, value);} catch (_) { /* Keep this page usable if storage is blocked. */ }
  }
  apply(active);
  document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.theme-switcher');
    if (!wrapper) return;
    const toggle = document.querySelector('#theme-toggle');
    const panel = document.querySelector('#theme-panel');
    const options = [...panel.querySelectorAll('[data-theme-option]')];
    const feedback = document.querySelector('#theme-feedback');
    function update() {
      options.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeOption === active)));
      toggle.setAttribute('aria-label', `Change color theme, current: ${themes[active]}`);
      document.querySelector('#theme-selection').textContent = `${themes[active]} selected`;
    }
    function close(restoreFocus = false) {
      panel.hidden = true;toggle.setAttribute('aria-expanded', 'false');
      if (restoreFocus) toggle.focus();
    }
    toggle.addEventListener('click', () => {
      const opening = panel.hidden;
      panel.hidden = !opening;toggle.setAttribute('aria-expanded', String(opening));feedback.textContent = '';
      if (opening) {
        // Keep navigation and theme controls from covering one another on narrow screens.
        if (typeof closeNavigation === 'function') closeNavigation();
        options.find(button => button.dataset.themeOption === active).focus();
      }
    });
    options.forEach(button => button.addEventListener('click', () => {
      apply(button.dataset.themeOption);update();
      const url = new URL(location.href);url.searchParams.set('theme', active);
      try {history.replaceState(null, '', url);} catch (_) { /* Also supports local file previews. */ }
      feedback.textContent = `${themes[active]} applied.`;
      document.dispatchEvent(new CustomEvent('asl:themechange'));
    }));
    panel.addEventListener('keydown', event => {
      const index = options.indexOf(document.activeElement);
      if (index < 0 || !['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options[next].focus();
    });
    document.addEventListener('keydown', event => {if (event.key === 'Escape' && !panel.hidden) {event.preventDefault();close(true);}});
    document.addEventListener('click', event => {if (!wrapper.contains(event.target)) close();});
    document.addEventListener('focusin', event => {if (!wrapper.contains(event.target)) close();});
    document.querySelector('#copy-theme-link').addEventListener('click', async () => {
      const url = new URL(location.href);url.searchParams.set('theme', active);
      try {await navigator.clipboard.writeText(url.href);feedback.textContent = `${themes[active]} link copied.`;}
      catch (_) {feedback.textContent = 'Copy the page address to share this theme.';}
    });
    update();
  });
})();
