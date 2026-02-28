# wf-encyclopedia

[中文](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md)

公開サイト：<https://worldflipper.miaowm5.com/>

---

## 翻訳

多言語テキストは次のファイルにあります：

- `src/database/i18n.json`

## オフライン版パッケージ

### 依存関係をインストール

```bash
npm install
npm install --prefix app
```

### CDN ファイルを配置

オフライン版をパッケージするには、CDN の圧縮ファイル（`.zip`）を `app/cdn/` に配置する必要があります。

### パッケージスクリプトを実行

```bash
npm run buildApp
```

## ディレクトリ

- `src/`：フロントエンドのソースディレクトリ（Svelte コンポーネント、状態、データベース、UI）。
- `public/`：Vite の公開静的アセット。
- `tool/`：リソース処理スクリプト（ストーリー、ボイス、スプライトシートなど）。
- `app/`：Neutralino デスクトップ版プロジェクトとパッケージ設定。
