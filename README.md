# saldi.dev

A first-draft personal portfolio for Emmett Saldivar. Plain HTML, CSS, and a small service-worker migration script; no build step or dependencies.

## Projects

- Fantasy Draft Command Center — playable at `/fantasy-draft/`, copied from the existing public `captain-emmett/fantasy-draft-2026` project at commit `e20a0932233d3a2a0e9cef93d832d02f0acc5714`.
- One-Button Arcade — links to the public source repository.
- Pi Constellation Mapper — labeled as an early concept, matching its current README.
- Brass & Barley — a brief description of the personal Minecraft build. No private project files are included.

## Hosting

GitHub Pages serves `main` from the repository root. The custom domain is `saldi.dev`.

Edit `index.html` for content and `portfolio.css` for styling. Push to `main` to publish.

## Draft-app migration

The previous homepage was the fantasy app and registered a cache-first service worker at `/service-worker.js`. The replacement worker retires that registration and refreshes homepage clients so returning visitors can see the portfolio. It does not remove browser storage or saved drafts. The app at `/fantasy-draft/` uses the same origin and localStorage keys, with its own scoped offline cache.

Keep the root `service-worker.js` available for returning visitors. The original fantasy repository remains intact apart from transferring its custom-domain configuration to this repository.
