// トポロジカルソート (Kahn のアルゴリズム) O(V+E)
// DAG の頂点を辺の向きに沿って並べる。閉路があれば null

fun topologicalSort(g: Array<MutableList<Int>>): List<Int>? {
    val n = g.size
    val indeg = IntArray(n)
    for (v in 0 until n) for (to in g[v]) indeg[to]++

    val queue = ArrayDeque<Int>()
    for (v in 0 until n) if (indeg[v] == 0) queue.add(v)

    val order = mutableListOf<Int>()
    while (queue.isNotEmpty()) {
        val v = queue.removeFirst()
        order.add(v)
        for (to in g[v]) {
            indeg[to]--
            if (indeg[to] == 0) queue.add(to)
        }
    }
    return if (order.size == n) order else null // 閉路あり
}

// 辞書順最小が欲しければ ArrayDeque を PriorityQueue<Int>() に変える
