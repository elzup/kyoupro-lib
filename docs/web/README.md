# 印刷用 早見表 (4 言語)

大会当日に印刷して使う、競プロ早見表の web 版。**Kotlin / Python / Java / C++** の 4 言語に対応。
正本データ（`snippets.mjs` / `io.mjs` / `array.mjs`）から、言語ごとに 3 種のページ（アルゴリズム早見・入力テンプレ・配列/標準ライブラリ）を生成する。
**使う言語のページだけ印刷**する想定（2 段組・極小フォント）。

## 使い方（印刷）

`dist/index.html` をブラウザで開き、使う言語のページへ → `Cmd+P` → **A4 縦**で印刷。
`dist/*.html` は自己完結（外部 CSS/JS なし）なのでオフラインでも開ける。

## 開発

```bash
cd docs/web
node build.mjs     # *.mjs → dist/{,io-,arr-}{kotlin,python,java,cpp}.html + index.html
node verify.mjs    # 4 言語のコードを実際にコンパイル/実行してテスト
```

- `snippets.mjs` … アルゴリズム正本。トピックごとに 4 言語コード・図解・計算量・罠を持つ
- `io.mjs` … 入力パターン正本（`io-*.html`）
- `array.mjs` … 配列操作 + 標準ライブラリ正本（`arr-*.html`）。各項目に中身の変化 `state` を図示
- `build.mjs` … 生成器（HTML エスケープ + コメント色付け + 2 段組レイアウト）
- `verify.mjs` … 全スニペットを連結 + テスト main を付けてビルド・実行（python3 / clang++ / javac / kotlinc が必要）

トピックを追加するときは `snippets.mjs` に 1 オブジェクト足し、`verify.mjs` の各言語テスト main に検証を 1 行足してから `node verify.mjs && node build.mjs`。

> 検証時の C++ は mac の clang 用に明示 include に差し替えている。本番 judge は `#include <bits/stdc++.h>` 前提。

## 収録トピック (25)

データ構造: Union-Find / BIT(転倒数) / セグメント木 / 座標圧縮
グラフ: グリッドBFS / Dijkstra / Bellman-Ford / Warshall-Floyd / トポロジカルソート / Kruskal / 二部マッチング / Dinic(最大流)
数学: mod・nCr / エラトステネス / gcd・extGcd / 素因数分解・約数
探索: 二分探索(めぐる式) / bit全探索・順列
DP: ナップサック・部分和 / LIS・LCS・編集距離 / bitDP(TSP)
ユーティリティ: 累積和・いもす法 / しゃくとり法
文字列: ローリングハッシュ
幾何: ccw・線分交差・凸包・面積

## 配列・標準ライブラリ (arr-*.html, 20)

生成: 初期化(1D/2D) / 走査(添字つき)
編集: 追加・取り出し(push/pop/shift/unshift) / 連結・マージ / 重複除去
集計: 合計・最大最小 / 条件カウント・抽出 / 累積和
変換: map / 2次元転置
整列: ソート(昇順・降順・キー) / 反転・回転・スライス
探索: 含む・位置 / 最大の位置(argmax) / 二分探索(挿入位置)
コレクション: 優先度付きキュー / Deque・Queue・Stack / Set / Map(頻度)
文字列: 文字列⇄配列(split/join)
