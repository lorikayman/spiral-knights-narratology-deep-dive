# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Approach

- Read existing files before writing. Don't re-read unless changed.
- Thorough in reasoning, concise in output.
- Skip files over 100KB unless required.
- No sycophantic openers or closing fluff.
- No emojis or em-dashes.
- Do not guess APIs, versions, flags, commit SHAs, or package names. Verify by reading code or docs before asserting.

## Project Type

Single long-form markdown document with a Pandoc + WeasyPrint pipeline that emits a styled PDF.

## Content

- `src/lib/burning_stars.md` is the sole source of truth (12,420 lines). Referenced by the `INPUT_MARKDOWN` taskfile variable; do not hardcode the path in new tasks.

  The document is a long-form analytical essay on the worldbuilding and lore of the game *Spiral Knights*. Structure:

  - **Preamble** (`## Motivation`, `## Method`, `## Table of Content`): states the two-step methodology -- (1) construct an in-Universe timeline from all lore hints, treated as objective truth; (2) analyse aesthetics through the interplay of medievalism and cyberpunk.
  - **Chapters I--X** (the bulk): each chapter covers one faction or era of the in-Universe timeline, building toward a unified cosmology:
    - I Cosmology -- realms (Material, Underworld, Apocrean, Blinding Abyss, Nameless, Spirit Mother's), energy, alchemy.
    - II Underworld -- Devilites, Undercorp, dark cities, graveyards, fiendish cults.
    - III Tortomega -- tortodrones, Tortomega as titan civilization, drakes, wyverns, chromalisks.
    - IV Heavenly Kingdom -- Valkyries, Owlites, heavenly kingdom castles, gun puppies, howlitzers.
    - V Spiral Order -- Isorans, Isora, Morai Wars, alchemy, auras and souls, energy mechanics.
    - VI Undercorp -- ritual circles, Grim Gates, minerals-and-souls framework, Apocrean realm, Strangers/Haven.
    - VII Kingdom of Almire -- Almire's Fall, Lord Vanaduke, Spirit Mother, three kingdoms, Legion of Ur, trojans.
    - VII-S Gunslinger Priests -- forgotten time, Valkyrian gunslingers, Fallen Valkyrian, War in Heaven.
    - VIII Kat Tribe -- Kataclysm, Owlite research, seraphynx/drakon/maskeraith battle sprites, dread seals.
    - VIII-S Metaphysics of Curse -- Shadow Lairs causality, darkfire, evil eye, Shadow Firestorm Citadel.
    - IX Gremlin Empire -- Iron Law, Clockworks megastructure, Gremlin bioengineering, slimes, Jelly kingdom.
    - IX-S Swarm -- Herex's treason, the Void, Whitespace, Sleeper, Architect's madness.
    - X Spiral Knights -- proposed complete in-Universe timeline summary.
  - **Final Chapter** (`### _Final Chapter_ Spiral of Burning Stars`): aesthetic analysis -- the three essentials (regions/magic/magitech, megastructure, medium/player perspective), trope catalogue per faction, katabasis/monomyth framework, comparisons to *Blame!*, *Made in Abyss*, *Rain World*, *White Knuckle*, *Broken Script*.
  - **Credits / Sources** at the end.

  **Style conventions in the file:**
  - In-Universe game quotes: blockquotes (`> _Source_, _Author_\n>\n> quote`) or inline with wiki links.
  - Citations: same blockquote form.
  - Section anchors follow kebab-case headings; cross-references use `[text](#anchor)`.
  - Intentional in-game typos inside backtick game-text quotes are preserved as-is.

## PDF Pipeline

The pipeline is split into discrete taskfile entries so each stage can be run, inspected, and re-run independently.

| Task | Alias | Output | Purpose |
| ---- | ----- | ------ | ------- |
| `pdf:native` | `pn` | `dist/burning_stars.native` | Pandoc native AST. Debug-only intermediate. Lua filters run. |
| `pdf:html` | `ph` | `dist/burning_stars.html` | Pandoc HTML5. Lua filters run. Template injects stylesheet `<link>` tags. |
| `pdf:weasyprint` |  | `dist/burning_stars.pdf` | WeasyPrint renders the HTML to PDF. No `--stylesheet` flags; CSS is resolved via the HTML's `<link>` elements. |
| `pdf:weasyprint:debug` |  | `dist/burning_stars.debug.pdf` | Same, but `--uncompressed-pdf` for inspection. |
| `pdf` | `p` | all of the above | Orchestrator: runs `pdf:native`, `pdf:html`, `pdf:weasyprint` in order. |

### Pandoc command shape (`pdf:html`)

- `--from markdown --to html5 --standalone`
- `--template src/lib/pandoc/template.html` -- minimal HTML5 wrapper.
- `--lua-filter src/lib/pandoc/filters/link.lua`
- `--lua-filter src/lib/pandoc/filters/book_citation.lua`
- Repeated `--css ../src/lib/pandoc/css/*.css` flags. Pandoc places each value into the `css` template variable; the template iterates with `$for(css)$<link rel="stylesheet" href="$css$" />$endfor$`.
- Paths use `../src/...` (relative from `dist/burning_stars.html`) so the same `<link href>` resolves correctly for both WeasyPrint (filesystem) and the Vite preview (HTTP).

### Stylesheets (`src/lib/pandoc/css/`)

- `fonts.css` -- `@font-face` for `heading`, `primary`, `secondary-light`, `newton-sans-regular`. Font files live in `static/fonts/`.
- `page.css` -- `@page` rules (print-only).
- `layout.css` -- typography and structural rules.
- `subtitle.css` -- subtitle component.
- `book_citation.css` -- citation card.

### Lua filters (`src/lib/pandoc/filters/`)

- `link.lua` -- link rewriting.
- `book_citation.lua` -- rewrites a BlockQuote whose first `Para` contains exactly two `Emph` nodes into a citation card. Input shape: `> *Source*, *Author*` on the first line, followed by one or more body paragraphs inside the same blockquote. Non-Emph inlines (the comma, spaces) between the two `Emph`s are tolerated. Body paragraphs go through `pandoc.write(pandoc.Pandoc(blocks), "html5")` so inline markup (code, links, emphasis) survives.

## Browser Preview

`vite.pdf.config.js` is a standalone Vite config (no `sveltekit()` plugin) for previewing `dist/burning_stars.html` in a browser. It overrides `server.watch.ignored` to keep `dist/` watched (Vite's default ignore list includes `build.outDir`, which silently drops events under `dist/`). A `configureServer` plugin emits a full reload over the HMR socket whenever `dist/burning_stars.html` is rewritten.

- `task web:preview` (alias `pv`) -- one-shot serve.
- `task web:dev` (alias `d`) -- dev server with full-reload on HTML changes and CSS HMR. Workflow: run `task d` once; rerun `task ph` after edits; the browser auto-reloads.

## Linting

- `task md:lint:spellcheck` -- cspell against `src/lib/burning_stars.md`, custom dictionary in `.cspell.terms.txt`.
- `task md:lint:link-rot` -- verifies `[..](#..)` anchors resolve; depends on `task md:fetch-headings`.
- `task md:lint` (alias `lint`, `l`) -- runs both.

## Toolchain

- Runtime: Bun. Tasks invoke binaries via `bun run`.
- PDF engine: WeasyPrint, installed via `uv tool install weasyprint`. `task install` (alias `i`) runs `bun install`, installs WeasyPrint, and verifies via `task pdf:engine:check` (`uv tool run weasyprint --info`).
- Pandoc must be installed separately (system package).

## Notes

- No test suite configured. Verification is visual: regenerate the PDF (or HTML preview) and inspect.
- Hot-reload only watches `dist/burning_stars.html`. CSS file edits hot-reload via Vite's built-in CSS HMR. Source markdown edits do not trigger anything by themselves; rerun `task ph`.
