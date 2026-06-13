// BIT (Binary Indexed Tree / Fenwick Tree)
// 点加算 + 区間和を O(log N)
// 用途: 転倒数、区間和クエリ

class BIT(private val n: Int) {
    private val tree = LongArray(n + 1)

    // a[i] += v
    fun add(i: Int, v: Long) {
        var x = i + 1
        while (x <= n) {
            tree[x] += v
            x += x and -x
        }
    }

    // sum of a[0..i]
    fun sum(i: Int): Long {
        var x = i + 1
        var s = 0L
        while (x > 0) {
            s += tree[x]
            x -= x and -x
        }
        return s
    }

    // sum of a[l..r] (閉区間)
    fun sum(l: Int, r: Int) = sum(r) - if (l > 0) sum(l - 1) else 0L
}

// 転倒数: 値を後ろから add(a[i], 1) しながら sum(a[i]-1) を足す
fun inversionCount(a: IntArray): Long {
    val bit = BIT(a.max() + 1)
    var res = 0L
    for (i in a.indices.reversed()) {
        if (a[i] > 0) res += bit.sum(a[i] - 1)
        bit.add(a[i], 1)
    }
    return res
}
