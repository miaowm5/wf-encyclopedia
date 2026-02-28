# wf-encyclopedia

[中文](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md)

Online: <https://worldflipper.miaowm5.com/>

---

## Translation

In-repo i18n texts are stored in:

- `src/database/i18n.json`

## Offline Packaging

### Install Dependencies

```bash
npm install
npm install --prefix app
```

### Place CDN Files

For offline packaging, you must place CDN archive files (`.zip`) in `app/cdn/`.

### Run Packaging Script

```bash
npm run buildApp
```

## Directories

- `app/`: Neutralino desktop project and packaging config.
- `public/`: Vite public static assets.
- `src/`: Frontend source directory (Svelte components, state, database, UI).
- `tool/`: Resource processing scripts (story, voice, spritesheet, etc.).
