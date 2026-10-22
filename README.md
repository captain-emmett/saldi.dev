# saldi.dev

An education-first résumé for Emmett Saldivar, a Computer & Electrical Engineering student seeking an internship. Static HTML, CSS, and JavaScript, served directly by GitHub Pages. A separate project notebook holds longer descriptions and development notes. Hardware project pages self-host a pinned model-viewer bundle for interactive 3D previews.

## Résumé content and skills

Edit `resume-data.json` to add or update projects, experience, involvement, education, and their skill tags. Each entry uses skill IDs from the `skills` dictionary. Add only skills supported by the activity. Then run:

```sh
node scripts/build-resume.cjs
node scripts/build-resume.cjs --check
```

Commit the generated `index.html` and `projects/index.html` alongside the data changes. The generator uses only built-in Node modules; GitHub Pages needs no build configuration or runtime dependencies. `scripts/resume-template.html` controls the homepage structure; `resume.css` contains its styles. `scripts/project-index-template.html` and `project-index.css` control the project notebook. Entries use `summary` for the short résumé description and optional `overview` for the longer notebook description.

The homepage reads Education → Experience → Involvement → Projects. An optional, initially collapsed skill browser follows the résumé. `resume.js` filters all sections by one selected skill. Counts represent entries, not proficiency levels. Skill tags share the same filter, and `?skill=teamwork#skills` is a shareable view. The filter's résumé link returns to the matching entries. Show all, browser Back/Forward, and section navigation restore the expected view. All résumé entries remain readable without JavaScript.

Every portfolio page uses Résumé, Projects, and Contact navigation. Résumé opens the homepage, Projects opens the notebook, and Contact opens the homepage's `#contact` section. Shared header layout and plain title typography live in `portfolio.css`, including the consistent mobile header below 620px.

The selected Clean Technical design is applied by `theme.css`, loaded after the base and page-specific styles. It uses the same layout in light and dark modes. `theme.js` runs in the head before styles to apply the saved `saldi-color-theme` choice without a flash of the wrong theme. On the first visit it follows the system color preference; the header's Dark mode toggle saves an explicit choice across pages and visits. Other open tabs update with that choice. If storage is unavailable, the toggle still works for the current visit. Without JavaScript, CSS follows the system preference and the toggle stays hidden. Education uses the same padding and type scale as every other résumé entry.

Education, work dates, and updated hardware descriptions come from the supplied résumé. TORCH's student tutor role and WWU Racing's low-voltage/electronics role were supplied directly. The racing description links to WWU's official club listing. The earlier summer apprenticeship remains a short placeholder until program details are available; no dates or responsibilities have been assumed.

## Projects

- `/projects/` — the full project notebook, linking to a separate overview for each project.
- Fantasy Draft Command Center — overview at `/projects/fantasy-draft/`, playable at `/fantasy-draft/`, copied from the existing public `captain-emmett/fantasy-draft-2026` project at commit `e20a0932233d3a2a0e9cef93d832d02f0acc5714`.
- One-Button Arcade — `/projects/one-button-arcade/`, with an interactive 3D preview, documented hardware list, and dated GitHub development log.
- Pi Constellation Mapper — `/projects/pi-constellation-mapper/`, with an interactive 3D preview, hardware selections and open decisions, and GitHub development log.
- C/C++ Programming — `/projects/c-cpp-programming/`, covering coursework in data structures, object-oriented programming, memory, and persistent storage.
- Brass & Barley — `/projects/brass-and-barley/`, covering the personal Minecraft build and its development notes. No private project files are included.

Hardware lists distinguish confirmed selections from unrecorded specifications and open decisions. Development logs link to actual repository commits or prototype work. No build photos were present in the supplied sources; add real photos with descriptive alt text and captions to the relevant log entries when available. Do not substitute generated images or placeholder models for build evidence. Contact links include the supplied LinkedIn profile without share-tracking parameters.

## Hosting

GitHub Pages serves `main` from the repository root. The custom domain is `saldi.dev`.

Generate the homepage and project index after changing résumé data. Edit individual project pages directly for their content; `portfolio.css` supplies shared base styles and `project.css` supplies project-page styles. Push to `main` to publish.

## Interactive project models

Both project pages use a real GLB placeholder cube in `assets/models/placeholder-cube.glb`. The shared viewer supports mouse/touch rotation, scroll/pinch zoom, arrow-key rotation, and a reset button. It stays still until interacted with.

To add a project's final model:

1. Export the model as a self-contained `.glb` (glTF 2.0) with embedded materials/textures.
2. Put it in `assets/models/`, using a separate filename per project.
3. Update that project's `<model-viewer src="…">` in its `index.html`. Update the alt text, placeholder label, and note at the same time.

Camera framing adjusts to the model. Start with uncompressed GLB exports; optional geometry/texture compression may require additional decoder assets. Keep models reasonably small for mobile visitors.

`project.css` and `project-viewer.js` are shared by both pages. Google model-viewer 4.3.1 is vendored in `assets/vendor/` with its Apache 2.0 license; the current viewer and cube load entirely from this site. `scripts/create-placeholder.cjs` regenerates the original cube.

## Draft-app migration

The previous homepage was the fantasy app and registered a cache-first service worker at `/service-worker.js`. The replacement worker retires that registration and refreshes homepage clients so returning visitors can see the portfolio. It does not remove browser storage or saved drafts. The app at `/fantasy-draft/` uses the same origin and localStorage keys, with its own scoped offline cache.

Keep the root `service-worker.js` available for returning visitors. The original fantasy repository remains intact apart from transferring its custom-domain configuration to this repository.
