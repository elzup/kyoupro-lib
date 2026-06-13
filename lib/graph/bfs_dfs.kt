// BFS / DFS
// 隣接リスト型グラフと、グリッド BFS の典型

// 隣接リスト構築 (無向グラフ、0-indexed)
fun buildGraph(n: Int, edges: List<Pair<Int, Int>>): Array<MutableList<Int>> {
    val g = Array(n) { mutableListOf<Int>() }
    for ((u, v) in edges) {
        g[u].add(v)
        g[v].add(u) // 有向ならこの行を消す
    }
    return g
}

// BFS: start からの最短距離 (辺コスト 1)。届かない頂点は -1
fun bfs(g: Array<MutableList<Int>>, start: Int): IntArray {
    val dist = IntArray(g.size) { -1 }
    dist[start] = 0
    val queue = ArrayDeque<Int>()
    queue.add(start)
    while (queue.isNotEmpty()) {
        val v = queue.removeFirst()
        for (to in g[v]) {
            if (dist[to] != -1) continue
            dist[to] = dist[v] + 1
            queue.add(to)
        }
    }
    return dist
}

// DFS (再帰)。N が大きい (10^5+) と StackOverflow するので
// その場合は Thread(null, { ... }, "main", 1 shl 26).start() で包むか反復版にする
fun dfs(g: Array<MutableList<Int>>, v: Int, visited: BooleanArray) {
    visited[v] = true
    for (to in g[v]) {
        if (!visited[to]) dfs(g, to, visited)
    }
}

// グリッド BFS: '#' が壁。(sy, sx) からの最短距離
val dy = intArrayOf(-1, 1, 0, 0)
val dx = intArrayOf(0, 0, -1, 1)

fun gridBfs(grid: Array<String>, sy: Int, sx: Int): Array<IntArray> {
    val h = grid.size
    val w = grid[0].length
    val dist = Array(h) { IntArray(w) { -1 } }
    dist[sy][sx] = 0
    val queue = ArrayDeque<Pair<Int, Int>>()
    queue.add(sy to sx)
    while (queue.isNotEmpty()) {
        val (y, x) = queue.removeFirst()
        for (d in 0 until 4) {
            val ny = y + dy[d]
            val nx = x + dx[d]
            if (ny !in 0 until h || nx !in 0 until w) continue
            if (grid[ny][nx] == '#' || dist[ny][nx] != -1) continue
            dist[ny][nx] = dist[y][x] + 1
            queue.add(ny to nx)
        }
    }
    return dist
}
