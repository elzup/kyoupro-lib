// 区間処理・境界変換の早見 (言語ごとに別ページ)。
// 累積和/いもす本体だけでなく、問題文の閉区間をコードの半開区間へ移す手順をまとめる。

export const intervalPatterns = [
  {
    id: 'half_open',
    group: '境界',
    title: '半開区間 [l, r)',
    sub: '長さ / 空 / 変換',
    state: `添字: 0 1 2 3 4
[1,4) → 1 2 3      長さ = r-l = 3
[2,2) → 空         端点一致は空区間
1-index 閉区間 [L,R] → 0-index 半開 [L-1, R)`,
    note: '区間は半開 [l, r) に統一すると、長さ・累積和・スライス・二分探索の境界が揃う。',
    pitfalls: ['問題文が 1-indexed なら l=L-1, r=R に直す', '閉区間 [l,r] を使うなら長さは r-l+1。混ぜない'],
    code: {
      kotlin: `// 問題文: 1-indexed 閉区間 [L, R]
val l = L - 1          // 0-index
val r = R              // 半開 [l, r)
val len = r - l
for (i in l until r) { /* a[i] */ }`,
      python: `# 問題文: 1-indexed 閉区間 [L, R]
l = L - 1              # 0-index
r = R                  # 半開 [l, r)
length = r - l
for i in range(l, r):
    pass`,
      java: `// 問題文: 1-indexed 閉区間 [L, R]
int l = L - 1;         // 0-index
int r = R;             // 半開 [l, r)
int len = r - l;
for (int i = l; i < r; i++) { /* a[i] */ }`,
      cpp: `// 問題文: 1-indexed 閉区間 [L, R]
int l = L - 1;         // 0-index
int r = R;             // 半開 [l, r)
int len = r - l;
for (int i = l; i < r; i++) { /* a[i] */ }`,
    },
  },

  {
    id: 'prefix_1d',
    group: '累積和',
    title: '1次元累積和',
    sub: '区間和 O(1)',
    state: `a   = [1,2,3,4]
pre = [0,1,3,6,10]
sum [l,r) = pre[r] - pre[l]
sum [1,3) = 6 - 1 = 5`,
    note: 'pre は長さ N+1。pre[i] は a[0..i-1] の和。区間和は必ず pre[r] - pre[l]。',
    pitfalls: ['合計は Long / long / ll で持つ', '閉区間 [L,R] は [L-1,R) にしてから引く'],
    code: {
      kotlin: `val pre = LongArray(n + 1)
for (i in 0 until n) pre[i + 1] = pre[i] + a[i]
fun rangeSum(l: Int, r: Int): Long = pre[r] - pre[l]   // [l, r)`,
      python: `from itertools import accumulate
pre = [0] + list(accumulate(a))
def range_sum(l, r):
    return pre[r] - pre[l]       # [l, r)`,
      java: `long[] pre = new long[n + 1];
for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];
long rangeSum(int l, int r) { return pre[r] - pre[l]; }  // [l, r)`,
      cpp: `vector<ll> pre(n + 1, 0);
for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];
auto range_sum = [&](int l, int r) { return pre[r] - pre[l]; }; // [l,r)`,
    },
  },

  {
    id: 'prefix_2d',
    group: '累積和',
    title: '2次元累積和',
    sub: '長方形和 O(1)',
    state: `sum y:[y1,y2), x:[x1,x2)
ans = s[y2][x2] - s[y1][x2] - s[y2][x1] + s[y1][x1]
s は (H+1)×(W+1)`,
    note: '2D も 1 個ずらして持つ。長方形の上・左を引き、重複して引いた左上を足す。',
    pitfalls: ['y/x の順を固定する。grid[y][x] に合わせる', '右下 y2,x2 は含まない'],
    code: {
      kotlin: `val s = Array(h + 1) { LongArray(w + 1) }
for (y in 0 until h) for (x in 0 until w)
  s[y + 1][x + 1] = s[y + 1][x] + s[y][x + 1] - s[y][x] + a[y][x]
fun rect(y1: Int, x1: Int, y2: Int, x2: Int): Long =
  s[y2][x2] - s[y1][x2] - s[y2][x1] + s[y1][x1]`,
      python: `s = [[0] * (w + 1) for _ in range(h + 1)]
for y in range(h):
    for x in range(w):
        s[y+1][x+1] = s[y+1][x] + s[y][x+1] - s[y][x] + a[y][x]
def rect(y1, x1, y2, x2):
    return s[y2][x2] - s[y1][x2] - s[y2][x1] + s[y1][x1]`,
      java: `long[][] s = new long[h + 1][w + 1];
for (int y = 0; y < h; y++) for (int x = 0; x < w; x++)
  s[y + 1][x + 1] = s[y + 1][x] + s[y][x + 1] - s[y][x] + a[y][x];
long rect(int y1, int x1, int y2, int x2) {
  return s[y2][x2] - s[y1][x2] - s[y2][x1] + s[y1][x1];
}`,
      cpp: `vector<vector<ll>> s(h + 1, vector<ll>(w + 1, 0));
for (int y = 0; y < h; y++) for (int x = 0; x < w; x++)
  s[y+1][x+1] = s[y+1][x] + s[y][x+1] - s[y][x] + a[y][x];
auto rect = [&](int y1, int x1, int y2, int x2) {
  return s[y2][x2] - s[y1][x2] - s[y2][x1] + s[y1][x1];
};`,
    },
  },

  {
    id: 'imos_1d',
    group: 'いもす',
    title: '1次元いもす',
    sub: '区間加算',
    state: `add [l,r) += v:
diff[l] += v
diff[r] -= v
最後に左から累積して復元`,
    note: '大量の区間加算をまとめて処理する。更新は O(1)、最後の復元が O(N)。',
    pitfalls: ['diff は N+1 長。r==N に書くため', '問題文 [L,R] は [L-1,R) に変換して add'],
    code: {
      kotlin: `val diff = LongArray(n + 1)
fun add(l: Int, r: Int, v: Long) { diff[l] += v; diff[r] -= v } // [l,r)
val res = LongArray(n)
var cur = 0L
for (i in 0 until n) { cur += diff[i]; res[i] = cur }`,
      python: `diff = [0] * (n + 1)
def add(l, r, v):       # [l, r)
    diff[l] += v
    diff[r] -= v
res = []
cur = 0
for i in range(n):
    cur += diff[i]
    res.append(cur)`,
      java: `long[] diff = new long[n + 1];
void add(int l, int r, long v) { diff[l] += v; diff[r] -= v; } // [l,r)
long[] res = new long[n];
long cur = 0;
for (int i = 0; i < n; i++) { cur += diff[i]; res[i] = cur; }`,
      cpp: `vector<ll> diff(n + 1, 0);
auto add = [&](int l, int r, ll v) { diff[l] += v; diff[r] -= v; }; // [l,r)
vector<ll> res(n);
ll cur = 0;
for (int i = 0; i < n; i++) { cur += diff[i]; res[i] = cur; }`,
    },
  },

  {
    id: 'imos_2d',
    group: 'いもす',
    title: '2次元いもす',
    sub: '長方形加算',
    state: `add y:[y1,y2), x:[x1,x2) += v
d[y1][x1]+=v  d[y1][x2]-=v
d[y2][x1]-=v  d[y2][x2]+=v
横→縦に累積して復元`,
    note: '長方形への一括加算。差分に 4 点だけ打ち、あとで横方向・縦方向に累積する。',
    pitfalls: ['配列は (H+1)×(W+1)', '閉区間なら y2/x2 を +1 した半開区間に直す'],
    code: {
      kotlin: `val d = Array(h + 1) { LongArray(w + 1) }
fun add(y1: Int, x1: Int, y2: Int, x2: Int, v: Long) {
  d[y1][x1] += v; d[y1][x2] -= v; d[y2][x1] -= v; d[y2][x2] += v
}
for (y in 0..h) for (x in 0 until w) d[y][x + 1] += d[y][x]
for (x in 0..w) for (y in 0 until h) d[y + 1][x] += d[y][x]`,
      python: `d = [[0] * (w + 1) for _ in range(h + 1)]
def add(y1, x1, y2, x2, v):
    d[y1][x1] += v; d[y1][x2] -= v
    d[y2][x1] -= v; d[y2][x2] += v
for y in range(h + 1):
    for x in range(w): d[y][x + 1] += d[y][x]
for x in range(w + 1):
    for y in range(h): d[y + 1][x] += d[y][x]`,
      java: `long[][] d = new long[h + 1][w + 1];
void add(int y1, int x1, int y2, int x2, long v) {
  d[y1][x1] += v; d[y1][x2] -= v; d[y2][x1] -= v; d[y2][x2] += v;
}
for (int y = 0; y <= h; y++) for (int x = 0; x < w; x++) d[y][x + 1] += d[y][x];
for (int x = 0; x <= w; x++) for (int y = 0; y < h; y++) d[y + 1][x] += d[y][x];`,
      cpp: `vector<vector<ll>> d(h + 1, vector<ll>(w + 1, 0));
auto add = [&](int y1, int x1, int y2, int x2, ll v) {
  d[y1][x1] += v; d[y1][x2] -= v; d[y2][x1] -= v; d[y2][x2] += v;
};
for (int y = 0; y <= h; y++) for (int x = 0; x < w; x++) d[y][x + 1] += d[y][x];
for (int x = 0; x <= w; x++) for (int y = 0; y < h; y++) d[y + 1][x] += d[y][x];`,
    },
  },

  {
    id: 'difference',
    group: '差分',
    title: '隣接差分',
    sub: '変化点を見る',
    state: `a    = [3,3,5,5,2]
diff = [3,0,2,0,-3]
a[i] = diff[0] + ... + diff[i]
同じ値の連続 / 増減回数 / 区間加算の見方に使う`,
    note: '値そのものではなく「前との差」を見る。連続区間、変化点、階段状の操作で効く。',
    pitfalls: ['diff[0] は a[0] として持つと復元しやすい', '差分は負になり得るので符号付き型'],
    code: {
      kotlin: `val diff = LongArray(n)
diff[0] = a[0]
for (i in 1 until n) diff[i] = a[i] - a[i - 1]
// 復元
for (i in 1 until n) a[i] = a[i - 1] + diff[i]`,
      python: `diff = [0] * n
diff[0] = a[0]
for i in range(1, n):
    diff[i] = a[i] - a[i - 1]
# 復元
for i in range(1, n):
    a[i] = a[i - 1] + diff[i]`,
      java: `long[] diff = new long[n];
diff[0] = a[0];
for (int i = 1; i < n; i++) diff[i] = a[i] - a[i - 1];
// 復元
for (int i = 1; i < n; i++) a[i] = a[i - 1] + diff[i];`,
      cpp: `vector<ll> diff(n);
diff[0] = a[0];
for (int i = 1; i < n; i++) diff[i] = a[i] - a[i - 1];
// 復元
for (int i = 1; i < n; i++) a[i] = a[i - 1] + diff[i];`,
    },
  },

  {
    id: 'prefix_bisect',
    group: '応用',
    title: '累積和 + 二分探索',
    sub: '条件を満たす右端',
    state: `非負 a なら pre は単調
pre[r] - pre[l] >= K
pre[r] >= pre[l] + K
lower_bound(pre, pre[l]+K) で最小 r`,
    note: '非負配列では累積和が単調になる。区間和の条件を lower_bound に変換できる。',
    pitfalls: ['負数があると pre は単調でなくなり使えない', 'r は l より右。pre は長さ N+1'],
    code: {
      kotlin: `// a は非負。各 l から sum[l,r) >= k の最小 r
for (l in 0 until n) {
  val target = pre[l] + k
  val r = lowerBound(pre, target)
  if (r <= n) { /* [l, r) が条件を満たす */ }
}`,
      python: `# a は非負。各 l から sum[l,r) >= k の最小 r
from bisect import bisect_left
for l in range(n):
    target = pre[l] + k
    r = bisect_left(pre, target)
    if r <= n:
        pass`,
      java: `// a は非負。各 l から sum[l,r) >= k の最小 r
for (int l = 0; l < n; l++) {
  long target = pre[l] + k;
  int r = lowerBound(pre, target);
  if (r <= n) { /* [l, r) が条件を満たす */ }
}`,
      cpp: `// a は非負。各 l から sum[l,r) >= k の最小 r
for (int l = 0; l < n; l++) {
  ll target = pre[l] + k;
  int r = lower_bound(pre.begin(), pre.end(), target) - pre.begin();
  if (r <= n) { /* [l, r) が条件を満たす */ }
}`,
    },
  },

  {
    id: 'checklist',
    group: '確認',
    title: '区間 WA チェック',
    sub: '本番の見直し',
    state: `1. 入力は 0-index に直した?
2. [l,r) と [l,r] を混ぜてない?
3. r==N に書く配列は N+1 長?
4. Long で足している?
5. 2D は y,x の順が一致している?`,
    note: 'サンプルが 1 ずれる、端だけ合わない、RE する時に見るチェックリスト。',
    pitfalls: ['端点の +1/-1 をその場で直さず、最初に半開区間へ変換する', '図を 0,1,2,... で書くとミスが減る'],
    code: {
      kotlin: `// 閉区間入力を読んだ直後に変換
val l = nextInt() - 1
val r = nextInt()
// 以後は [l, r) だけで考える`,
      python: `# 閉区間入力を読んだ直後に変換
l, r = map(int, input().split())
l -= 1
# 以後は [l, r) だけで考える`,
      java: `// 閉区間入力を読んだ直後に変換
int l = nextInt() - 1;
int r = nextInt();
// 以後は [l, r) だけで考える`,
      cpp: `// 閉区間入力を読んだ直後に変換
int l, r; cin >> l >> r;
l--;
// 以後は [l, r) だけで考える`,
    },
  },
]
