# wf-encyclopedia

[中文](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md)

Online: <https://worldflipper.miaowm5.com/>

---

## Translation

### File

In-repo i18n texts are stored in:

- `src/database/i18n.json`

## Offline Packaging

Flow: **Install dependencies → Place CDN files → Run packaging script**.

### Install Dependencies

```bash
npm install
npm install --prefix app
```

- Root dependencies are used to build frontend resources (Vite/Svelte).
- `app/` dependencies are used for Neutralino packaging.

### Place CDN Files

For offline packaging, you must place CDN archive files (`.zip`) in `app/cdn/`.

During packaging, `app/cdn/*.zip` will be extracted to `app/resources/cdn`.

### Run Packaging Script

```bash
npm run buildApp
```

## Directories

- `app/`: Neutralino desktop project and packaging config.
- `public/`: Vite public static assets.
- `src/`: Frontend source directory (Svelte components, state, database, UI).
- `tool/`: Resource processing scripts (story, voice, spritesheet, etc.).
