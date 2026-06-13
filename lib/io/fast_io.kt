import java.io.PrintWriter
import java.util.StringTokenizer

// 高速入出力
// readLine().split(" ") は入力が多い (10^5 行以上) と TLE しうるので
// StringTokenizer ベースの reader を使う。
// 出力も println 連打ではなく PrintWriter or StringBuilder にまとめて flush する。

private val br = System.`in`.bufferedReader()
private var st = StringTokenizer("")

fun next(): String {
    while (!st.hasMoreTokens()) st = StringTokenizer(br.readLine())
    return st.nextToken()
}

fun nextInt() = next().toInt()
fun nextLong() = next().toLong()
fun nextDouble() = next().toDouble()
fun nextInts(n: Int) = IntArray(n) { nextInt() }
fun nextLongs(n: Int) = LongArray(n) { nextLong() }

fun main() {
    val out = PrintWriter(System.out.bufferedWriter())
    val n = nextInt()
    val a = nextLongs(n)
    out.println(a.sum())
    out.flush() // 忘れると何も出力されない
}
