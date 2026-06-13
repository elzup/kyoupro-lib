// 二分探索

// めぐる式: ok は条件を満たす側、ng は満たさない側の初期値
// 「条件を満たす最小/最大の値」を返す。単調性が前提
// 例: 最小値を探す → ok = 大きい値, ng = 小さい値
fun binarySearch(okInit: Long, ngInit: Long, check: (Long) -> Boolean): Long {
    var ok = okInit
    var ng = ngInit
    while (Math.abs(ok - ng) > 1) {
        val mid = (ok + ng) / 2
        if (check(mid)) ok = mid else ng = mid
    }
    return ok
}

// lowerBound: sorted[i] >= x となる最小の i (なければ size)
fun lowerBound(sorted: LongArray, x: Long): Int {
    var lo = -1
    var hi = sorted.size
    while (hi - lo > 1) {
        val mid = (lo + hi) / 2
        if (sorted[mid] >= x) hi = mid else lo = mid
    }
    return hi
}

// upperBound: sorted[i] > x となる最小の i (なければ size)
fun upperBound(sorted: LongArray, x: Long): Int {
    var lo = -1
    var hi = sorted.size
    while (hi - lo > 1) {
        val mid = (lo + hi) / 2
        if (sorted[mid] > x) hi = mid else lo = mid
    }
    return hi
}

// 配列内の x の個数 = upperBound - lowerBound

fun main() {
    // 答えで二分探索の例: x^2 >= 1000 となる最小の x
    val ans = binarySearch(1000, 0) { it * it >= 1000 }
    println(ans) // 32
}
