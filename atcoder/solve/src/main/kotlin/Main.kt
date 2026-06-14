import java.io.PrintWriter
import java.util.StringTokenizer

private val br = System.`in`.bufferedReader()
private var st = StringTokenizer("")

fun main() {
    val out = PrintWriter(System.out.bufferedWriter())

    val a = nextInt()
    val d = nextInt()

    out.println(if (a > d) "No" else "Yes")
    out.flush()
}

fun next(): String {
    while (!st.hasMoreTokens()) st = StringTokenizer(br.readLine())
    return st.nextToken()
}

fun nextInt() = next().toInt()

fun nextLong() = next().toLong()

fun nextDouble() = next().toDouble()

fun nextInts(n: Int) = IntArray(n) { nextInt() }

fun nextLongs(n: Int) = LongArray(n) { nextLong() }
