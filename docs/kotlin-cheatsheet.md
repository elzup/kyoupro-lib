# Kotlin 競プロチートシート

標準ライブラリだけで戦える操作の早見。スニペットを書く前にここを確認する。

## 入出力

```kotlin
val (a, b) = readLine()!!.split(" ").map { it.toInt() }  // 2 値読み (軽い入力のみ)
// 入力 10⁵ 行超 → lib/io/fast_io.kt
```

## 配列・リスト

```kotlin
IntArray(n)                      // 0 初期化。LongArray, BooleanArray も
IntArray(n) { it * 2 }           // 初期化式つき
Array(h) { IntArray(w) }         // 2 次元
a.sort(); a.sortDescending()     // in-place ソート
a.sortedBy { it.second }         // キー指定 (List を返す)
a.sortedWith(compareBy({ it.first }, { -it.second }))  // 複合キー
a.sum()                          // IntArray の sum() は Int で溢れる → sumOf { it.toLong() }
a.max(); a.min(); a.indices; a.reversed()
a.distinct(); a.groupingBy { it }.eachCount()
a.prefixSum: なし → runningFold(0L) { acc, x -> acc + x }
a.zipWithNext()                  // 隣接ペア [(a0,a1), (a1,a2), ...]
a.chunked(k); a.windowed(k)      // k 個ずつ / 幅 k のスライド窓
```

## 文字列

```kotlin
s[i]               // Char。数字なら s[i] - '0' で Int に
s.substring(l, r)  // [l, r)
s.toCharArray().sorted().joinToString("")  // 文字ソート
s.reversed(); s.repeat(n)
s.indexOf("ab")    // なければ -1
buildString { append(...) }  // 連結は StringBuilder 経由
"abc".all { it.isLowerCase() }
```

## コレクション (構造選択)

```kotlin
ArrayDeque<Int>()        // 両端キュー。BFS は removeFirst/addLast
PriorityQueue<Int>()     // 最小ヒープ。最大は PriorityQueue(compareByDescending { it })
PriorityQueue<Pair<Long, Int>>(compareBy { it.first })  // Pair は比較器必須
java.util.TreeMap<Long, Int>()  // 順序付き map。floorKey/ceilingKey/firstKey
java.util.TreeSet<Long>()       // 順序付き set。floor/ceiling/pollFirst
HashMap, HashSet                // 順序不要なら速いこちら
mutableMapOf<K, V>().getOrPut(k) { mutableListOf() }  // 隣接リスト構築に
```

## bit 演算

```kotlin
1 shl k; 1L shl k          // 2^k (Long に注意)
x and y; x or y; x xor y; x.inv()
x shr k; x ushr k          // 算術 / 論理右シフト
x.countOneBits()           // popcount
x.takeHighestOneBit(); Integer.numberOfTrailingZeros(x)
mask shr i and 1 == 1      // i bit 目が立っているか
```

## 数値

```kotlin
maxOf(a, b, c); minOf(a, b)
a.coerceIn(lo, hi)            // clamp
Math.floorMod(a, m)           // 負数でも非負の剰余 (% は負を返す)
abs(x)  // kotlin.math.abs
java.math.BigInteger("123")   // 多倍長。BigDecimal もある
String.format("%.10f", x)     // 小数出力 (誤差問題は桁数指定が指示される)
```

## よくある罠

| 罠 | 対策 |
| --- | --- |
| `IntArray.sum()` が Int | `sumOf { it.toLong() }` |
| `%` が負を返す | `Math.floorMod` か `(x % m + m) % m` |
| 再帰 DFS で StackOverflow | `Thread(null, { solve() }, "main", 1 shl 26).start()` |
| `Pair` を PriorityQueue に直入れ | 比較器 `compareBy { it.first }` を渡す |
| `readLine()` 連打で TLE | fast_io.kt の StringTokenizer 方式 |
| `println` 連打で TLE | PrintWriter にまとめて最後に flush |
| データクラスの `==` と `===` | 値比較は `==` |
| Int 同士の積を Long に代入 | 計算前に `toLong()` (`a.toLong() * b`) |
