// Bellman-Ford 法: 負辺ありの単一始点最短路 O(VE)
// 負閉路の検出もできる

data class Edge(val from: Int, val to: Int, val cost: Long)

const val INF_BF = Long.MAX_VALUE / 4

// 戻り値: dist。start から到達できる負閉路があれば null
fun bellmanFord(n: Int, edges: List<Edge>, start: Int): LongArray? {
    val dist = LongArray(n) { INF_BF }
    dist[start] = 0
    repeat(n - 1) {
        for ((from, to, cost) in edges) {
            if (dist[from] == INF_BF) continue
            if (dist[from] + cost < dist[to]) dist[to] = dist[from] + cost
        }
    }
    // n 回目でも更新されたら負閉路
    for ((from, to, cost) in edges) {
        if (dist[from] == INF_BF) continue
        if (dist[from] + cost < dist[to]) return null
    }
    return dist
}
