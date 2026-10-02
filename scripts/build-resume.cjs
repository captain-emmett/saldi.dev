// Generate the static homepage. GitHub Pages serves the committed result directly.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'resume-data.json'), 'utf8'));
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const counts = Object.fromEntries(Object.keys(data.skills).map(key => [key, 0]));
const ids = new Set();
for (const entry of data.entries) {
  if (ids.has(entry.id)) throw new Error(`Duplicate entry: ${entry.id}`);
  ids.add(entry.id);
  if (!data.sections.some(section => section.id === entry.section)) throw new Error(`Unknown section: ${entry.section}`);
  if (!entry.skills.length || new Set(entry.skills).size !== entry.skills.length) throw new Error(`Invalid tags: ${entry.id}`);
  for (const key of entry.skills) {
    if (!data.skills[key]) throw new Error(`Unknown skill: ${key}`);
    counts[key]++;
  }
}
const tags = entry => `<div class="entry-skills" aria-label="Skills used">${entry.skills.map(key => `<a class="skill-tag" data-skill="${escape(key)}" href="?skill=${encodeURIComponent(key)}#skills">${escape(data.skills[key].label)}</a>`).join('')}</div>`;
const entryHTML = (entry, index) => {
  const project = entry.section === 'work';
  return `<article id="${escape(entry.id)}" class="resume-entry ${project ? 'project' : 'resume-row'}${entry.featured ? ' featured' : ''}${entry.compact ? ' side-project' : ''}" data-skills="${entry.skills.map(escape).join(' ')}">
    ${project ? `<span class="project-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>` : `<div class="entry-date">${escape(entry.period || 'Student involvement')}</div>`}
    <div class="project-main">
      <div class="project-heading"><h3>${escape(entry.title)}</h3>${entry.label ? `<span class="tag">${escape(entry.label)}</span>` : ''}</div>
      ${entry.detail || (project && entry.period) ? `<div class="entry-detail">${escape([project && entry.period, entry.detail].filter(Boolean).join(' / '))}</div>` : ''}
      <p>${escape(entry.summary)}</p>
      ${tags(entry)}
    </div>
    ${entry.href ? `<div class="project-links"><a href="${escape(entry.href)}">${escape(entry.linkLabel)}</a>${entry.linkNote ? `<span class="project-note">${escape(entry.linkNote)}</span>` : ''}</div>` : ''}
  </article>`;
};
const groups = [...new Set(Object.values(data.skills).map(skill => skill.group))];
const skillHTML = groups.map(group => `<div class="skill-group"><h3>${escape(group)}</h3><div class="skill-options" role="group" aria-label="${escape(group)}">${Object.entries(data.skills).filter(([key, skill]) => skill.group === group && counts[key]).map(([key, skill]) => `<button type="button" class="skill-filter" data-filter="${escape(key)}" aria-pressed="false">${escape(skill.label)}<span class="skill-count" aria-hidden="true">${counts[key]}</span><span class="sr-only">, ${counts[key]} ${counts[key] === 1 ? 'entry' : 'entries'}</span></button>`).join('')}</div></div>`).join('\n');
const sectionsHTML = data.sections.map(section => {
  const entries = data.entries.filter(entry => entry.section === section.id);
  if (!entries.length) return '';
  return `<section class="resume-section" id="${escape(section.id)}" data-resume-section aria-labelledby="${escape(section.id)}-title">
    <div class="section-heading"><h2 id="${escape(section.id)}-title">${escape(section.title)} <span class="section-count">${entries.length}</span></h2><span class="eyebrow">${escape(section.caption)}</span></div>
    ${entries.map(entryHTML).join('\n')}
  </section>`;
}).join('\n');
const template = fs.readFileSync(path.join(__dirname, 'resume-template.html'), 'utf8');
const output = template.replace('<!-- SKILL_FILTERS -->', skillHTML).replace('<!-- RESUME_SECTIONS -->', sectionsHTML).replaceAll('{{ENTRY_COUNT}}', String(data.entries.length)).replaceAll('{{SKILL_COUNT}}', String(Object.values(counts).filter(Boolean).length)).replace(/[\t ]+$/gm, '');
const destination = path.join(root, 'index.html');
if (process.argv.includes('--check')) {
  if (fs.readFileSync(destination, 'utf8').replace(/\r\n/g, '\n') !== output.replace(/\r\n/g, '\n')) throw new Error('Run node scripts/build-resume.cjs to update index.html');
  console.log(`Homepage is current: ${data.entries.length} entries, ${Object.values(counts).filter(Boolean).length} skills.`);
} else {
  fs.writeFileSync(destination, output);
  console.log(`Built index.html: ${data.entries.length} entries.`);
}
