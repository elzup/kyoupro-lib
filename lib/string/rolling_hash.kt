// ローリングハッシュ: 部分文字列の比較を O(1)
// 用途: 文字列検索、回文判定、最長共通接頭辞
// 衝突対策で MOD は 2^61 - 1 を使う

class RollingHash(s: String) {
    companion object {
        const val MOD = (1L shl 61) - 1
        const val BASE = 1_000_003L // 本番ではランダム基数が安全

        private fun mulMod(a: Long, b: Long): Long {
            // __int128 がないので Math.multiplyHigh で 128bit 乗算
            val hi = Math.multiplyHigh(a, b)
            val lo = a * b
            // (hi, lo) を mod (2^61 - 1) に畳み込む
            var res = (hi shl 3) + (lo ushr 61) + (lo and MOD)
            if (res >= MOD) res -= MOD
            return res
        }
    }

    private val n = s.length
    private val hash = LongArray(n + 1)
    private val pow = LongArray(n + 1)

    init {
        pow[0] = 1
        for (i in 0 until n) {
            hash[i + 1] = (mulMod(hash[i], BASE) + s[i].code) % MOD
            pow[i + 1] = mulMod(pow[i], BASE)
        }
    }

    // s[l, r) のハッシュ
    fun get(l: Int, r: Int): Long {
        var res = hash[r] - mulMod(hash[l], pow[r - l])
        if (res < 0) res += MOD
        return res
    }
}

fun main() {
    val rh = RollingHash("abcabc")
    println(rh.get(0, 3) == rh.get(3, 6)) // true ("abc" == "abc")
    println(rh.get(0, 2) == rh.get(1, 3)) // false ("ab" != "bc")
}
