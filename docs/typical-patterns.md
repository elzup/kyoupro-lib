# 典型テクニック早見

「どの考察パターンか」を当てるための逆引き。実装は `lib/` の各スニペット参照。

## 問題文 → 手法の逆引き

| 問題の特徴 | 手法 | スニペット |
| --- | --- | --- |
| 区間 [l, r] の和を何度も聞かれる | 累積和 | lib/util/prefix_sum.kt |
| 区間への一様な加算が大量 | いもす法 | lib/util/prefix_sum.kt |
| 条件を満たす連続区間の数え上げ/最長 | しゃくとり法 | lib/util/two_pointers.kt |
| 「最大値の最小化」「〜できる最小の x」 | 答えで二分探索 | lib/search/binary_search.kt |
| 選ぶ/選ばない、N ≤ 20 | bit 全探索 | lib/search/enumeration.kt |
| 選ぶ/選ばない、N ≤ 40 | 半分全列挙 + 二分探索 | (enumeration + binary_search) |
| 並べ方を全部試す、N ≤ 10 | 順列全列挙 | lib/search/enumeration.kt |
| 重さ制約 + 価値最大化 | ナップサック DP | lib/dp/knapsack.kt |
| 全都市を巡る最短路、N ≤ 16 | bitDP (TSP) | lib/dp/bit_dp.kt |
| 増加する部分列の最長 | LIS | lib/dp/lis_lcs.kt |
| 2 つの文字列の類似度 | LCS / 編集距離 | lib/dp/lis_lcs.kt |
| 迷路・最少手数 | グリッド BFS | lib/graph/bfs_dfs.kt |
| 重みつき最短路 (非負) | Dijkstra | lib/graph/dijkstra.kt |
| 負の辺がある / 負閉路検出 | Bellman-Ford | lib/graph/bellman_ford.kt |
| 全点対の距離、V ≤ 500 | Warshall-Floyd | lib/graph/warshall_floyd.kt |
| 依存関係の順序付け | トポロジカルソート | lib/graph/topological_sort.kt |
| 全部つなぐ最小コスト | MST (Kruskal) | lib/graph/kruskal.kt |
| グループ分け・連結判定 | Union-Find | lib/ds/union_find.kt |
| 割り当ての最大数 | 二部マッチング | lib/graph/bipartite_matching.kt |
| 「同時に成り立たない」の最小除去 | 最小カット = 最大流 | lib/graph/dinic.kt |
| 大きい値だが種類が少ない | 座標圧縮 | lib/ds/coordinate_compression.kt |
| 左より小さい要素の数 (転倒数) | BIT | lib/ds/bit.kt |
| 部分文字列の一致を高速比較 | ローリングハッシュ | lib/string/rolling_hash.kt |
| 線分が交わるか・図形の面積 | 幾何 (ccw 系) | lib/geometry/basic.kt |
| 組合せの数 mod p | nCr テーブル | lib/math/mod.kt |

## 考察の定石 (実装以前)

- **逆から考える**: 操作を逆順にすると単純になることが多い (削除→追加)
- **ソートしてよいか**: 順序が答えに影響しないなら必ずソートする
- **余事象**: 「少なくとも 1 つ」→ 全体 − 「1 つもない」
- **偶奇・不変量**: 操作で変わらない量 (和の偶奇、mod) を探す
- **小さいケースを手で**: N=1,2,3 を書き出すと規則が見える
- **答えの単調性**: 「x で可能なら x+1 でも可能」なら二分探索に落ちる
- **寄与分解**: 総和は「各要素が何回数えられるか」に分解する

## ICPC 国内予選の傾向メモ

- A-B: 実装するだけ。**読解と入出力形式**に注意 (複数テストケース、終端 0 0 など)
- C-D: 全探索 + 工夫 (枝刈り、bit全探索)、シミュレーション
- E-F: グラフ・DP・幾何。幾何は誤差 (EPS) と退化ケース (一直線、同一点) が罠
- 複数データセット形式: `while (true) { val n = nextInt(); if (n == 0) break; ... }`
- チーム戦: 紙でアルゴリズムを決めてから書く。実装は 1 人ずつ交代
