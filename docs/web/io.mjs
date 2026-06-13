// 入力構成の定番パターン (言語ごとに別ページとして出力)。
// P1 (template) は完結したプログラム。本体は `// ... 読む ...` /
// `# ... 読む ...` のマーカー行で、verify-io.mjs がここを差し替えて実行検証する。

export const ioPatterns = [
  {
    id: 'template',
    title: 'テンプレ (高速 I/O)',
    sub: 'main 雛形',
    note: '高速入出力つきの雛形。本体で読み、出力はまとめて最後に。これをコピーして使う。',
    code: {
      kotlin: `import java.io.PrintWriter
import java.util.StringTokenizer

private val br = System.\`in\`.bufferedReader()
private var st = StringTokenizer("")
fun next(): String {
  while (!st.hasMoreTokens()) st = StringTokenizer(br.readLine())
  return st.nextToken()
}
fun nextInt() = next().toInt()
fun nextLong() = next().toLong()

fun main() {
  val out = PrintWriter(System.out.bufferedWriter())
  // ... 読む ...
  out.flush()           // 忘れると出力されない
}`,
      python: `import sys
input = sys.stdin.readline      # 高速化 (末尾の改行に注意; rstrip)
sys.setrecursionlimit(10 ** 6)  # 深い再帰を使うなら

def main():
    # ... 読む ...
    pass

main()`,
      java: `import java.io.*;
import java.util.*;

public class Main {
  static BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
  static StringTokenizer st = new StringTokenizer("");
  static String next() throws IOException {
    while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
    return st.nextToken();
  }
  static int nextInt() throws IOException { return Integer.parseInt(next()); }
  static long nextLong() throws IOException { return Long.parseLong(next()); }

  public static void main(String[] args) throws IOException {
    StringBuilder sb = new StringBuilder();
    // ... 読む ...
    System.out.print(sb);     // まとめて出力
  }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);           // cin/cout のまま高速化
  // ... 読む ...
  return 0;
}`,
    },
  },

  {
    id: 'ints',
    title: '整数 1 個 / 複数',
    sub: 'N / a b c',
    note: '1 個の整数、1 行に空白区切りで複数の整数。',
    sample: `入力
5
3 7 2`,
    code: {
      kotlin: `val n = nextInt()                       // 1 個
val a = nextInt(); val b = nextInt(); val c = nextInt()  // 1 行に複数`,
      python: `n = int(input())                        # 1 個
a, b, c = map(int, input().split())     # 1 行に複数`,
      java: `int n = nextInt();                      // 1 個
int a = nextInt(), b = nextInt(), c = nextInt();  // 1 行に複数`,
      cpp: `int n; cin >> n;                        // 1 個
int a, b, c; cin >> a >> b >> c;        // 1 行に複数 (>> が空白/改行を吸収)`,
    },
  },

  {
    id: 'array',
    title: 'N + 配列 (1 行)',
    sub: '長さ N の数列',
    note: 'N を読み、続けて N 個の数列。next/cin は空白・改行どちらの区切りも吸収する。',
    sample: `入力          読み取り
3             n = 3
1 2 3         a = [1, 2, 3]`,
    code: {
      kotlin: `val n = nextInt()
val a = IntArray(n) { nextInt() }       // LongArray(n){nextLong()} も同様`,
      python: `n = int(input())
a = list(map(int, input().split()))     # 1 行に n 個`,
      java: `int n = nextInt();
int[] a = new int[n];
for (int i = 0; i < n; i++) a[i] = nextInt();`,
      cpp: `int n; cin >> n;
vector<int> a(n);
for (auto& x : a) cin >> x;`,
    },
  },

  {
    id: 'rows',
    title: 'N 行 (各行 a b)',
    sub: '辺 / ペアの列',
    note: 'N 行それぞれに複数の値。グラフの辺入力など。',
    sample: `入力
3
1 2
2 3
1 3`,
    code: {
      kotlin: `val n = nextInt()
val e = Array(n) { intArrayOf(nextInt(), nextInt()) }   // e[i][0], e[i][1]`,
      python: `n = int(input())
e = [tuple(map(int, input().split())) for _ in range(n)]`,
      java: `int n = nextInt();
int[][] e = new int[n][2];
for (int i = 0; i < n; i++) { e[i][0] = nextInt(); e[i][1] = nextInt(); }`,
      cpp: `int n; cin >> n;
vector<array<int, 2>> e(n);
for (auto& [u, v] : e) cin >> u >> v;`,
    },
  },

  {
    id: 'grid',
    title: 'グリッド H×W',
    sub: '文字列 H 行',
    note: 'H W を読み、続けて H 行の文字列。grid[y][x] でアクセス。',
    sample: `入力
2 3
.#.
..#`,
    code: {
      kotlin: `val h = nextInt(); val w = nextInt()
val grid = Array(h) { next() }          // grid[y][x] (x は文字)`,
      python: `h, w = map(int, input().split())
grid = [input().rstrip() for _ in range(h)]   # rstrip で改行除去`,
      java: `int h = nextInt(), w = nextInt();
char[][] grid = new char[h][];
for (int i = 0; i < h; i++) grid[i] = next().toCharArray();`,
      cpp: `int h, w; cin >> h >> w;
vector<string> grid(h);
for (auto& row : grid) cin >> row;      // 空白を含まない行は >> でOK`,
    },
  },

  {
    id: 'string',
    title: '文字列',
    sub: '1 語 / 1 行丸ごと',
    note: '空白で区切られた 1 語と、空白を含む 1 行全体の読み分け。',
    code: {
      kotlin: `val s = next()                          // 空白区切りの 1 語
val line = br.readLine()                // 1 行丸ごと (空白含む)`,
      python: `s = input().rstrip()                    # 1 行 (= 1 語想定なら split)
parts = input().split()                 # 空白区切りで分解`,
      java: `String s = next();                      // 空白区切りの 1 語
String line = br.readLine();            // 1 行丸ごと`,
      cpp: `string s; cin >> s;                     // 空白区切りの 1 語
string line; getline(cin >> ws, line);  // 1 行丸ごと (先頭の改行を ws で飛ばす)`,
    },
  },

  {
    id: 'multi',
    title: '複数テストケース',
    sub: 'T 回 / 0 終端',
    note: 'クエリ回数 T が先頭にある形と、ICPC 系の「0 で終端」する形。',
    code: {
      kotlin: `val t = nextInt()
repeat(t) { /* 1 ケース */ }
// ICPC: 0 終端
while (true) { val n = nextInt(); if (n == 0) break; /* ... */ }`,
      python: `t = int(input())
for _ in range(t):
    pass                    # 1 ケース
# ICPC: 0 終端
while True:
    n = int(input())
    if n == 0:
        break`,
      java: `int t = nextInt();
while (t-- > 0) { /* 1 ケース */ }
// ICPC: 0 終端
while (true) { int n = nextInt(); if (n == 0) break; /* ... */ }`,
      cpp: `int t; cin >> t;
while (t--) { /* 1 ケース */ }
// ICPC: 0 終端
int n;
while (cin >> n && n != 0) { /* ... */ }`,
    },
  },

  {
    id: 'output',
    title: '出力',
    sub: '配列 / 小数 / 高速',
    note: '配列をスペース区切り、小数の桁指定、大量出力はまとめて。',
    code: {
      kotlin: `out.println(a.joinToString(" "))            // 配列をスペース区切り
out.println("%.10f".format(ans))            // 小数 10 桁
out.println(if (ok) "Yes" else "No")`,
      python: `print(*a)                                   # 配列をスペース区切り
print(f"{ans:.10f}")                        # 小数 10 桁
sys.stdout.write("\\n".join(map(str, res)) + "\\n")  # 大量出力はまとめて`,
      java: `for (int i = 0; i < n; i++)                 // 配列をスペース区切り
  sb.append(a[i]).append(i + 1 < n ? ' ' : '\\n');
System.out.printf("%.10f%n", ans);          // 小数 10 桁`,
      cpp: `for (int i = 0; i < n; i++)                 // 配列をスペース区切り
  cout << a[i] << " \\n"[i + 1 == n];
cout << fixed << setprecision(10) << ans << "\\n";   // 小数 10 桁`,
    },
  },
]
