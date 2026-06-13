// bitDP (TSP: 巡回セールスマン問題) O(2^N * N^2)。N <= 16 程度
// dp[S][v] = 訪問済み集合が S で、現在 v にいるときの最小コスト

const val INF_TSP = Long.MAX_VALUE / 4

// dist[i][j] = i -> j の移動コスト。0 から出発して全頂点を回り 0 に戻る最小コスト
fun tsp(dist: Array<LongArray>): Long {
    val n = dist.size
    val full = 1 shl n
    val dp = Array(full) { LongArray(n) { INF_TSP } }
    dp[1][0] = 0 // 0 だけ訪問済みで 0 にいる
    for (s in 0 until full) {
        for (v in 0 until n) {
            if (dp[s][v] == INF_TSP) continue
            for (to in 0 until n) {
                if (s shr to and 1 == 1) continue
                val ns = s or (1 shl to)
                val cost = dp[s][v] + dist[v][to]
                if (cost < dp[ns][to]) dp[ns][to] = cost
            }
        }
    }
    var res = INF_TSP
    for (v in 1 until n) {
        if (dp[full - 1][v] != INF_TSP) {
            res = minOf(res, dp[full - 1][v] + dist[v][0])
        }
    }
    return res
}
