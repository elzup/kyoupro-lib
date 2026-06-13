// mod 計算: modpow / modinv / nCr
// MOD は素数前提 (998244353, 1_000_000_007)

const val MOD = 998244353L // or 1_000_000_007L

// a^e mod m (繰り返し二乗法) O(log e)
fun modpow(a: Long, e: Long, m: Long = MOD): Long {
    var base = a % m
    var exp = e
    var res = 1L
    while (exp > 0) {
        if (exp and 1L == 1L) res = res * base % m
        base = base * base % m
        exp = exp shr 1
    }
    return res
}

// 逆元 (フェルマーの小定理、m は素数)
fun modinv(a: Long, m: Long = MOD): Long = modpow(a, m - 2, m)

// nCr の前計算テーブル。Comb(最大 n) で初期化して comb.nCr(n, r)
class Comb(maxN: Int, private val m: Long = MOD) {
    private val fact = LongArray(maxN + 1)
    private val inv = LongArray(maxN + 1)

    init {
        fact[0] = 1
        for (i in 1..maxN) fact[i] = fact[i - 1] * i % m
        inv[maxN] = modpow(fact[maxN], m - 2, m)
        for (i in maxN downTo 1) inv[i - 1] = inv[i] * i % m
    }

    fun nCr(n: Int, r: Int): Long {
        if (r < 0 || r > n) return 0
        return fact[n] * inv[r] % m * inv[n - r] % m
    }

    fun nPr(n: Int, r: Int): Long {
        if (r < 0 || r > n) return 0
        return fact[n] * inv[n - r] % m
    }
}
