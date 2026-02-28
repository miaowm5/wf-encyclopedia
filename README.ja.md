# wf-encyclopedia

[中文](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md)

公開サイト：<https://worldflipper.miaowm5.com/>

---

## 翻訳

### ファイル

多言語テキストは次のファイルにあります：

- `src/database/i18n.json`

## オフライン版パッケージ

手順：**依存関係のインストール → CDN ファイルの配置 → パッケージスクリプトの実行**。

### 依存関係をインストール

```bash
npm install
npm install --prefix app
```

- ルートの依存関係はフロントエンド資産（Vite/Svelte）のビルドに使用されます。
- `app/` の依存関係は Neutralino のパッケージに使用されます。

### CDN ファイルを配置

オフライン版をパッケージするには、CDN の圧縮ファイル（`.zip`）を `app/cdn/` に配置する必要があります。

パッケージ時に `app/cdn/*.zip` は `app/resources/cdn` へ展開されます。

### パッケージスクリプトを実行

```bash
npm run buildApp
```

## ディレクトリ

- `app/`：Neutralino デスクトップ版プロジェクトとパッケージ設定。
- `public/`：Vite の公開静的アセット。
- `src/`：フロントエンドのソースディレクトリ（Svelte コンポーネント、状態、データベース、UI）。
- `tool/`：リソース処理スクリプト（ストーリー、ボイス、スプライトシートなど）。
