# レベル別 問題集

ICPC オンライン予選（国内予選）の **N 問目が安定して解ける = level N** とした段階別の精選問題リスト。
出典は AtCoder と AOJ（会津大 ITP1 系）。各 level の「これが解ければ卒業」をヒントなしで通せるかが基準。

## Level 定義（早見）

| Lv  | 予選 | 目安レート     | 解けるべきこと                                   | 主なスキル                                |
| --- | ---- | -------------- | ------------------------------------------------ | ----------------------------------------- |
| 1   | A    | 〜灰 (0-400)   | 入出力して条件分岐・ループを回す                 | 標準入出力 / `if` `for` / 整数演算        |
| 2   | B    | 灰〜茶 (400)   | 配列操作をループと組み合わせて思うがままにできる | 走査・集計 / 2次元 / ネストループ         |
| 3   | C    | 茶 (400-800)   | 全パターン試す発想ができる                       | 全探索 (bit/順列) / 貪欲                  |
| 4   | D    | 緑 (800-1200)  | 典型アルゴリズムを選んで使える                   | 基本DP / BFS・DFS / 二分探索 / Union-Find |
| 5   | E    | 水 (1200-1600) | アルゴリズムを問題に合わせ応用する               | Dijkstra / 区間DP・bitDP / 数論・幾何     |
| 6   | F    | 青 (1600-2000) | 複数手法の合わせ技・重実装をこなす               | 最大流 / セグ木 / SCC・LCA                |
| 7   | G    | 黄〜 (2000+)   | 時間内に通すチームが数えるほどの難問             | 高度幾何 / 高度フロー / 構築              |

国内予選の通過ラインはおおむね **Level 4〜5**（D〜E が解けるチームが本選へ）。

---

## Level 1 — 入出力・条件分岐

入力を受け取り、`if` と `for` で処理して出力するまで。型と入力形式に慣れる。

| 問題                            | URL                                                      | ねらい                 |
| ------------------------------- | -------------------------------------------------------- | ---------------------- |
| Welcome to AtCoder (practice A) | https://atcoder.jp/contests/practice/tasks/practice_1    | 入出力の型・複数値読み |
| ABC086 A - Product              | https://atcoder.jp/contests/abc086/tasks/abc086_a        | 偶奇判定               |
| ABC081 A - Placing Marbles      | https://atcoder.jp/contests/abc081/tasks/abc081_a        | 文字の数え上げ         |
| AOJ ITP1_2 系 (四則・最小値)    | https://onlinejudge.u-aizu.ac.jp/courses/lesson/2/ITP1/2 | 条件分岐の基礎ドリル   |

**卒業条件**: 3 値読んで条件分岐して出力、を詰まらず書ける。

---

## Level 2 — 配列をループで思うがままに（最重要の土台）

アルゴリズム的ひらめきは不要。「頭の中の操作をそのまま配列操作に落とす」実装の自由度を鍛える層。
ここが固まると Level 3 以降の「全探索を書く」「DP テーブルを更新する」が全部ラクになる。

AOJ ITP1 の 4〜7 章が配列操作の純粋ドリルとして最適。

### 2-1 走査・集計（合計 / 最大最小 / カウント）

| 問題                                        | URL                                                               |
| ------------------------------------------- | ----------------------------------------------------------------- |
| ABC081 B - Shift only（全要素を割れる回数） | https://atcoder.jp/contests/abc081/tasks/abc081_b                 |
| ABC083 B - Some Sums（桁和でフィルタ集計）  | https://atcoder.jp/contests/abc083/tasks/abc083_b                 |
| AOJ ITP1_7_A - Grading                      | https://onlinejudge.u-aizu.ac.jp/courses/lesson/2/ITP1/7/ITP1_7_A |

### 2-2 条件付き更新（「○○なら書き換える」）

| 問題                                        | URL                                                               |
| ------------------------------------------- | ----------------------------------------------------------------- |
| ABC085 B - Kagami Mochi（重複除去カウント） | https://atcoder.jp/contests/abc085/tasks/abc085_b                 |
| AOJ ITP1_6_B - Finding Missing Cards        | https://onlinejudge.u-aizu.ac.jp/courses/lesson/2/ITP1/6/ITP1_6_B |

### 2-3 ソート前提・逐次処理

| 問題                                               | URL                                               |
| -------------------------------------------------- | ------------------------------------------------- |
| ABC088 B - Card Game for Two（ソートして交互取り） | https://atcoder.jp/contests/abc088/tasks/abc088_b |

### 2-4 2次元配列・グリッド（行・列・転置）

| 問題                                        | URL                                                               |
| ------------------------------------------- | ----------------------------------------------------------------- |
| AOJ ITP1_7_C - Spreadsheet（行和・列和）    | https://onlinejudge.u-aizu.ac.jp/courses/lesson/2/ITP1/7/ITP1_7_C |
| AOJ ITP1_6_D - Matrix-Vector Multiplication | https://onlinejudge.u-aizu.ac.jp/courses/lesson/2/ITP1/6/ITP1_6_D |
| AOJ ITP1_7_D - Matrix Multiplication        | https://onlinejudge.u-aizu.ac.jp/courses/lesson/2/ITP1/7/ITP1_7_D |

### 2-5 ネストループ（全ペア・二重ループ）

| 問題                                                                 | URL                                                               |
| -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| AOJ ITP1_7_B - How many ways?（三重ループで数え上げ／L3 への橋渡し） | https://onlinejudge.u-aizu.ac.jp/courses/lesson/2/ITP1/7/ITP1_7_B |

### 2-6 インデックス操作（反転・ずらし）

| 問題                                               | URL                                                               |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| AOJ ITP1_6_A - Reversing Numbers                   | https://onlinejudge.u-aizu.ac.jp/courses/lesson/2/ITP1/6/ITP1_6_A |
| AOJ ITP1_5_A - Print a Rectangle（二重ループ出力） | https://onlinejudge.u-aizu.ac.jp/courses/lesson/2/ITP1/5/ITP1_5_A |

**卒業条件**: 2-1〜2-6 をヒントなしで詰まらず書ける。2 次元の行・列ループと全ペア二重ループが手癖になる。

---

## Level 3 — 全探索・貪欲

「全部試せば解ける」と気づき、それを実装に落とせる。bit 全探索・順列全探索が武器に。
→ 手法選びは `docs/typical-patterns.md`、実装は `lib/search/enumeration.kt`。

| 問題                    | URL                                               | ねらい               |
| ----------------------- | ------------------------------------------------- | -------------------- |
| ABC087 B - Coins        | https://atcoder.jp/contests/abc087/tasks/abc087_b | 三重ループ全探索     |
| ABC085 C - Otoshidama   | https://atcoder.jp/contests/abc085/tasks/abc085_c | 全探索＋1変数を逆算  |
| ABC079 C - Train Ticket | https://atcoder.jp/contests/abc079/tasks/abc079_c | bit 全探索（演算子） |
| ABC128 C - Switches     | https://atcoder.jp/contests/abc128/tasks/abc128_c | bit 全探索           |
| ABC150 C - Count Order  | https://atcoder.jp/contests/abc150/tasks/abc150_c | 順列全探索           |
| ABC086 C - Traveling    | https://atcoder.jp/contests/abc086/tasks/abc086_c | 偶奇・条件整理       |

**卒業条件**: N≤20 を bit 全探索、N≤10 を順列全探索で迷わず書ける。

---

## Level 4 — 典型アルゴリズム

典型を「選んで」使える。DP・グラフ探索・二分探索・Union-Find。問題バンクは **EDPC** が定番。

| 問題                               | URL                                                  | ねらい                |
| ---------------------------------- | ---------------------------------------------------- | --------------------- |
| EDPC A - Frog 1 / B - Frog 2       | https://atcoder.jp/contests/dp/tasks/dp_a            | 1次元 DP の基礎       |
| EDPC C - Vacation / D - Knapsack 1 | https://atcoder.jp/contests/dp/tasks/dp_c            | 選択 DP・ナップサック |
| ABC007 C - 幅優先探索              | https://atcoder.jp/contests/abc007/tasks/abc007_3    | グリッド BFS          |
| ATC001 A - 深さ優先探索            | https://atcoder.jp/contests/atc001/tasks/dfs_a       | DFS / 連結            |
| ABC077 C - Snuke Festival          | https://atcoder.jp/contests/abc077/tasks/arc084_a    | 二分探索・累積        |
| ATC001 B - Union Find              | https://atcoder.jp/contests/atc001/tasks/unionfind_a | Union-Find            |

→ 実装: `lib/dp/knapsack.kt`, `lib/graph/bfs_dfs.kt`, `lib/search/binary_search.kt`, `lib/ds/union_find.kt`

**卒業条件**: 問題文から「これは DP / BFS / 二分探索」と当て、ライブラリ無しでも基本形が書ける。

---

## Level 5 — 応用

典型を問題に合わせて変形する。Dijkstra・区間/bit DP・数論・幾何基礎。問題バンクは **EDPC 後半** と **競プロ典型90問**。

| 問題                        | URL                                               | ねらい                 |
| --------------------------- | ------------------------------------------------- | ---------------------- |
| EDPC N - Slimes             | https://atcoder.jp/contests/dp/tasks/dp_n         | 区間 DP                |
| EDPC O - Matching           | https://atcoder.jp/contests/dp/tasks/dp_o         | bit DP                 |
| ABC035 D - トレジャーハント | https://atcoder.jp/contests/abc035/tasks/abc035_d | Dijkstra（往復・逆辺） |
| 競プロ典型90問 ★4〜5        | https://atcoder.jp/contests/typical90             | 応用の総合ドリル       |

→ 実装: `lib/graph/dijkstra.kt`, `lib/dp/bit_dp.kt`, `lib/dp/lis_lcs.kt`, `lib/math/mod.kt`, `lib/geometry/basic.kt`

**卒業条件**: 典型の組合せ・ひとひねりを通せる。幾何の誤差(EPS)と退化ケースに気づける。

---

## Level 6 — 重実装・高度データ構造

複数手法の合わせ技。最大流・セグ木・SCC・LCA。問題バンクは **ALPC (AtCoder Library Practice Contest)**。

| 問題                  | URL                                                     | ねらい     |
| --------------------- | ------------------------------------------------------- | ---------- |
| ALPC G - SCC          | https://atcoder.jp/contests/practice2/tasks/practice2_g | 強連結成分 |
| ALPC J - Segment Tree | https://atcoder.jp/contests/practice2/tasks/practice2_j | セグ木     |
| ALPC D - Maxflow      | https://atcoder.jp/contests/practice2/tasks/practice2_d | 最大流     |

→ 実装: `lib/graph/dinic.kt`, `lib/ds/bit.kt`, `lib/graph/bipartite_matching.kt`

**卒業条件**: 高度 DS をライブラリ化して貼り、本体の考察に集中できる。

---

## Level 7 — 最難

時間内に通すチームが数えるほど。高度な計算幾何・フロー・構築・数学考察。
AGC の易しめや ICPC 本番 G 問題、典型90 の ★6〜7 で挑戦。

| 出典                        | URL                                   |
| --------------------------- | ------------------------------------- |
| 競プロ典型90問 ★6〜7        | https://atcoder.jp/contests/typical90 |
| AtCoder Grand Contest (AGC) | https://atcoder.jp/contests/          |

---

## 使い方メモ

- 各 level の **卒業条件をヒントなしで通せたら次へ**。詰まったら一段下のサブスキルに戻る。
- 手法当てに迷ったら `docs/typical-patterns.md` の逆引き表へ。
- 実装スニペットは `lib/` に揃っているので、考察と実装を分けて練習できる。
