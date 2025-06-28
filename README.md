# Retro Shooting Game

1990〜2000年代のアーケード風レトロシューティングゲーム。TypeScriptとHTML5 Canvasで開発。

## 🎮 ゲーム特徴

- **複数の機体タイプ**: スピード型、防御型、バランス型から選択
- **3段階の難易度**: Easy、Normal、Hard
- **スコアランキング**: ローカルストレージに保存
- **レトロ風グラフィック**: ドット絵風のデザイン
- **宇宙背景**: パララックススクロール対応

## 🎯 操作方法

- **移動**: 矢印キー
- **攻撃**: スペースキー
- **ポーズ**: Escキー
- **選択**: Enter、数字キー、文字キー

## 🛠️ 開発環境

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## 📁 プロジェクト構造

```
src/
├── entities/          # ゲームオブジェクト
│   ├── player.ts      # プレイヤー機体
│   ├── enemyManager.ts # 敵管理
│   ├── bulletManager.ts # 弾丸管理
│   └── background.ts   # 背景
├── types.ts           # 型定義
├── game.ts           # メインゲームクラス
├── renderer.ts       # 描画処理
├── input.ts          # 入力処理
├── scoreManager.ts   # スコア管理
└── main.ts          # エントリーポイント
```

## 🚀 デプロイ

GitHub Pagesに自動デプロイされます:
- mainブランチへのプッシュで自動実行
- `https://[username].github.io/shooting-game/`でアクセス可能

## 📝 技術仕様

- **言語**: TypeScript
- **ビルドツール**: Vite
- **描画**: HTML5 Canvas
- **配布**: GitHub Pages
- **対応ブラウザ**: モダンブラウザ（PC版推奨）

## 🎵 今後の予定

- [ ] 8bit風効果音の追加
- [ ] BGMの実装
- [ ] パワーアップアイテム
- [ ] 追加ステージ