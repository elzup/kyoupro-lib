// Union-Find (Disjoint Set Union)
// 経路圧縮 + size による union。ほぼ O(α(N))
// 用途: 連結判定、Kruskal、グループ分け

class UnionFind(n: Int) {
    private val parent = IntArray(n) { it }
    private val size = IntArray(n) { 1 }

    fun find(x: Int): Int {
        if (parent[x] == x) return x
        parent[x] = find(parent[x])
        return parent[x]
    }

    // 併合したら true、既に同じ集合なら false
    fun union(a: Int, b: Int): Boolean {
        val ra = find(a)
        val rb = find(b)
        if (ra == rb) return false
        if (size[ra] < size[rb]) {
            parent[ra] = rb
            size[rb] += size[ra]
        } else {
            parent[rb] = ra
            size[ra] += size[rb]
        }
        return true
    }

    fun same(a: Int, b: Int) = find(a) == find(b)
    fun sizeOf(x: Int) = size[find(x)]
}
