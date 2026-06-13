// エラトステネスの篩 O(N log log N)

// isPrime[i] = i が素数か
fun sieve(n: Int): BooleanArray {
    val isPrime = BooleanArray(n + 1) { it >= 2 }
    var i = 2
    while (i * i <= n) {
        if (isPrime[i]) {
            for (j in i * i..n step i) isPrime[j] = false
        }
        i++
    }
    return isPrime
}

// 最小素因数表 (osa_k法の前処理)。spf[x] = x の最小素因数
// これを使うと素因数分解が 1 回あたり O(log x) になる (クエリが多いとき用)
fun smallestPrimeFactor(n: Int): IntArray {
    val spf = IntArray(n + 1) { it }
    var i = 2
    while (i * i <= n) {
        if (spf[i] == i) {
            for (j in i * i..n step i) {
                if (spf[j] == j) spf[j] = i
            }
        }
        i++
    }
    return spf
}

// spf を使った高速素因数分解
fun factorizeWithSpf(x: Int, spf: IntArray): Map<Int, Int> {
    val res = mutableMapOf<Int, Int>()
    var v = x
    while (v > 1) {
        val p = spf[v]
        res[p] = (res[p] ?: 0) + 1
        v /= p
    }
    return res
}
