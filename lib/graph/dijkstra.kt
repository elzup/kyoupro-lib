import java.util.PriorityQueue

// Dijkstra 法: 非負重み付きグラフの単一始点最短路 O((V+E) log V)
// 負辺があるなら Bellman-Ford を使う

const val INF = Long.MAX_VALUE / 4

// g[v] = (to, cost) のリスト
fun dijkstra(g: Array<MutableList<Pair<Int, Long>>>, start: Int): LongArray {
    val dist = LongArray(g.size) { INF }
    dist[start] = 0
    // (dist, v) の最小ヒープ
    val pq = PriorityQueue<Pair<Long, Int>>(compareBy { it.first })
    pq.add(0L to start)
    while (pq.isNotEmpty()) {
        val (d, v) = pq.poll()
        if (d > dist[v]) continue // 古い情報はスキップ
        for ((to, cost) in g[v]) {
            val nd = d + cost
            if (nd < dist[to]) {
                dist[to] = nd
                pq.add(nd to to)
            }
        }
    }
    return dist
}

fun main() {
    // 0 -> 1 (cost 5), 0 -> 2 (cost 2), 2 -> 1 (cost 1)
    val g = Array(3) { mutableListOf<Pair<Int, Long>>() }
    g[0].add(1 to 5L)
    g[0].add(2 to 2L)
    g[2].add(1 to 1L)
    println(dijkstra(g, 0).joinToString(" ")) // 0 3 2
}
