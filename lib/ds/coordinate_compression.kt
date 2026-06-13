// 座標圧縮
// 値の大小関係を保ったまま 0..k-1 に圧縮する
// 用途: BIT/セグ木に乗せる前処理、値の種類数

// 圧縮後の配列と、圧縮値→元の値 の対応を返す
fun compress(a: LongArray): Pair<IntArray, LongArray> {
    val sorted = a.toSortedSet().toLongArray()
    val index = sorted.withIndex().associate { (i, v) -> v to i }
    val compressed = IntArray(a.size) { index[a[it]]!! }
    return compressed to sorted
}

fun main() {
    val a = longArrayOf(100, 50, 100, 7)
    val (c, orig) = compress(a)
    // c = [2, 1, 2, 0], orig = [7, 50, 100]
    println(c.joinToString(" "))
    println(orig.joinToString(" "))
}
