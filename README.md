# kyoupro-lib

競技プログラミング用 Kotlin スニペット集 + AtCoder 参戦ディレクトリ。

コンテスト中は AI コーディング禁止のため、ここのスニペットを**手で参照・移植**して使う。
カバー範囲の指針: [atcoder-categories](https://atcoder-categories.github.io/) /
当面の目標: ACM-ICPC 国内予選突破レベル。

過去に解いた問題: [competitive-pg-wrokspace](https://github.com/elzup/competitive-pg-wrokspace)

## 🖨 印刷用 早見表 — 4 言語 (`docs/web/`)

大会当日に印刷して使う早見表。**Kotlin / Python / Java / C++** に対応し、1 つの正本データから
言語ごとに 1 ファイルずつ HTML を生成する（**使う言語だけ印刷**する想定・2 段組）。
全 25 トピックのコードは 4 言語ともコンパイル/実行テスト済み。

```bash
cd docs/web && node build.mjs   # → dist/{kotlin,python,java,cpp}.html
# dist/index.html を開き、使う言語のページを Cmd+P → A4 縦で印刷
```

詳細は [docs/web/README.md](docs/web/README.md)。

## ドキュメント (`docs/`)

| ドキュメント | 用途 |
| --- | --- |
| [constraints-complexity.md](docs/constraints-complexity.md) | 制約 → 計算量 → アルゴリズム対応表。問題を読んだら最初に見る |
| [typical-patterns.md](docs/typical-patterns.md) | 問題の特徴 → 手法の逆引き、考察の定石、ICPC 国内予選の傾向 |
| [kotlin-cheatsheet.md](docs/kotlin-cheatsheet.md) | Kotlin 標準ライブラリ早見と「よくある罠」 |

## スニペット一覧 (`lib/`)

### io

| ファイル | 内容 | 計算量 |
| --- | --- | --- |
| [fast_io.kt](lib/io/fast_io.kt) | StringTokenizer 高速入力 / PrintWriter まとめ出力 | - |

### データ構造 (ds)

| ファイル | 内容 | 計算量 |
| --- | --- | --- |
| [union_find.kt](lib/ds/union_find.kt) | Union-Find (経路圧縮 + size) | ほぼ O(α(N)) |
| [bit.kt](lib/ds/bit.kt) | BIT (Fenwick Tree)、転倒数 | O(log N) |
| [segment_tree.kt](lib/ds/segment_tree.kt) | 抽象セグ木 (min/max/sum) | O(log N) |
| [coordinate_compression.kt](lib/ds/coordinate_compression.kt) | 座標圧縮 | O(N log N) |

### グラフ (graph)

| ファイル | 内容 | 計算量 |
| --- | --- | --- |
| [bfs_dfs.kt](lib/graph/bfs_dfs.kt) | BFS / DFS / グリッド BFS | O(V+E) |
| [dijkstra.kt](lib/graph/dijkstra.kt) | Dijkstra (非負最短路) | O((V+E) log V) |
| [bellman_ford.kt](lib/graph/bellman_ford.kt) | Bellman-Ford (負辺 + 負閉路検出) | O(VE) |
| [warshall_floyd.kt](lib/graph/warshall_floyd.kt) | Warshall-Floyd (全点対) | O(V³) |
| [topological_sort.kt](lib/graph/topological_sort.kt) | トポロジカルソート (Kahn) | O(V+E) |
| [kruskal.kt](lib/graph/kruskal.kt) | Kruskal (MST) ※UnionFind 必要 | O(E log E) |
| [dinic.kt](lib/graph/dinic.kt) | Dinic (最大流 / 最小カット) | O(V²E) |
| [bipartite_matching.kt](lib/graph/bipartite_matching.kt) | 二部マッチング | O(VE) |

### 数学 (math)

| ファイル | 内容 | 計算量 |
| --- | --- | --- |
| [gcd_lcm.kt](lib/math/gcd_lcm.kt) | gcd / lcm / 拡張ユークリッド | O(log N) |
| [sieve.kt](lib/math/sieve.kt) | エラトステネス篩 / 最小素因数表 | O(N log log N) |
| [prime_factor.kt](lib/math/prime_factor.kt) | 素因数分解 / 約数列挙 / 素数判定 | O(√N) |
| [mod.kt](lib/math/mod.kt) | modpow / modinv / nCr テーブル | O(log N) / 前計算 O(N) |

### ユーティリティ (util)

| ファイル | 内容 | 計算量 |
| --- | --- | --- |
| [prefix_sum.kt](lib/util/prefix_sum.kt) | 累積和 / 2次元累積和 / いもす法 | 前計算 O(N)、クエリ O(1) |
| [two_pointers.kt](lib/util/two_pointers.kt) | しゃくとり法 (最長区間 / 数え上げ) | O(N) |

### 探索 (search)

| ファイル | 内容 | 計算量 |
| --- | --- | --- |
| [binary_search.kt](lib/search/binary_search.kt) | めぐる式二分探索 / lowerBound / upperBound | O(log N) |
| [enumeration.kt](lib/search/enumeration.kt) | bit 全探索 / nextPermutation | O(2ⁿn) / O(n!·n) |

### DP (dp)

| ファイル | 内容 | 計算量 |
| --- | --- | --- |
| [knapsack.kt](lib/dp/knapsack.kt) | 0-1 / 個数無制限ナップサック / 部分和 | O(NW) |
| [lis_lcs.kt](lib/dp/lis_lcs.kt) | LIS / LCS (復元付き) / 編集距離 | O(N log N) / O(NM) |
| [bit_dp.kt](lib/dp/bit_dp.kt) | bitDP (TSP) | O(2ᴺN²) |

### 文字列 (string)

| ファイル | 内容 | 計算量 |
| --- | --- | --- |
| [rolling_hash.kt](lib/string/rolling_hash.kt) | ローリングハッシュ (mod 2⁶¹-1) | 構築 O(N) / 比較 O(1) |

### 幾何 (geometry) — ICPC 国内予選頻出

| ファイル | 内容 | 計算量 |
| --- | --- | --- |
| [basic.kt](lib/geometry/basic.kt) | ccw / 線分交差 / 直線交点 / 点-線分距離 / 凸包 / 面積 / 内外判定 | 凸包 O(N log N) |

## AtCoder 参戦 (`atcoder/`)

```bash
cd atcoder
./new.sh abc415        # abc415/{a..g}/Main.kt を template から生成
./run.sh abc415/a < in # コンパイル & 実行
```

## Kotlin 競プロの注意点

[docs/kotlin-cheatsheet.md](docs/kotlin-cheatsheet.md) の「よくある罠」を参照。
特に頻発: 再帰 DFS の StackOverflow / `readLine()`・`println` 連打の TLE / Int オーバーフロー。

## 今後の拡張候補 (ICPC レベルを超えたら)

- 遅延評価セグ木 / LCA / 強連結成分分解 (SCC) / 最小費用流
- Z-algorithm / Suffix Array / Trie
- FFT / 行列累乗 / 中国剰余定理
