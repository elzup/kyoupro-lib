// 素因数分解・約数列挙・素数判定 (いずれも O(√N))

// 素因数分解: {素因数: 指数}
fun factorize(n: Long): Map<Long, Int> {
    val res = mutableMapOf<Long, Int>()
    var v = n
    var p = 2L
    while (p * p <= v) {
        while (v % p == 0L) {
            res[p] = (res[p] ?: 0) + 1
            v /= p
        }
        p++
    }
    if (v > 1) res[v] = (res[v] ?: 0) + 1
    return res
}

// 約数列挙 (ソート済み)
fun divisors(n: Long): List<Long> {
    val small = mutableListOf<Long>()
    val large = mutableListOf<Long>()
    var d = 1L
    while (d * d <= n) {
        if (n % d == 0L) {
            small.add(d)
            if (d != n / d) large.add(n / d)
        }
        d++
    }
    return small + large.reversed()
}

fun isPrime(n: Long): Boolean {
    if (n < 2) return false
    var d = 2L
    while (d * d <= n) {
        if (n % d == 0L) return false
        d++
    }
    return true
}
