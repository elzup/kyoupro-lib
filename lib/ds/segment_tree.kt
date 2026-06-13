// セグメント木 (非再帰・抽象化)
// 点更新 + 区間クエリを O(log N)
// op はモノイド (結合的 + 単位元 unit) であること
//
// 例:
//   区間最小: SegTree(n, Long.MAX_VALUE) { a, b -> minOf(a, b) }
//   区間最大: SegTree(n, Long.MIN_VALUE) { a, b -> maxOf(a, b) }
//   区間和:   SegTree(n, 0L) { a, b -> a + b }

class SegTree<T>(n: Int, private val unit: T, private val op: (T, T) -> T) {
    private var size = 1

    init {
        while (size < n) size *= 2
    }

    private val tree = MutableList(2 * size) { unit }

    // a[i] = v
    fun update(i: Int, v: T) {
        var x = i + size
        tree[x] = v
        while (x > 1) {
            x /= 2
            tree[x] = op(tree[2 * x], tree[2 * x + 1])
        }
    }

    fun get(i: Int) = tree[i + size]

    // [l, r) のクエリ (半開区間に注意)
    fun query(l: Int, r: Int): T {
        var res = unit
        var lo = l + size
        var hi = r + size
        while (lo < hi) {
            if (lo and 1 == 1) res = op(res, tree[lo++])
            if (hi and 1 == 1) res = op(res, tree[--hi])
            lo /= 2
            hi /= 2
        }
        return res
    }
}
