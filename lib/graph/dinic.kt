// Dinic 法: 最大流 O(V^2 E) (実用上はかなり速い)
// 用途: 最大流、最小カット (最大流 = 最小カット)、二部マッチング

class Dinic(private val n: Int) {
    private class E(val to: Int, var cap: Long, val rev: Int)

    private val g = Array(n) { mutableListOf<E>() }
    private val level = IntArray(n)
    private val iter = IntArray(n)

    fun addEdge(from: Int, to: Int, cap: Long) {
        g[from].add(E(to, cap, g[to].size))
        g[to].add(E(from, 0, g[from].size - 1))
    }

    private fun bfs(s: Int): Boolean {
        level.fill(-1)
        level[s] = 0
        val queue = ArrayDeque<Int>()
        queue.add(s)
        while (queue.isNotEmpty()) {
            val v = queue.removeFirst()
            for (e in g[v]) {
                if (e.cap > 0 && level[e.to] < 0) {
                    level[e.to] = level[v] + 1
                    queue.add(e.to)
                }
            }
        }
        return true
    }

    private fun dfs(v: Int, t: Int, f: Long): Long {
        if (v == t) return f
        while (iter[v] < g[v].size) {
            val e = g[v][iter[v]]
            if (e.cap > 0 && level[v] < level[e.to]) {
                val d = dfs(e.to, t, minOf(f, e.cap))
                if (d > 0) {
                    e.cap -= d
                    g[e.to][e.rev].cap += d
                    return d
                }
            }
            iter[v]++
        }
        return 0
    }

    fun maxFlow(s: Int, t: Int): Long {
        var flow = 0L
        while (true) {
            bfs(s)
            if (level[t] < 0) return flow
            iter.fill(0)
            while (true) {
                val f = dfs(s, t, Long.MAX_VALUE / 4)
                if (f == 0L) break
                flow += f
            }
        }
    }
}
