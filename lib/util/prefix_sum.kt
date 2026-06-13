// 累積和 / 2次元累積和 / いもす法

// 1次元累積和: sum[i] = a[0..i-1] の和 (sum.size = n + 1)
// 区間和 a[l..r-1] = sum[r] - sum[l]
fun prefixSum(a: LongArray): LongArray {
    val sum = LongArray(a.size + 1)
    for (i in a.indices) sum[i + 1] = sum[i] + a[i]
    return sum
}

// 2次元累積和: sum[y][x] = 矩形 [0,y) x [0,x) の和
fun prefixSum2D(a: Array<LongArray>): Array<LongArray> {
    val h = a.size
    val w = a[0].size
    val sum = Array(h + 1) { LongArray(w + 1) }
    for (y in 0 until h) {
        for (x in 0 until w) {
            sum[y + 1][x + 1] = sum[y + 1][x] + sum[y][x + 1] - sum[y][x] + a[y][x]
        }
    }
    return sum
}

// 矩形 [y1,y2) x [x1,x2) の和
fun rectSum(sum: Array<LongArray>, y1: Int, x1: Int, y2: Int, x2: Int): Long =
    sum[y2][x2] - sum[y1][x2] - sum[y2][x1] + sum[y1][x1]

// いもす法: 区間 [l, r) への加算を差分で記録し、最後に累積して復元
// 区間加算 Q 回 + 復元 = O(N + Q)
class Imos(n: Int) {
    private val diff = LongArray(n + 1)

    // a[l..r-1] += v
    fun add(l: Int, r: Int, v: Long) {
        diff[l] += v
        diff[r] -= v
    }

    fun build(): LongArray {
        val res = LongArray(diff.size - 1)
        var acc = 0L
        for (i in res.indices) {
            acc += diff[i]
            res[i] = acc
        }
        return res
    }
}

fun main() {
    val sum = prefixSum(longArrayOf(1, 2, 3, 4, 5))
    println(sum[4] - sum[1]) // a[1..3] = 2+3+4 = 9

    val imos = Imos(5)
    imos.add(0, 3, 1)
    imos.add(2, 5, 10)
    println(imos.build().joinToString(" ")) // 1 1 11 10 10
}
