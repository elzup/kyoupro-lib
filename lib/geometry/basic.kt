// 平面幾何 (ICPC 国内予選頻出)
// 誤差対策: EPS で比較。整数で済む問題は Long の cross/dot を使う

import kotlin.math.abs
import kotlin.math.sqrt

const val EPS = 1e-9

data class P(val x: Double, val y: Double) {
    operator fun plus(o: P) = P(x + o.x, y + o.y)
    operator fun minus(o: P) = P(x - o.x, y - o.y)
    operator fun times(k: Double) = P(x * k, y * k)
    fun dot(o: P) = x * o.x + y * o.y
    fun cross(o: P) = x * o.y - y * o.x
    fun norm() = sqrt(x * x + y * y)
    fun dist(o: P) = (this - o).norm()
}

// ccw: a -> b -> c の回転方向
//  1: 反時計回り / -1: 時計回り
//  2: c-a-b の順で一直線 / -2: a-b-c の順で一直線 / 0: c が a-b 上
fun ccw(a: P, b: P, c: P): Int {
    val ab = b - a
    val ac = c - a
    return when {
        ab.cross(ac) > EPS -> 1
        ab.cross(ac) < -EPS -> -1
        ab.dot(ac) < -EPS -> 2
        ab.norm() < ac.norm() - EPS -> -2
        else -> 0
    }
}

// 線分 a-b と 線分 c-d の交差判定 (端点接触も交差扱い)
fun segIntersect(a: P, b: P, c: P, d: P): Boolean =
    ccw(a, b, c) * ccw(a, b, d) <= 0 && ccw(c, d, a) * ccw(c, d, b) <= 0

// 直線 a-b と直線 c-d の交点 (平行でない前提)
fun lineCross(a: P, b: P, c: P, d: P): P {
    val t = (c - a).cross(d - c) / (b - a).cross(d - c)
    return a + (b - a) * t
}

// 点 p と線分 a-b の距離
fun distSegPoint(a: P, b: P, p: P): Double {
    if ((b - a).dot(p - a) < EPS) return p.dist(a)
    if ((a - b).dot(p - b) < EPS) return p.dist(b)
    return abs((b - a).cross(p - a)) / (b - a).norm()
}

// 凸包 (Andrew's monotone chain) O(N log N)。反時計回りで返す
// 一直線上の点も含めたいなら cross の判定を < -EPS にする
fun convexHull(points: List<P>): List<P> {
    val ps = points.sortedWith(compareBy({ it.x }, { it.y }))
    if (ps.size <= 2) return ps
    val hull = mutableListOf<P>()

    fun popsWhileClockwise(p: P, floor: Int) {
        while (hull.size > floor &&
            (hull[hull.size - 1] - hull[hull.size - 2]).cross(p - hull[hull.size - 1]) < EPS
        ) {
            hull.removeAt(hull.size - 1)
        }
    }
    // 下側
    for (p in ps) {
        popsWhileClockwise(p, 1)
        hull.add(p)
    }
    // 上側 (下側部分は壊さない)
    val lowerCount = hull.size
    for (i in ps.size - 2 downTo 0) {
        popsWhileClockwise(ps[i], lowerCount)
        hull.add(ps[i])
    }
    return hull.dropLast(1) // 末尾は始点の重複
}

// 多角形の符号付き面積 (反時計回りなら正)
fun polygonArea(poly: List<P>): Double {
    var s = 0.0
    for (i in poly.indices) {
        s += poly[i].cross(poly[(i + 1) % poly.size])
    }
    return s / 2
}

// 点の多角形内判定: 2 = 内部, 1 = 辺上, 0 = 外部 (凸でなくても OK)
fun inPolygon(poly: List<P>, p: P): Int {
    var inside = false
    for (i in poly.indices) {
        var a = poly[i] - p
        var b = poly[(i + 1) % poly.size] - p
        if (abs(a.cross(b)) < EPS && a.dot(b) < EPS) return 1
        if (a.y > b.y) { val t = a; a = b; b = t }
        if (a.y < EPS && EPS < b.y && a.cross(b) > EPS) inside = !inside
    }
    return if (inside) 2 else 0
}
