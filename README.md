# wf-encyclopedia

[中文](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md)

在线地址：<https://worldflipper.miaowm5.com/>

---

## 翻译

### 文件

项目内置的多语言文本位于：

- `src/database/i18n.json`

## 离线打包

流程：**安装依赖 → 放置 CDN 文件 → 执行打包脚本**。

### 安装依赖

```bash
npm install
npm install --prefix app
```

- 根目录依赖用于构建前端资源（Vite/Svelte）。
- `app/` 目录依赖用于 Neutralino 打包。

### 放置 CDN 文件

离线打包必须将 CDN 压缩包文件（`.zip`）放到 `app/cdn/`。

打包过程中会将 `app/cdn/*.zip` 解压到 `app/resources/cdn`。

### 执行打包脚本

```bash
npm run buildApp
```

## 目录

- `app/`：Neutralino 桌面端工程与打包配置。
- `public/`：Vite 公共静态资源目录。
- `src/`：前端源码目录（Svelte 组件、状态、数据库、UI）。
- `tool/`：资源处理脚本（剧情、语音、图集等）。
