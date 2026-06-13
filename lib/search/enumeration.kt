// 全列挙: bit 全探索 / 順列列挙

// bit 全探索: n 個の要素の選ぶ/選ばないを全通り試す O(2^n * n)。n <= 20 程度
fun bitSearch(n: Int, process: (chosen: List<Int>) -> Unit) {
    for (mask in 0 until (1 shl n)) {
        val chosen = (0 until n).filter { mask shr it and 1 == 1 }
        process(chosen)
    }
}

// next permutation: 辞書順で次の順列に in-place で進める。なければ false
// do { ... } while (nextPermutation(a)) で全順列列挙 O(n! * n)。n <= 10 程度
// 最初に a.sort() しておくこと
fun nextPermutation(a: IntArray): Boolean {
    var i = a.size - 2
    while (i >= 0 && a[i] >= a[i + 1]) i--
    if (i < 0) return false
    var j = a.size - 1
    while (a[j] <= a[i]) j--
    a[i] = a[j].also { a[j] = a[i] }
    var lo = i + 1
    var hi = a.size - 1
    while (lo < hi) {
        a[lo] = a[hi].also { a[hi] = a[lo] }
        lo++
        hi--
    }
    return true
}

fun main() {
    val a = intArrayOf(0, 1, 2)
    do {
        println(a.joinToString(""))
    } while (nextPermutation(a))
    // 012 021 102 120 201 210
}
