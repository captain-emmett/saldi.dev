# saldi.dev

A first-draft personal portfolio for Emmett Saldivar. Static HTML, CSS, and JavaScript; no build step. Project pages self-host a pinned model-viewer bundle for interactive 3D previews.

## Projects

- Fantasy Draft Command Center — playable at `/fantasy-draft/`, copied from the existing public `captain-emmett/fantasy-draft-2026` project at commit `e20a0932233d3a2a0e9cef93d832d02f0acc5714`.
- One-Button Arcade — `/projects/one-button-arcade/`, with an interactive 3D preview and source link.
- Pi Constellation Mapper — `/projects/pi-constellation-mapper/`, with an interactive 3D preview; labeled as an early concept, matching its current README.
- Brass & Barley — a brief description of the personal Minecraft build. No private project files are included.

## Hosting

GitHub Pages serves `main` from the repository root. The custom domain is `saldi.dev`.

Edit `index.html` for content and `portfolio.css` for styling. Push to `main` to publish.

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
