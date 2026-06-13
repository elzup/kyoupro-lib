// gcd / lcm / 拡張ユークリッド

tailrec fun gcd(a: Long, b: Long): Long = if (b == 0L) a else gcd(b, a % b)

// lcm はオーバーフローに注意 (先に割る)
fun lcm(a: Long, b: Long): Long = a / gcd(a, b) * b

// 拡張ユークリッド: ax + by = gcd(a, b) の解 (g, x, y) を返す
// 用途: mod 逆元 (mod が素数でない場合)、一次不定方程式
fun extGcd(a: Long, b: Long): Triple<Long, Long, Long> {
    if (b == 0L) return Triple(a, 1L, 0L)
    val (g, x, y) = extGcd(b, a % b)
    return Triple(g, y, x - (a / b) * y)
}
