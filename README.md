# Mythology and Worldbuilding of Spiral Knights

This repository contains the sources of a study of Spiral Knights fictional setting, its lore, mythology, and worldbuilding: [`src/lib/burning_stars.md`](./src/lib/burning_stars.md).

![preview](https://raw.githubusercontent.com/lorilorimori/spiral-knights-worldbuilding/refs/heads/master/static/img/chapters/1_5_preview.png)

The document is built into `.pdf`

Build requirements:

- `Node` or other compatible javascript runtime (herein `bun`)
- `npm`-compatible package manager (herein `bun`)

1. Install the dependencies:

  ```sh
  bun install
  ```

2. Refer to [taskfile](./taskfile.yml) for further available actions

For pdf generation install additional packages: `weasyprint`, `pandoc`. Both tools should be available from `$PATH`.

Herein WeasyPrint is intalled through `uv` package manager:

```sh
uv tool install weasyprint
uv tool run weasyprint --info
```


## Credits

For credit, please see [Credits](/src/lib/burning_stars.md#credits).
