// ナップサック DP

// 0-1 ナップサック: 各品物は 1 個まで O(NW)
// dp[w] = 容量 w での最大価値。重さの逆順ループがポイント
fun knapsack01(weights: IntArray, values: LongArray, capacity: Int): Long {
    val dp = LongArray(capacity + 1)
    for (i in weights.indices) {
        for (w in capacity downTo weights[i]) {
            dp[w] = maxOf(dp[w], dp[w - weights[i]] + values[i])
        }
    }
    return dp[capacity]
}

// 個数無制限ナップサック: 重さの正順ループにするだけ
fun knapsackUnbounded(weights: IntArray, values: LongArray, capacity: Int): Long {
    val dp = LongArray(capacity + 1)
    for (i in weights.indices) {
        for (w in weights[i]..capacity) {
            dp[w] = maxOf(dp[w], dp[w - weights[i]] + values[i])
        }
    }
    return dp[capacity]
}

// 部分和問題: 合計を target にできるか (dp[s] = s を作れるか)
fun subsetSum(a: IntArray, target: Int): Boolean {
    val dp = BooleanArray(target + 1)
    dp[0] = true
    for (x in a) {
        for (s in target downTo x) {
            if (dp[s - x]) dp[s] = true
        }
    }
    return dp[target]
}
