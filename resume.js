(() => {
  const controls = document.querySelector('#skill-controls');
  if (!controls) return;
  const entries = [...document.querySelectorAll('.resume-entry')];
  const sections = [...document.querySelectorAll('[data-resume-section]')];
  const buttons = [...controls.querySelectorAll('[data-filter]')];
  const filters = new Map(buttons.filter(button => button.dataset.filter).map(button => [button.dataset.filter, button]));
  const status = document.querySelector('#filter-status');
  const panel = document.querySelector('#skills');
  const skillList = document.querySelector('#skill-list');
  const mobile = matchMedia('(max-width: 760px)');
  let active = '';

  function applyFilter(key, { push = false, focus = false } = {}) {
    active = filters.has(key) ? key : '';
    let count = 0;
    for (const entry of entries) {
      entry.hidden = Boolean(active) && !entry.dataset.skills.split(' ').includes(active);
      if (!entry.hidden) count++;
    }
    for (const section of sections) {
      const visible = [...section.querySelectorAll('.resume-entry')].filter(entry => !entry.hidden).length;
      section.hidden = visible === 0;
      section.querySelector('.section-count').textContent = visible;
    }
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.filter === active));
    for (const tag of document.querySelectorAll('.skill-tag')) tag.classList.toggle('is-active', tag.dataset.skill === active);
    const label = active ? filters.get(active).firstChild.textContent.trim() : '';
    status.textContent = active ? `${count} ${count === 1 ? 'entry' : 'entries'} using ${label}.` : `Showing all ${entries.length} entries.`;
    if (push) {
      const url = new URL(location.href);
      if (active) url.searchParams.set('skill', active);
      else url.searchParams.delete('skill');
      url.hash = 'skills';
      if (url.href !== location.href) history.pushState(null, '', url);
    }
    if (focus) {
      skillList.open = true;
      (filters.get(active) || buttons.find(button => !button.dataset.filter)).focus({ preventScroll: true });
      panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    }
  }

  controls.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (button) applyFilter(button.dataset.filter === active ? '' : button.dataset.filter, { push: true });
  });
  document.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const tag = event.target.closest('a.skill-tag');
    if (tag) {
      event.preventDefault();
      applyFilter(tag.dataset.skill, { push: true, focus: true });
      return;
    }
    const link = event.target.closest('a[href^="#"]');
    const target = link && document.getElementById(link.hash.slice(1));
    if (target?.matches('[data-resume-section]') && active) {
      event.preventDefault();
      applyFilter('');
      const url = new URL(location.href);
      url.searchParams.delete('skill');
      url.hash = target.id;
      history.pushState(null, '', url);
      const heading = target.querySelector('h2');
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      target.scrollIntoView();
    }
  });
  window.addEventListener('popstate', () => {
    applyFilter(new URLSearchParams(location.search).get('skill'));
    if (active) skillList.open = true;
  });
  mobile.addEventListener('change', () => { skillList.open = !mobile.matches || Boolean(active); });
  controls.hidden = false;
  applyFilter(new URLSearchParams(location.search).get('skill'));
  skillList.open = !mobile.matches || Boolean(active);
})();
