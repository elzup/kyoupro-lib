// しゃくとり法 (two pointers) O(N)
// 「条件を満たす連続区間」の最長/数え上げ。条件の単調性
// (区間を伸ばすと悪化、縮めると改善) が前提

// 例: 和が k 以下の連続区間の最大長 (a は非負)
fun longestSubarrayWithSumAtMost(a: LongArray, k: Long): Int {
    var best = 0
    var sum = 0L
    var left = 0
    for (right in a.indices) {
        sum += a[right] // 区間 [left, right] に伸ばす
        while (sum > k) { // 条件を破ったら left を詰める
            sum -= a[left]
            left++
        }
        best = maxOf(best, right - left + 1)
    }
    return best
}

// 例: 和が k 以上になる連続区間の総数 (a は非負)
// [left, right] で初めて満たすなら、right を右に伸ばした区間も全て満たす
fun countSubarraysWithSumAtLeast(a: LongArray, k: Long): Long {
    val n = a.size
    var count = 0L
    var sum = 0L
    var right = 0
    for (left in 0 until n) {
        while (right < n && sum < k) {
            sum += a[right]
            right++
        }
        if (sum < k) break // これ以上 left を進めても満たせない
        count += n - right + 1
        sum -= a[left]
    }
    return count
}

fun main() {
    println(longestSubarrayWithSumAtMost(longArrayOf(1, 2, 1, 1, 3), 4)) // 3 ([2,1,1])
    println(countSubarraysWithSumAtLeast(longArrayOf(1, 2, 3), 4))       // 2 ([1,2,3],[2,3])
}
