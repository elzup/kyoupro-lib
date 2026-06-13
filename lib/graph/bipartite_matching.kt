// 二部マッチング (増加路を DFS で探す) O(VE)
// 左 n 頂点、右 m 頂点。g[u] = 左 u から繋がる右頂点のリスト
// 用途: 仕事の割り当て、最小頂点被覆 (= 最大マッチング, König の定理)

class BipartiteMatching(private val n: Int, private val m: Int) {
    private val g = Array(n) { mutableListOf<Int>() }
    private val matchL = IntArray(n) { -1 }
    private val matchR = IntArray(m) { -1 }

    fun addEdge(u: Int, v: Int) {
        g[u].add(v)
    }

    private fun dfs(u: Int, visited: BooleanArray): Boolean {
        for (v in g[u]) {
            if (visited[v]) continue
            visited[v] = true
            if (matchR[v] == -1 || dfs(matchR[v], visited)) {
                matchL[u] = v
                matchR[v] = u
                return true
            }
        }
        return false
    }

    fun solve(): Int {
        var res = 0
        for (u in 0 until n) {
            if (dfs(u, BooleanArray(m))) res++
        }
        return res
    }
}
