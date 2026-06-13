// LIS (最長増加部分列) / LCS (最長共通部分列)

// LIS O(N log N): dp[i] = 長さ i+1 の増加列の末尾の最小値
fun lis(a: IntArray): Int {
    val dp = mutableListOf<Int>()
    for (x in a) {
        // 広義単調増加 (同じ値も許す) にしたいときは x + 1 で探す
        val pos = dp.binarySearch(x).let { if (it < 0) -(it + 1) else it }
        if (pos == dp.size) dp.add(x) else dp[pos] = x
    }
    return dp.size
}

// LCS O(NM): 復元付き
fun lcs(s: String, t: String): String {
    val n = s.length
    val m = t.length
    val dp = Array(n + 1) { IntArray(m + 1) }
    for (i in 0 until n) {
        for (j in 0 until m) {
            dp[i + 1][j + 1] = if (s[i] == t[j]) {
                dp[i][j] + 1
            } else {
                maxOf(dp[i][j + 1], dp[i + 1][j])
            }
        }
    }
    // 復元
    val sb = StringBuilder()
    var i = n
    var j = m
    while (i > 0 && j > 0) {
        when {
            s[i - 1] == t[j - 1] -> {
                sb.append(s[i - 1])
                i--
                j--
            }
            dp[i - 1][j] >= dp[i][j - 1] -> i--
            else -> j--
        }
    }
    return sb.reverse().toString()
}

// 編集距離 (Levenshtein) O(NM)
fun editDistance(s: String, t: String): Int {
    val dp = Array(s.length + 1) { IntArray(t.length + 1) }
    for (i in 0..s.length) dp[i][0] = i
    for (j in 0..t.length) dp[0][j] = j
    for (i in 1..s.length) {
        for (j in 1..t.length) {
            val cost = if (s[i - 1] == t[j - 1]) 0 else 1
            dp[i][j] = minOf(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
        }
    }
    return dp[s.length][t.length]
}
