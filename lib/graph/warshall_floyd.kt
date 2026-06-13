// Warshall-Floyd 法: 全点対最短路 O(V^3)
// V <= 500 程度まで。負辺 OK (負閉路は dist[v][v] < 0 で検出)

const val INF_WF = Long.MAX_VALUE / 4

// dist は隣接行列 (辺がないところは INF_WF、dist[i][i] = 0) を渡すと
// in-place で全点対最短路に更新される
fun warshallFloyd(dist: Array<LongArray>) {
    val n = dist.size
    for (k in 0 until n) {
        for (i in 0 until n) {
            if (dist[i][k] == INF_WF) continue
            for (j in 0 until n) {
                if (dist[k][j] == INF_WF) continue
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j]
                }
            }
        }
    }
}

fun main() {
    val n = 3
    val dist = Array(n) { i -> LongArray(n) { j -> if (i == j) 0L else INF_WF } }
    dist[0][1] = 5
    dist[0][2] = 2
    dist[2][1] = 1
    warshallFloyd(dist)
    println(dist[0][1]) // 3
}
