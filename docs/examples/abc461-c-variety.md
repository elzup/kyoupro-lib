# 例題講義: ABC461 C - Variety 〜「アイデアをコードにする」実装トレーニング

`docs/solving-flow.md` の **実装フェーズ（＝言語理解／実装力 B）** を 1 問で鍛える講義。
方針（設計）は早めに固めて、**頭の中の手順をどうコードに落とすか**を段階的に組み立てる。
題材は AtCoder ABC461 C。解答言語は Kotlin（`atcoder/abc461/c/Main.kt`）。

> https://atcoder.jp/contests/abc461/tasks/abc461_c

---

## 0. 問題（要約）

N 個の宝石があり、宝石 i は色 C_i と価値 V_i を持つ。
ここから **K 個を選ぶ**。ただし選んだ宝石の色が **M 種類以上**になるようにする。価値の合計の最大値を求めよ。

- 制約: `1 ≤ M ≤ K ≤ N ≤ 2×10⁵`, `1 ≤ C_i ≤ N`, `1 ≤ V_i ≤ 10⁹`
- 入力: `N K M` の次に N 行 `C_i V_i`

制約から読み取ること（理解フェーズ）:
- N ≤ 2×10⁵ → **O(N log N) 想定**。全探索は無理、ソート／優先度付きキューが視野。
- V_i ≤ 10⁹ かつ最大 N 個 → 合計は **2×10¹⁴ ＞ Int 上限**。**Long 必須**（最重要の罠）。

---

## 1. 設計（方針は短く）

「K 個・価値最大」だけなら大きい順に K 個取れば終わり。難しさは **色 M 種類以上**の縛りだけ。

貪欲の核は **「色の縛りは各色の“代表（その色の最大値）”で最も得に払う」**：

1. 各色について最大値を「代表」とする（同じ色なら大きい方を残すのが常に得）。
2. 代表のうち **大きい順に M 個**を確定で取る → これで M 色を確保しつつ損が最小。
3. 残り **K − M 個**は、使わなかった代表＋各色の 2 番目以降を全部まとめた中から **大きい順**に取る。

ここまでが設計。以降はこの 3 手順を**そのままコードにする**のがゴール。

### 変数管理のイメージ（どの箱が今“何を持つか”）
B/C で詰まる地点は「容器の中身を見失う」こと。サンプル `5 3 2` を 1 本通しで追う:

```
入力 : gems = 30c1 40c1 50c1 10c2 20c3   (K=3個 / M=2色以上)

1 色で分ける   byColor[c1]=[30,40,50]  [c2]=[10]  [c3]=[20]
2 各降順ソート  byColor[c1]=[50,40,30]  [c2]=[10]  [c3]=[20]
3 代表/残りへ   t=[50c1, 10c2, 20c3]    q=[40c1, 30c1]
4 t 上位 M=2    sum = 50+20 = 70        t残り=[10c2]
5 余り代表合流  q=[40c1, 30c1, 10c2]
6 q 上位 K-M=1  sum = 70+40 = 110       選択 50,20,40 → 色{c1,c3} ✓
```

ポイント: 同じ `q` でも手順3と手順5で中身が違う。「今どの時点の箱か」を追えるかが鍵。
箱から箱への移動が `add` / `poll` / `addAll` の 1 行に対応する。

> 色付きの図版: [`abc461-c-variable-trace.html`](./abc461-c-variable-trace.html)（宝石が容器を移る様子をステップ表示）

---

## 2. コーディングを段階で組み立てる

### 2-1. 入出力の骨格（まず器を作る）
N が大きいので高速入力を用意。`nextInts(k)` で k 個まとめて読む形にしておくと楽。

```kotlin
private val br = System.`in`.bufferedReader()
private var st = StringTokenizer("")
fun next(): String { while (!st.hasMoreTokens()) st = StringTokenizer(br.readLine()); return st.nextToken() }
fun nextInt() = next().toInt()
fun nextInts(n: Int) = IntArray(n) { nextInt() }

fun main() {
    val (n, k, m) = nextInts(3)
    // ここに本体を足していく
}
```

> 実装フェーズの定石: **入力パース → コア処理 → 出力**の 3 ブロックに割って、まず器だけ通す。

### 2-2. データの持ち方を決める（＝データ構造選定）
「色ごとにまとめたい」が方針の出発点 → **色をキーにしたバケツ配列**にする。
ここは Level 2 の配列操作（「色 c の箱に値を push する」）そのもの。

```kotlin
val byColor = List(n) { mutableListOf<Int>() }   // 色 c-1 の箱に価値を入れる
for (i in 0 until n) {
    val (c, vi) = nextInts(2)
    byColor[c - 1].add(vi)                        // C_i は 1..N なので 0-index に直す
}
```

> 罠: 色は 1-indexed。`c - 1` を忘れると配列外（RE）。

### 2-3. 「各色の代表」と「残り」に仕分ける
手順 1。各バケツを降順ソートし、**先頭（最大）＝代表**を `t` へ、**残り**を `q` へ。
大きい順に取り出したいので、両方 **降順の優先度付きキュー**にする（データ構造選定）。

```kotlin
val t = PriorityQueue<Int>(compareByDescending { it })   // 各色の代表（最大値）たち
val q = PriorityQueue<Int>(compareByDescending { it })   // それ以外すべて
for (bucket in byColor) {
    if (bucket.isEmpty()) continue                       // 出てこない色はスキップ
    bucket.sortDescending()
    t.add(bucket.removeAt(0))                            // 先頭 = その色の最大 → 代表
    q.addAll(bucket)                                     // 残りは共通プールへ
}
```

### 2-4. M 色を確保する（手順 2）
代表の大きい方から M 個を確定。`Long` で積む。

```kotlin
var sum = 0L                          // ← Long。Int だと sample 3 でオーバーフロー
for (i in 0 until m) {
    if (t.isEmpty()) break            // 制約上 M 色は必ず存在するが、安全に
    sum += t.poll()
}
```

### 2-5. 残り K−M を全体から貪欲に（手順 3）
**使わなかった代表を共通プール `q` に戻してから**、大きい順に K−M 個。
ここを忘れると「2 番目に大きい色を捨ててしまう」バグになる。

```kotlin
q.addAll(t)                           // 取らなかった代表も候補に復帰させる
var r = k - m
while (r > 0 && q.isNotEmpty()) {
    sum += q.poll()
    r--
}
```

### 2-6. 出力
```kotlin
println(sum)                          // PrintWriter + flush でも可
```

---

## 3. 完成コード

`atcoder/abc461/c/Main.kt`（実際の AC 解答）。上の 2-1〜2-6 がそのまま並んでいるのを確認する。

```kotlin
import java.util.PriorityQueue
import java.util.StringTokenizer
import java.io.PrintWriter

private val br = System.`in`.bufferedReader()
private var st = StringTokenizer("")

fun main() {
    val out = PrintWriter(System.out.bufferedWriter())
    val (n, k, m) = nextInts(3)

    val byColor = List(n) { mutableListOf<Int>() }
    for (i in 0 until n) {
        val (c, vi) = nextInts(2)
        byColor[c - 1].add(vi)
    }

    var sum = 0L
    val q = PriorityQueue<Int>(compareByDescending { it })
    val t = PriorityQueue<Int>(compareByDescending { it })
    for (bucket in byColor) {
        if (bucket.isEmpty()) continue
        bucket.sortDescending()
        t.add(bucket.removeAt(0))
        q.addAll(bucket)
    }
    for (i in 0 until m) { if (t.isEmpty()) break; sum += t.poll() }

    q.addAll(t)
    var r = k - m
    while (r > 0 && q.isNotEmpty()) { sum += q.poll(); r-- }

    out.println(sum)
    out.flush()
}

fun next(): String { while (!st.hasMoreTokens()) st = StringTokenizer(br.readLine()); return st.nextToken() }
fun nextInt() = next().toInt()
fun nextInts(n: Int) = IntArray(n) { nextInt() }
```

サンプルで検算（手で追える最小単位）:
- 1: 代表 {50,10,20} の上位2 = 50,20、残り q={40,30,10} から1個=40 → **110** ✓
- 2: M=3 で代表3個 = 50,20,10 → **80** ✓
- 3: K=N=5 で全部 → **5000000000**（Long でないと壊れる）✓

---

## ★演習: 要素を一つずつ書けるか

この問題は次の 6 要素の組み立て。**各要素を単体（小さな I/O）で詰まらず書けるか**を 1 つずつ確認する。
解答を隠して書く → `<details>` を開いて答え合わせ。全部書けたら最後に通しで ABC461 C を再現できる。

### 演習1: 分けて配列を作る（バケツ分配）
> お題: `n` 個の `(key, val)` を読み、`key`（1..n）ごとの箱に `val` を振り分けよ。
> 例: `(1,30)(1,40)(2,10)` → 箱1=[30,40], 箱2=[10]

<details><summary>解答</summary>

```kotlin
val box = List(n) { mutableListOf<Int>() }
repeat(n) {
    val (key, v) = nextInts(2)
    box[key - 1].add(v)          // 1-index → 0-index
}
```
</details>

### 演習2: それぞれソートする
> お題: 各箱を**降順**に並べ替えよ。

<details><summary>解答</summary>

```kotlin
for (bucket in box) bucket.sortDescending()
```
</details>

### 演習3: 条件のために前処理で1つずつ取り出す
> お題: 各箱から先頭（＝最大）を 1 個ずつ取り出し、`reps`（代表）に集める。残りは箱に残す。
> 例: 箱1=[40,30] 箱2=[10] → reps=[40,10], 箱1=[30] 箱2=[]

<details><summary>解答</summary>

```kotlin
val reps = mutableListOf<Int>()
for (bucket in box) {
    if (bucket.isEmpty()) continue
    reps.add(bucket.removeAt(0))  // 降順済みなので先頭が最大
}
```
</details>

### 演習4: 残りの結合
> お題: 全部の箱に残った要素を 1 本のリスト `rest` にまとめよ。

<details><summary>解答</summary>

```kotlin
val rest = mutableListOf<Int>()
for (bucket in box) rest.addAll(bucket)
```
</details>

### 演習5: ソートして必要な分だけ取り出す
> お題: 配列 `a` を降順に並べ、上位 `r` 個の和を返せ（`r` が要素数を超えたら全部）。

<details><summary>解答</summary>

```kotlin
a.sortDescending()
var sum = 0L
for (i in 0 until minOf(r, a.size)) sum += a[i]
```
</details>

### 演習6: priority queue の活用
> お題: 演習5 を **PriorityQueue** で。要素を全部入れ、最大を `r` 回 poll して和を取る。
> （ソートとの違い: 後から要素が増える／減る場面で強い）

<details><summary>解答</summary>

```kotlin
val pq = PriorityQueue<Int>(compareByDescending { it })
pq.addAll(a)
var sum = 0L
var cnt = r
while (cnt > 0 && pq.isNotEmpty()) { sum += pq.poll(); cnt-- }
```
</details>

### 通し: 6 要素を組むと本問になる
1（分配）→ 2（各ソート）→ 3（代表を1つずつ＝M色確保の下準備）→ 取り出した代表の上位 M を確定 → 4（残りを結合）＋ 残った代表も合流 → 5 or 6（上位 K−M を取得）。
完成形は前章のコード。**どの演習で手が止まったか**が、いま埋めるべき穴。

---

## 4. つまずきポイント（修正フェーズの予習）

| 症状 | 原因 | 対策 |
| --- | --- | --- |
| sample 3 だけ WA / 変な負数 | `sum` が Int でオーバーフロー | `0L` で Long にする |
| RE（配列外） | 色を 0-index に直し忘れ | `byColor[c - 1]` |
| 微妙に値が小さい | 余った代表を `q` に戻していない | `q.addAll(t)` を入れる |
| 大きい順に取れていない | PQ を昇順で作った | `compareByDescending { it }` |

セルフチェック: **方針を見ずに 2-2〜2-5 を再現できるか**。手が止まる箇所が、あなたの実装力の穴。

---

## 5. このトレーニングで鍛わる本質スキル

`docs/solving-flow.md` の縦串スキルに対応:

- **B 言語理解（実装力）** ← メイン。バケツ配列・PQ・Long を手癖で書けるか
- **データ構造選定** ← 「色でまとめる→バケツ」「大きい順に欲しい→降順 PQ」の即決
- **D デバッグ力** ← オーバーフロー / 0-index / 代表の戻し忘れを症状から逆算

難易度的には Level 3〜4 の橋。設計（貪欲の発想 = A）より、**思いついた手順を素早くコードにする力**を測る回。
関連: `docs/solving-flow.md` / `docs/problem-set.md` / `docs/typical-patterns.md`
