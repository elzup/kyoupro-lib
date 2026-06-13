// Kruskal 法: 最小全域木 (MST) O(E log E)
// UnionFind (lib/ds/union_find.kt) が必要

data class WEdge(val u: Int, val v: Int, val cost: Long)

// MST の総コストを返す。連結でなければ null
fun kruskal(n: Int, edges: List<WEdge>): Long? {
    val uf = UnionFind(n)
    var total = 0L
    var used = 0
    for ((u, v, cost) in edges.sortedBy { it.cost }) {
        if (uf.union(u, v)) {
            total += cost
            used++
        }
    }
    return if (used == n - 1) total else null
}
