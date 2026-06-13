// 単一の正本データ。ここから build.mjs が 4 言語分の印刷用 HTML を生成する。
// code は素のテキスト (生成時に HTML エスケープ + コメント色付け)。
// 関数/クラス名は 4 言語で揃え、verify.mjs のテストから同じ名前で叩ける。

export const LANGS = [
  { id: 'kotlin', label: 'Kotlin', ext: 'kt' },
  { id: 'python', label: 'Python', ext: 'py' },
  { id: 'java', label: 'Java', ext: 'java' },
  { id: 'cpp', label: 'C++', ext: 'cpp' },
]

export const snippets = [
  {
    id: 'union_find',
    cat: 'ds',
    title: 'Union-Find',
    sub: '素集合・連結判定',
    cx: 'ほぼ O(α(N))',
    lead: '経路圧縮 + size 併合。連結判定 / グループ分け / Kruskal。union は併合したら true。',
    diagram: `init   0  1  2  3  4   (各自が根)
u(0,1) 0──1  2  3  4
u(2,3) 0──1  2──3  4
u(1,2) 0──1──2──3  4   same(0,3)=T size=4
find: 根まで辿り親を直付け(経路圧縮)`,
    pitfalls: ['size(小)を size(大)に繋ぐ(union by size)で木を低く保つ', '辺の削除はできない(追加のみ)。削除込みは別手法'],
    code: {
      kotlin: `class UnionFind(n: Int) {
  val par = IntArray(n) { it }
  val sz = IntArray(n) { 1 }
  fun find(x: Int): Int {
    if (par[x] == x) return x
    par[x] = find(par[x]); return par[x]
  }
  fun union(a: Int, b: Int): Boolean {
    var ra = find(a); var rb = find(b)
    if (ra == rb) return false
    if (sz[ra] < sz[rb]) { val t = ra; ra = rb; rb = t }
    par[rb] = ra; sz[ra] += sz[rb]; return true
  }
  fun same(a: Int, b: Int) = find(a) == find(b)
  fun size(x: Int) = sz[find(x)]
}`,
      python: `class UnionFind:
    def __init__(self, n):
        self.par = list(range(n))
        self.sz = [1] * n
    def find(self, x):
        while self.par[x] != x:
            self.par[x] = self.par[self.par[x]]   # 経路圧縮(半分)
            x = self.par[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.sz[ra] < self.sz[rb]:
            ra, rb = rb, ra
        self.par[rb] = ra
        self.sz[ra] += self.sz[rb]
        return True
    def same(self, a, b):
        return self.find(a) == self.find(b)
    def size(self, x):
        return self.sz[self.find(x)]`,
      java: `class UnionFind {
  int[] par, sz;
  UnionFind(int n) {
    par = new int[n]; sz = new int[n];
    for (int i = 0; i < n; i++) { par[i] = i; sz[i] = 1; }
  }
  int find(int x) { return par[x] == x ? x : (par[x] = find(par[x])); }
  boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;
    if (sz[ra] < sz[rb]) { int t = ra; ra = rb; rb = t; }
    par[rb] = ra; sz[ra] += sz[rb]; return true;
  }
  boolean same(int a, int b) { return find(a) == find(b); }
  int size(int x) { return sz[find(x)]; }
}`,
      cpp: `struct UnionFind {
  vector<int> par, sz;
  UnionFind(int n) : par(n), sz(n, 1) { iota(par.begin(), par.end(), 0); }
  int find(int x) { return par[x] == x ? x : par[x] = find(par[x]); }
  bool unite(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;
    if (sz[ra] < sz[rb]) swap(ra, rb);
    par[rb] = ra; sz[ra] += sz[rb]; return true;
  }
  bool same(int a, int b) { return find(a) == find(b); }
  int size(int x) { return sz[find(x)]; }
};`,
    },
  },

  {
    id: 'fenwick',
    cat: 'ds',
    title: 'BIT (Fenwick)',
    sub: '点加算 + 区間和 / 転倒数',
    cx: 'O(log N)',
    lead: '点加算・前方和を O(log N)。転倒数は「右より小さい既出要素の総数」で求まる。',
    diagram: `idx は (i & -i) 幅を管理
add(i,v): x += x & -x で上る
sum(i):   x -= x & -x で下り a[0..i] の和
区間 [l,r] = sum(r) - sum(l-1)
転倒数: 後ろから add しつつ sum(a[i]-1)`,
    pitfalls: ['1-indexed で持つ(内部 x=i+1)。0 を add する値域に注意', '区間和は IntArray.sum() でなく Long で(溢れ)'],
    code: {
      kotlin: `class BIT(val n: Int) {
  val t = LongArray(n + 1)
  fun add(i: Int, v: Long) {
    var x = i + 1
    while (x <= n) { t[x] += v; x += x and -x }
  }
  fun sum(i: Int): Long {           // a[0..i]
    var x = i + 1; var s = 0L
    while (x > 0) { s += t[x]; x -= x and -x }
    return s
  }
}
fun inversions(a: IntArray): Long {
  val bit = BIT((a.maxOrNull() ?: 0) + 1); var res = 0L
  for (i in a.indices.reversed()) {
    if (a[i] > 0) res += bit.sum(a[i] - 1)
    bit.add(a[i], 1)
  }
  return res
}`,
      python: `class BIT:
    def __init__(self, n):
        self.n = n
        self.t = [0] * (n + 1)
    def add(self, i, v):
        x = i + 1
        while x <= self.n:
            self.t[x] += v
            x += x & -x
    def sum(self, i):                 # a[0..i]
        x, s = i + 1, 0
        while x > 0:
            s += self.t[x]
            x -= x & -x
        return s

def inversions(a):
    bit = BIT((max(a) if a else 0) + 1)
    res = 0
    for x in reversed(a):
        if x > 0:
            res += bit.sum(x - 1)
        bit.add(x, 1)
    return res`,
      java: `class BIT {
  int n; long[] t;
  BIT(int n) { this.n = n; t = new long[n + 1]; }
  void add(int i, long v) { for (int x = i + 1; x <= n; x += x & -x) t[x] += v; }
  long sum(int i) {                   // a[0..i]
    long s = 0;
    for (int x = i + 1; x > 0; x -= x & -x) s += t[x];
    return s;
  }
}
static long inversions(int[] a) {
  int mx = 0; for (int x : a) mx = Math.max(mx, x);
  BIT bit = new BIT(mx + 1); long res = 0;
  for (int i = a.length - 1; i >= 0; i--) {
    if (a[i] > 0) res += bit.sum(a[i] - 1);
    bit.add(a[i], 1);
  }
  return res;
}`,
      cpp: `struct BIT {
  int n; vector<ll> t;
  BIT(int n) : n(n), t(n + 1, 0) {}
  void add(int i, ll v) { for (int x = i + 1; x <= n; x += x & -x) t[x] += v; }
  ll sum(int i) {                     // a[0..i]
    ll s = 0;
    for (int x = i + 1; x > 0; x -= x & -x) s += t[x];
    return s;
  }
};
ll inversions(vector<int>& a) {
  int mx = 0; for (int x : a) mx = max(mx, x);
  BIT bit(mx + 1); ll res = 0;
  for (int i = (int)a.size() - 1; i >= 0; i--) {
    if (a[i] > 0) res += bit.sum(a[i] - 1);
    bit.add(a[i], 1);
  }
  return res;
}`,
    },
  },

  {
    id: 'dijkstra',
    cat: 'graph',
    title: 'Dijkstra 法',
    sub: '単一始点・非負重み最短路',
    cx: 'O((V+E) log V)',
    lead: '優先度キューで未確定のうち最小距離の頂点を順に確定。負辺があると使えない(→Bellman-Ford)。',
    diagram: `(0)──5──▶(1)   start = 0
 │        ▲    init  dist=[0, ∞, ∞]
 2        1    pop0  1=5 2=2 →[0,5,2]
 ▼        │    pop2  1=2+1=3 →[0,3,2]
(2)───────┘    pop1  settled
0▶1:5 0▶2:2 2▶1:1      ans [0,3,2]`,
    pitfalls: ['if (d > dist[v]) continue を必ず入れる(古い距離を捨てる、無いと TLE)', 'INF は加算で溢れない値に。C++ 4e18 / 他 LONG_MAX/4', '経路復元は prev[to]=v を更新し終点から逆順'],
    code: {
      kotlin: `import java.util.PriorityQueue
// g[v] = (to, cost) の隣接リスト
fun dijkstra(g: Array<MutableList<Pair<Int, Long>>>, s: Int): LongArray {
  val dist = LongArray(g.size) { Long.MAX_VALUE / 4 }; dist[s] = 0
  val pq = PriorityQueue<Pair<Long, Int>>(compareBy { it.first })
  pq.add(0L to s)
  while (pq.isNotEmpty()) {
    val (d, v) = pq.poll()
    if (d > dist[v]) continue          // 古い距離は捨てる
    for ((to, c) in g[v]) if (d + c < dist[to]) {
      dist[to] = d + c; pq.add(dist[to] to to)
    }
  }
  return dist
}`,
      python: `import heapq
# g[v] = list of (to, cost)
def dijkstra(g, s):
    dist = [float('inf')] * len(g); dist[s] = 0
    pq = [(0, s)]                       # (dist, vertex)
    while pq:
        d, v = heapq.heappop(pq)
        if d > dist[v]:
            continue                    # 古い距離は捨てる
        for to, c in g[v]:
            if d + c < dist[to]:
                dist[to] = d + c
                heapq.heappush(pq, (dist[to], to))
    return dist`,
      java: `// g[v] = list of {to, cost}
static long[] dijkstra(List<long[]>[] g, int s) {
  long[] dist = new long[g.length];
  Arrays.fill(dist, Long.MAX_VALUE / 4); dist[s] = 0;
  PriorityQueue<long[]> pq =
    new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
  pq.add(new long[]{0, s});
  while (!pq.isEmpty()) {
    long[] t = pq.poll(); long d = t[0]; int v = (int) t[1];
    if (d > dist[v]) continue;          // 古い距離は捨てる
    for (long[] e : g[v]) {
      int to = (int) e[0]; long c = e[1];
      if (d + c < dist[to]) { dist[to] = d + c; pq.add(new long[]{dist[to], to}); }
    }
  }
  return dist;
}`,
      cpp: `// g[v] = vector of {to, cost}
vector<ll> dijkstra(vector<vector<pair<int, ll>>>& g, int s) {
  vector<ll> dist(g.size(), 4e18); dist[s] = 0;
  priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
  pq.push({0, s});
  while (!pq.empty()) {
    auto [d, v] = pq.top(); pq.pop();
    if (d > dist[v]) continue;          // 古い距離は捨てる
    for (auto [to, c] : g[v])
      if (d + c < dist[to]) { dist[to] = d + c; pq.push({dist[to], to}); }
  }
  return dist;
}`,
    },
  },

  {
    id: 'grid_bfs',
    cat: 'graph',
    title: 'グリッド BFS',
    sub: '迷路・最少手数',
    cx: 'O(HW)',
    lead: '4 近傍を距離 +1 で push。壁 # と訪問済みは skip。最短手数 = 到達時の dist。',
    diagram: `grid (#=壁)        dist from S
S . . #            0 1 2 #
. # . .            1 # 3 4
. . . G            2 3 4 5
4近傍↑↓←→を BFS → G = 5`,
    pitfalls: ['到達不可は -1 のまま', '8 近傍や重み付きは別 (重みは 0-1 BFS / Dijkstra)'],
    code: {
      kotlin: `val DY = intArrayOf(-1, 1, 0, 0)
val DX = intArrayOf(0, 0, -1, 1)
fun gridBfs(grid: Array<String>, sy: Int, sx: Int): Array<IntArray> {
  val h = grid.size; val w = grid[0].length
  val dist = Array(h) { IntArray(w) { -1 } }
  dist[sy][sx] = 0
  val q = ArrayDeque<Int>(); q.add(sy * w + sx)
  while (q.isNotEmpty()) {
    val p = q.removeFirst(); val y = p / w; val x = p % w
    for (d in 0 until 4) {
      val ny = y + DY[d]; val nx = x + DX[d]
      if (ny !in 0 until h || nx !in 0 until w) continue
      if (grid[ny][nx] == '#' || dist[ny][nx] != -1) continue
      dist[ny][nx] = dist[y][x] + 1; q.add(ny * w + nx)
    }
  }
  return dist
}`,
      python: `from collections import deque
def grid_bfs(grid, sy, sx):
    h, w = len(grid), len(grid[0])
    dist = [[-1] * w for _ in range(h)]
    dist[sy][sx] = 0
    q = deque([(sy, sx)])
    while q:
        y, x = q.popleft()
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = y + dy, x + dx
            if not (0 <= ny < h and 0 <= nx < w):
                continue
            if grid[ny][nx] == '#' or dist[ny][nx] != -1:
                continue
            dist[ny][nx] = dist[y][x] + 1
            q.append((ny, nx))
    return dist`,
      java: `static int[][] gridBfs(char[][] grid, int sy, int sx) {
  int h = grid.length, w = grid[0].length;
  int[][] dist = new int[h][w];
  for (int[] row : dist) Arrays.fill(row, -1);
  int[] dy = {-1, 1, 0, 0}, dx = {0, 0, -1, 1};
  dist[sy][sx] = 0;
  ArrayDeque<int[]> q = new ArrayDeque<>();
  q.add(new int[]{sy, sx});
  while (!q.isEmpty()) {
    int[] c = q.poll(); int y = c[0], x = c[1];
    for (int d = 0; d < 4; d++) {
      int ny = y + dy[d], nx = x + dx[d];
      if (ny < 0 || ny >= h || nx < 0 || nx >= w) continue;
      if (grid[ny][nx] == '#' || dist[ny][nx] != -1) continue;
      dist[ny][nx] = dist[y][x] + 1;
      q.add(new int[]{ny, nx});
    }
  }
  return dist;
}`,
      cpp: `vector<vector<int>> grid_bfs(vector<string>& grid, int sy, int sx) {
  int h = grid.size(), w = grid[0].size();
  vector<vector<int>> dist(h, vector<int>(w, -1));
  int dy[] = {-1, 1, 0, 0}, dx[] = {0, 0, -1, 1};
  dist[sy][sx] = 0;
  queue<pair<int, int>> q; q.push({sy, sx});
  while (!q.empty()) {
    auto [y, x] = q.front(); q.pop();
    for (int d = 0; d < 4; d++) {
      int ny = y + dy[d], nx = x + dx[d];
      if (ny < 0 || ny >= h || nx < 0 || nx >= w) continue;
      if (grid[ny][nx] == '#' || dist[ny][nx] != -1) continue;
      dist[ny][nx] = dist[y][x] + 1;
      q.push({ny, nx});
    }
  }
  return dist;
}`,
    },
  },

  {
    id: 'binary_search',
    cat: 'search',
    title: '二分探索',
    sub: 'めぐる式 / lower・upper bound',
    cx: 'O(log N)',
    lead: '答えの単調性(F..FT..T)で二分。ok=満たす側, ng=満たさない側の初期値を渡す。',
    diagram: `pred 単調:  F F F T T T
            ng ──┬── ok   m=(ok+ng)/2
lowerBound: a[i] >= x の最小 i
upperBound: a[i] >  x の最小 i
[1 3 3 5 7] x=3 → lower=1 upper=3 個数=2`,
    pitfalls: ['ok/ng の向きを取り違えない(満たす側が ok)', 'mid の溢れ: (lo+hi)/2 より lo+(hi-lo)/2 が安全', '値が無い場合の lowerBound は size を返す'],
    code: {
      kotlin: `// pred(ok)=true, pred(ng)=false となる初期値を渡す
fun bisect(okInit: Long, ngInit: Long, pred: (Long) -> Boolean): Long {
  var ok = okInit; var ng = ngInit
  while (Math.abs(ok - ng) > 1) {
    val m = (ok + ng) / 2
    if (pred(m)) ok = m else ng = m
  }
  return ok
}
fun lowerBound(a: LongArray, x: Long): Int {   // a[i] >= x の最小 i
  var lo = -1; var hi = a.size
  while (hi - lo > 1) { val m = (lo + hi) / 2; if (a[m] >= x) hi = m else lo = m }
  return hi
}
fun upperBound(a: LongArray, x: Long): Int {   // a[i] > x の最小 i
  var lo = -1; var hi = a.size
  while (hi - lo > 1) { val m = (lo + hi) / 2; if (a[m] > x) hi = m else lo = m }
  return hi
}`,
      python: `# pred(ok)=True, pred(ng)=False となる初期値を渡す
def bisect_meguru(ok, ng, pred):
    while abs(ok - ng) > 1:
        m = (ok + ng) // 2
        if pred(m):
            ok = m
        else:
            ng = m
    return ok
# 配列なら標準ライブラリが速い:
from bisect import bisect_left, bisect_right
# bisect_left(a, x)  -> a[i] >= x の最小 i (lower_bound)
# bisect_right(a, x) -> a[i] >  x の最小 i (upper_bound)`,
      java: `// pred(ok)=true, pred(ng)=false となる初期値を渡す
static long bisect(long ok, long ng, java.util.function.LongPredicate pred) {
  while (Math.abs(ok - ng) > 1) {
    long m = ok + (ng - ok) / 2;      // 溢れ対策
    if (pred.test(m)) ok = m; else ng = m;
  }
  return ok;
}
static int lowerBound(long[] a, long x) {   // a[i] >= x の最小 i
  int lo = -1, hi = a.length;
  while (hi - lo > 1) { int m = (lo + hi) >>> 1; if (a[m] >= x) hi = m; else lo = m; }
  return hi;
}
static int upperBound(long[] a, long x) {   // a[i] > x の最小 i
  int lo = -1, hi = a.length;
  while (hi - lo > 1) { int m = (lo + hi) >>> 1; if (a[m] > x) hi = m; else lo = m; }
  return hi;
}`,
      cpp: `// pred(ok)=true, pred(ng)=false となる初期値を渡す
template <class F>
ll bisect(ll ok, ll ng, F pred) {
  while (abs(ok - ng) > 1) { ll m = ok + (ng - ok) / 2; (pred(m) ? ok : ng) = m; }
  return ok;
}
// 配列なら標準が速い:
//   lower_bound(a.begin(), a.end(), x) - a.begin()  // a[i] >= x
//   upper_bound(a.begin(), a.end(), x) - a.begin()  // a[i] >  x`,
    },
  },

  {
    id: 'prefix_sum',
    cat: 'util',
    title: '累積和 / いもす法',
    sub: '区間和 O(1) / 区間加算',
    cx: '前計算 O(N), クエリ O(1)',
    lead: '累積和で区間和を O(1)。逆操作のいもす法は「区間加算を大量 → 最後に復元」。',
    diagram: `a   = [1 2 3 4 5]
sum = [0 1 3 6 10 15]   (1個ずれ)
区間 [l,r) = sum[r] - sum[l]   [1,4)=9
いもす: add(l,r,v)= diff[l]+=v; diff[r]-=v
        最後に累積和で復元`,
    pitfalls: ['sum は長さ N+1。区間は半開 [l, r) で扱うと添字ミスが減る', 'いもす法は右端 r を「含まない」位置に -v'],
    code: {
      kotlin: `fun prefixSum(a: LongArray): LongArray {   // s[i]=a[0..i-1]; [l,r)=s[r]-s[l]
  val s = LongArray(a.size + 1)
  for (i in a.indices) s[i + 1] = s[i] + a[i]
  return s
}
class Imos(n: Int) {
  val diff = LongArray(n + 1)
  fun add(l: Int, r: Int, v: Long) { diff[l] += v; diff[r] -= v }   // a[l..r-1]+=v
  fun build(): LongArray {
    val res = LongArray(diff.size - 1); var acc = 0L
    for (i in res.indices) { acc += diff[i]; res[i] = acc }
    return res
  }
}`,
      python: `from itertools import accumulate
def prefix_sum(a):                          # s[i]=a[0..i-1]; [l,r)=s[r]-s[l]
    return list(accumulate(a, initial=0))

class Imos:
    def __init__(self, n):
        self.diff = [0] * (n + 1)
    def add(self, l, r, v):                 # a[l..r-1] += v
        self.diff[l] += v
        self.diff[r] -= v
    def build(self):
        return list(accumulate(self.diff))[:-1]`,
      java: `static long[] prefixSum(long[] a) {          // s[i]=a[0..i-1]; [l,r)=s[r]-s[l]
  long[] s = new long[a.length + 1];
  for (int i = 0; i < a.length; i++) s[i + 1] = s[i] + a[i];
  return s;
}
class Imos {
  long[] diff;
  Imos(int n) { diff = new long[n + 1]; }
  void add(int l, int r, long v) { diff[l] += v; diff[r] -= v; }   // a[l..r-1]+=v
  long[] build() {
    long[] res = new long[diff.length - 1]; long acc = 0;
    for (int i = 0; i < res.length; i++) { acc += diff[i]; res[i] = acc; }
    return res;
  }
}`,
      cpp: `vector<ll> prefix_sum(vector<ll>& a) {       // s[i]=a[0..i-1]; [l,r)=s[r]-s[l]
  vector<ll> s(a.size() + 1, 0);
  for (size_t i = 0; i < a.size(); i++) s[i + 1] = s[i] + a[i];
  return s;
}
struct Imos {
  vector<ll> diff;
  Imos(int n) : diff(n + 1, 0) {}
  void add(int l, int r, ll v) { diff[l] += v; diff[r] -= v; }   // a[l..r-1]+=v
  vector<ll> build() {
    vector<ll> res(diff.size() - 1); ll acc = 0;
    for (size_t i = 0; i < res.size(); i++) { acc += diff[i]; res[i] = acc; }
    return res;
  }
};`,
    },
  },

  {
    id: 'modmath',
    cat: 'math',
    title: 'mod 演算 / nCr',
    sub: 'modpow・modinv・組合せ',
    cx: 'O(log N) / 前計算 O(N)',
    lead: 'modpow は繰返し二乗法。modinv はフェルマー(m素数で a^(m-2))。nCr は階乗逆元の前計算。',
    diagram: `modpow(a,e): e を 2 進で繰返し二乗
  a^13 = a^8 · a^4 · a^1   (13 = 1101)
modinv(a) = a^(m-2) mod m   (m 素数)
nCr = fact[n]·inv[r]·inv[n-r]   前計算 O(n)`,
    pitfalls: ['MOD は問題指定 (998244353 か 1e9+7) を必ず確認', '掛け算ごとに % を取る(2 回掛けたら溢れる手前で)', 'Python は組み込み pow(a,e,m) が最速'],
    code: {
      kotlin: `const val MOD = 998244353L              // or 1_000_000_007L
fun modpow(a: Long, e: Long, m: Long = MOD): Long {
  var b = a % m; var x = e; var r = 1L
  while (x > 0) { if (x and 1L == 1L) r = r * b % m; b = b * b % m; x = x shr 1 }
  return r
}
fun modinv(a: Long, m: Long = MOD) = modpow(a, m - 2, m)   // m は素数
class Comb(maxN: Int, val m: Long = MOD) {
  val fact = LongArray(maxN + 1); val inv = LongArray(maxN + 1)
  init {
    fact[0] = 1
    for (i in 1..maxN) fact[i] = fact[i - 1] * i % m
    inv[maxN] = modpow(fact[maxN], m - 2, m)
    for (i in maxN downTo 1) inv[i - 1] = inv[i] * i % m
  }
  fun nCr(n: Int, r: Int) =
    if (r < 0 || r > n) 0 else fact[n] * inv[r] % m * inv[n - r] % m
}`,
      python: `MOD = 998244353                          # or 10**9 + 7
def modpow(a, e, m=MOD):
    return pow(a, e, m)                  # 組み込み pow が高速
def modinv(a, m=MOD):
    return pow(a, m - 2, m)              # m は素数
class Comb:
    def __init__(self, max_n, m=MOD):
        self.m = m
        self.fact = [1] * (max_n + 1)
        for i in range(1, max_n + 1):
            self.fact[i] = self.fact[i - 1] * i % m
        self.inv = [1] * (max_n + 1)
        self.inv[max_n] = pow(self.fact[max_n], m - 2, m)
        for i in range(max_n, 0, -1):
            self.inv[i - 1] = self.inv[i] * i % m
    def nCr(self, n, r):
        if r < 0 or r > n:
            return 0
        return self.fact[n] * self.inv[r] % self.m * self.inv[n - r] % self.m`,
      java: `static final long MOD = 998244353L;     // or 1_000_000_007L
static long modpow(long a, long e, long m) {
  long b = a % m, r = 1;
  while (e > 0) { if ((e & 1) == 1) r = r * b % m; b = b * b % m; e >>= 1; }
  return r;
}
static long modinv(long a, long m) { return modpow(a, m - 2, m); }   // m は素数
class Comb {
  long m; long[] fact, inv;
  Comb(int maxN, long m) {
    this.m = m; fact = new long[maxN + 1]; inv = new long[maxN + 1];
    fact[0] = 1;
    for (int i = 1; i <= maxN; i++) fact[i] = fact[i - 1] * i % m;
    inv[maxN] = modpow(fact[maxN], m - 2, m);
    for (int i = maxN; i >= 1; i--) inv[i - 1] = inv[i] * i % m;
  }
  long nCr(int n, int r) {
    if (r < 0 || r > n) return 0;
    return fact[n] * inv[r] % m * inv[n - r] % m;
  }
}`,
      cpp: `const ll MOD = 998244353;               // or 1000000007
ll modpow(ll a, ll e, ll m = MOD) {
  ll b = a % m, r = 1;
  while (e > 0) { if (e & 1) r = r * b % m; b = b * b % m; e >>= 1; }
  return r;
}
ll modinv(ll a, ll m = MOD) { return modpow(a, m - 2, m); }   // m は素数
struct Comb {
  ll m; vector<ll> fact, inv;
  Comb(int maxN, ll m = MOD) : m(m), fact(maxN + 1), inv(maxN + 1) {
    fact[0] = 1;
    for (int i = 1; i <= maxN; i++) fact[i] = fact[i - 1] * i % m;
    inv[maxN] = modpow(fact[maxN], m - 2, m);
    for (int i = maxN; i >= 1; i--) inv[i - 1] = inv[i] * i % m;
  }
  ll nCr(int n, int r) {
    if (r < 0 || r > n) return 0;
    return fact[n] * inv[r] % m * inv[n - r] % m;
  }
};`,
    },
  },

  {
    id: 'sieve',
    cat: 'math',
    title: 'エラトステネスの篩',
    sub: '素数列挙',
    cx: 'O(N log log N)',
    lead: 'isPrime[i] を一括計算。i*i から消すのがポイント。約数/素因数のクエリが多いなら最小素因数表へ。',
    diagram: `2 3 4 5 6 7 8 9 10 ...
2の倍数除外 → 3の → 5の → ...
消す開始は i*i (それ未満は既出)
残り = 素数  例) ~20: 2 3 5 7 11 13 17 19`,
    pitfalls: ['i*i がオーバーフローするなら long で比較', '0,1 は素数でない(初期化で false)'],
    code: {
      kotlin: `fun sieve(n: Int): BooleanArray {      // isPrime[i]
  val p = BooleanArray(n + 1) { it >= 2 }
  var i = 2
  while (i * i <= n) {
    if (p[i]) { var j = i * i; while (j <= n) { p[j] = false; j += i } }
    i++
  }
  return p
}`,
      python: `def sieve(n):                          # is_prime[i]
    p = [True] * (n + 1)
    p[0] = p[1] = False
    i = 2
    while i * i <= n:
        if p[i]:
            for j in range(i * i, n + 1, i):
                p[j] = False
        i += 1
    return p`,
      java: `static boolean[] sieve(int n) {        // isPrime[i]
  boolean[] p = new boolean[n + 1];
  Arrays.fill(p, 2, n + 1, true);
  for (int i = 2; (long) i * i <= n; i++)
    if (p[i]) for (int j = i * i; j <= n; j += i) p[j] = false;
  return p;
}`,
      cpp: `vector<char> sieve(int n) {            // is_prime[i]
  vector<char> p(n + 1, 1); p[0] = p[1] = 0;
  for (int i = 2; (ll) i * i <= n; i++)
    if (p[i]) for (int j = i * i; j <= n; j += i) p[j] = 0;
  return p;
}`,
    },
  },

  {
    id: 'gcd',
    cat: 'math',
    title: 'gcd / lcm / extGcd',
    sub: 'ユークリッドの互除法',
    cx: 'O(log N)',
    lead: 'gcd は互除法。lcm は先に割って溢れ防止。extGcd は ax+by=gcd の (x,y) も求める(mod 逆元・不定方程式)。',
    diagram: `gcd(a,b) = gcd(b, a%b),  gcd(a,0)=a
 gcd(12,18)=gcd(18,12)=gcd(12,6)=gcd(6,0)=6
lcm = a / gcd · b    (先に割る)
extGcd: ax + by = gcd の x,y も返す`,
    pitfalls: ['lcm は a*b が溢れる → a/gcd*b の順', '負数の gcd 符号に注意(必要なら abs)'],
    code: {
      kotlin: `tailrec fun gcd(a: Long, b: Long): Long = if (b == 0L) a else gcd(b, a % b)
fun lcm(a: Long, b: Long): Long = a / gcd(a, b) * b
// ax + by = gcd(a,b) の (g, x, y)
fun extGcd(a: Long, b: Long): Triple<Long, Long, Long> {
  if (b == 0L) return Triple(a, 1L, 0L)
  val (g, x, y) = extGcd(b, a % b)
  return Triple(g, y, x - (a / b) * y)
}`,
      python: `from math import gcd                 # 標準で gcd / lcm(3.9+)
def lcm(a, b):
    return a // gcd(a, b) * b
def ext_gcd(a, b):                  # ax+by=gcd の (g, x, y)
    if b == 0:
        return a, 1, 0
    g, x, y = ext_gcd(b, a % b)
    return g, y, x - (a // b) * y`,
      java: `static long gcd(long a, long b) { return b == 0 ? a : gcd(b, a % b); }
static long lcm(long a, long b) { return a / gcd(a, b) * b; }
// ax + by = gcd; 返り値 {g, x, y}
static long[] extGcd(long a, long b) {
  if (b == 0) return new long[]{a, 1, 0};
  long[] r = extGcd(b, a % b);
  return new long[]{r[0], r[2], r[1] - (a / b) * r[2]};
}`,
      cpp: `ll gcdll(ll a, ll b) { return b == 0 ? a : gcdll(b, a % b); }   // C++17 は std::gcd
ll lcmll(ll a, ll b) { return a / gcdll(a, b) * b; }
// ax + by = gcd を返し、x,y を参照で受け取る
ll ext_gcd(ll a, ll b, ll& x, ll& y) {
  if (b == 0) { x = 1; y = 0; return a; }
  ll x1, y1, g = ext_gcd(b, a % b, x1, y1);
  x = y1; y = x1 - (a / b) * y1;
  return g;
}`,
    },
  },

  {
    id: 'knapsack',
    cat: 'dp',
    title: 'ナップサック / 部分和',
    sub: '0-1 / 個数制限 DP',
    cx: 'O(NW)',
    lead: '容量ごとの最大価値。0-1 は重さを逆順ループ(各品物1回)。部分和は価値の代わりに可否を持つ。',
    diagram: `品物(w,v), 容量cap. dp[w]=容量wの最大価値
for 品物: for w = cap .. wi  (逆順!):
   dp[w] = max(dp[w], dp[w-wi] + vi)
逆順=各品物1回。正順だと無制限個
部分和: dp[s] = s を作れるか (bool)`,
    pitfalls: ['0-1 は必ず容量を逆順。正順にすると無制限ナップサックになる', '価値は溢れうる → Long で持つ'],
    code: {
      kotlin: `// 0-1: 各品物 1 個まで
fun knapsack01(w: IntArray, v: LongArray, cap: Int): Long {
  val dp = LongArray(cap + 1)
  for (i in w.indices)
    for (j in cap downTo w[i])           // 重さ逆順
      dp[j] = maxOf(dp[j], dp[j - w[i]] + v[i])
  return dp[cap]
}
fun subsetSum(a: IntArray, target: Int): Boolean {
  val dp = BooleanArray(target + 1); dp[0] = true
  for (x in a) for (s in target downTo x) if (dp[s - x]) dp[s] = true
  return dp[target]
}`,
      python: `def knapsack01(w, v, cap):               # 各品物 1 個まで
    dp = [0] * (cap + 1)
    for wi, vi in zip(w, v):
        for j in range(cap, wi - 1, -1):    # 重さ逆順
            dp[j] = max(dp[j], dp[j - wi] + vi)
    return dp[cap]

def subset_sum(a, target):               # bitset で高速化
    dp = 1                                # s ビット目 = s を作れるか
    for x in a:
        dp |= dp << x
    return (dp >> target) & 1 == 1`,
      java: `// 0-1: 各品物 1 個まで
static long knapsack01(int[] w, long[] v, int cap) {
  long[] dp = new long[cap + 1];
  for (int i = 0; i < w.length; i++)
    for (int j = cap; j >= w[i]; j--)      // 重さ逆順
      dp[j] = Math.max(dp[j], dp[j - w[i]] + v[i]);
  return dp[cap];
}
static boolean subsetSum(int[] a, int target) {
  boolean[] dp = new boolean[target + 1]; dp[0] = true;
  for (int x : a) for (int s = target; s >= x; s--) if (dp[s - x]) dp[s] = true;
  return dp[target];
}`,
      cpp: `// 0-1: 各品物 1 個まで
ll knapsack01(vector<int>& w, vector<ll>& v, int cap) {
  vector<ll> dp(cap + 1, 0);
  for (size_t i = 0; i < w.size(); i++)
    for (int j = cap; j >= w[i]; j--)       // 重さ逆順
      dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
  return dp[cap];
}
bool subset_sum(vector<int>& a, int target) {
  vector<char> dp(target + 1, 0); dp[0] = 1;
  for (int x : a) for (int s = target; s >= x; s--) if (dp[s - x]) dp[s] = 1;
  return dp[target];
}`,
    },
  },

  {
    id: 'segment_tree',
    cat: 'ds',
    title: 'セグメント木',
    sub: '点更新 + 区間クエリ',
    cx: 'O(log N)',
    lead: '非再帰・抽象化。op はモノイド(結合的 + 単位元 unit)。min/max/和などを区間で。',
    diagram: `[5 3 7 1 9] を min セグ木に
         [1]            ← 全体 min
      [3]    [9]
   [3][7] [9][∞]
 [5][3][7][1][9]
update(i,v): 葉→根  query[l,r): 両端から畳む`,
    pitfalls: ['query は半開 [l, r)', 'unit は演算の単位元 (min→∞, max→-∞, 和→0)', '区間更新が要るなら遅延セグ木に拡張'],
    code: {
      kotlin: `// op はモノイド(結合的 + 単位元 unit). 例: min/max/和
class SegTree<T>(n: Int, val unit: T, val op: (T, T) -> T) {
  var size = 1
  init { while (size < n) size *= 2 }
  val t = MutableList(2 * size) { unit }
  fun update(i: Int, v: T) {
    var x = i + size; t[x] = v
    while (x > 1) { x /= 2; t[x] = op(t[2 * x], t[2 * x + 1]) }
  }
  fun query(l: Int, r: Int): T {        // [l, r)
    var res = unit; var lo = l + size; var hi = r + size
    while (lo < hi) {
      if (lo and 1 == 1) res = op(res, t[lo++])
      if (hi and 1 == 1) res = op(res, t[--hi])
      lo /= 2; hi /= 2
    }
    return res
  }
}`,
      python: `class SegTree:
    # op はモノイド(結合的 + 単位元 unit). 例: min, max, 和
    def __init__(self, n, unit, op):
        self.unit, self.op = unit, op
        self.size = 1
        while self.size < n:
            self.size *= 2
        self.t = [unit] * (2 * self.size)
    def update(self, i, v):
        x = i + self.size
        self.t[x] = v
        x >>= 1
        while x:
            self.t[x] = self.op(self.t[2 * x], self.t[2 * x + 1])
            x >>= 1
    def query(self, l, r):                # [l, r)
        res = self.unit
        lo, hi = l + self.size, r + self.size
        while lo < hi:
            if lo & 1:
                res = self.op(res, self.t[lo]); lo += 1
            if hi & 1:
                hi -= 1; res = self.op(res, self.t[hi])
            lo >>= 1; hi >>= 1
        return res`,
      java: `// op はモノイド(結合的 + 単位元 unit). 例: min/max/和
class SegTree<T> {
  int size = 1; T unit; java.util.function.BinaryOperator<T> op; Object[] t;
  SegTree(int n, T unit, java.util.function.BinaryOperator<T> op) {
    this.unit = unit; this.op = op;
    while (size < n) size *= 2;
    t = new Object[2 * size]; Arrays.fill(t, unit);
  }
  @SuppressWarnings("unchecked")
  T at(int i) { return (T) t[i]; }
  void update(int i, T v) {
    int x = i + size; t[x] = v;
    for (x >>= 1; x >= 1; x >>= 1) t[x] = op.apply(at(2 * x), at(2 * x + 1));
  }
  T query(int l, int r) {               // [l, r)
    T res = unit; int lo = l + size, hi = r + size;
    while (lo < hi) {
      if ((lo & 1) == 1) res = op.apply(res, at(lo++));
      if ((hi & 1) == 1) res = op.apply(res, at(--hi));
      lo >>= 1; hi >>= 1;
    }
    return res;
  }
}`,
      cpp: `// op はモノイド(結合的 + 単位元 unit). 例: min/max/和
template <class T>
struct SegTree {
  int size = 1; T unit; function<T(T, T)> op; vector<T> t;
  SegTree(int n, T unit, function<T(T, T)> op) : unit(unit), op(op) {
    while (size < n) size *= 2;
    t.assign(2 * size, unit);
  }
  void update(int i, T v) {
    int x = i + size; t[x] = v;
    for (x >>= 1; x >= 1; x >>= 1) t[x] = op(t[2 * x], t[2 * x + 1]);
  }
  T query(int l, int r) {               // [l, r)
    T res = unit; int lo = l + size, hi = r + size;
    while (lo < hi) {
      if (lo & 1) res = op(res, t[lo++]);
      if (hi & 1) res = op(res, t[--hi]);
      lo >>= 1; hi >>= 1;
    }
    return res;
  }
};`,
    },
  },

  {
    id: 'coord_compress',
    cat: 'ds',
    title: '座標圧縮',
    sub: '大きい値 → 0..k-1',
    cx: 'O(N log N)',
    lead: '値の大小を保ったまま 0..k-1 に詰める。BIT/セグ木に乗せる前処理、値の種類数。',
    diagram: `a    = [100  50 100   7]
sort & distinct = [7 50 100]  (→ 0 1 2)
comp = [  2   1   2   0]
逆引き: 圧縮値 i → vals[i] が元の値`,
    pitfalls: ['重複は 1 つにまとめる(distinct)', '半開区間や境界を扱うなら +1 した値も入れることがある'],
    code: {
      kotlin: `// 値の大小を保ち 0..k-1 に圧縮。(圧縮後, 元の値配列) を返す
fun compress(a: LongArray): Pair<IntArray, LongArray> {
  val vals = a.toSortedSet().toLongArray()
  val idx = HashMap<Long, Int>()
  for ((i, v) in vals.withIndex()) idx[v] = i
  return IntArray(a.size) { idx[a[it]]!! } to vals
}`,
      python: `def compress(a):
    # 値の大小を保ち 0..k-1 に圧縮。(圧縮後, 元の値) を返す
    vals = sorted(set(a))
    idx = {v: i for i, v in enumerate(vals)}
    return [idx[x] for x in a], vals`,
      java: `// 値の大小を保ち 0..k-1 に圧縮。圧縮後配列を返す(元の値は sorted distinct)
static int[] compress(long[] a) {
  long[] vals = Arrays.stream(a).distinct().sorted().toArray();
  HashMap<Long, Integer> idx = new HashMap<>();
  for (int i = 0; i < vals.length; i++) idx.put(vals[i], i);
  int[] res = new int[a.length];
  for (int i = 0; i < a.length; i++) res[i] = idx.get(a[i]);
  return res;
}`,
      cpp: `// 値の大小を保ち 0..k-1 に圧縮。圧縮後を返し、vals に元の値
vector<int> compress(vector<ll>& a, vector<ll>& vals) {
  vals = a;
  sort(vals.begin(), vals.end());
  vals.erase(unique(vals.begin(), vals.end()), vals.end());
  vector<int> res(a.size());
  for (size_t i = 0; i < a.size(); i++)
    res[i] = lower_bound(vals.begin(), vals.end(), a[i]) - vals.begin();
  return res;
}`,
    },
  },

  {
    id: 'bellman_ford',
    cat: 'graph',
    title: 'Bellman-Ford 法',
    sub: '負辺ありの最短路',
    cx: 'O(VE)',
    lead: '全辺を n-1 回緩和。負辺 OK。n 回目でも更新できれば負閉路。Dijkstra が使えない時に。',
    diagram: `全辺を n-1 回 緩和(relax)
 dist[t] = min(dist[t], dist[f] + cost)
n 回目でも更新 → 負閉路あり
始点から到達する負閉路だけが検出対象`,
    pitfalls: ['dist[f] が INF の辺は緩和しない(INF + cost で誤更新)', '負閉路検出は n-1 回緩和の「後」にもう 1 周'],
    code: {
      kotlin: `data class Edge(val from: Int, val to: Int, val cost: Long)
// 負辺ありの単一始点最短路 O(VE)。負閉路があれば null
fun bellmanFord(n: Int, edges: List<Edge>, s: Int): LongArray? {
  val INF = Long.MAX_VALUE / 4
  val dist = LongArray(n) { INF }; dist[s] = 0
  repeat(n - 1) {
    for ((f, t, c) in edges)
      if (dist[f] != INF && dist[f] + c < dist[t]) dist[t] = dist[f] + c
  }
  for ((f, t, c) in edges)
    if (dist[f] != INF && dist[f] + c < dist[t]) return null   // 負閉路
  return dist
}`,
      python: `def bellman_ford(n, edges, s):
    # edges: list of (from, to, cost). 負閉路があれば None
    INF = float('inf')
    dist = [INF] * n; dist[s] = 0
    for _ in range(n - 1):
        for f, t, c in edges:
            if dist[f] != INF and dist[f] + c < dist[t]:
                dist[t] = dist[f] + c
    for f, t, c in edges:                  # n 回目で更新 → 負閉路
        if dist[f] != INF and dist[f] + c < dist[t]:
            return None
    return dist`,
      java: `// edges: each {from, to, cost}. 負閉路があれば null
static long[] bellmanFord(int n, long[][] edges, int s) {
  long INF = Long.MAX_VALUE / 4;
  long[] dist = new long[n]; Arrays.fill(dist, INF); dist[s] = 0;
  for (int it = 0; it < n - 1; it++)
    for (long[] e : edges) {
      int f = (int) e[0], t = (int) e[1];
      if (dist[f] != INF && dist[f] + e[2] < dist[t]) dist[t] = dist[f] + e[2];
    }
  for (long[] e : edges) {                  // 負閉路
    int f = (int) e[0], t = (int) e[1];
    if (dist[f] != INF && dist[f] + e[2] < dist[t]) return null;
  }
  return dist;
}`,
      cpp: `struct BFEdge { int from, to; ll cost; };
// 負辺ありの最短路。負閉路なら ok=false
vector<ll> bellman_ford(int n, vector<BFEdge>& edges, int s, bool& ok) {
  const ll INF = 4e18;
  vector<ll> dist(n, INF); dist[s] = 0; ok = true;
  for (int i = 0; i < n - 1; i++)
    for (auto& e : edges)
      if (dist[e.from] != INF && dist[e.from] + e.cost < dist[e.to])
        dist[e.to] = dist[e.from] + e.cost;
  for (auto& e : edges)                     // 負閉路
    if (dist[e.from] != INF && dist[e.from] + e.cost < dist[e.to]) ok = false;
  return dist;
}`,
    },
  },

  {
    id: 'warshall_floyd',
    cat: 'graph',
    title: 'Warshall-Floyd 法',
    sub: '全点対最短路',
    cx: 'O(V³)',
    lead: '中継点 k を全部試す DP。V≤500 まで。負辺 OK(負閉路は dist[v][v]<0 で検出)。',
    diagram: `中継点 k = 0..n-1 を全部試す
 dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
隣接行列(辺なし=INF, 対角0)を渡し in-place 更新
ループ順は k, i, j の順 (k が最外)`,
    pitfalls: ['ループ順は必ず k を最外に', 'INF 経由の誤更新を防ぐ(INF の行は skip)'],
    code: {
      kotlin: `// 全点対最短路。dist は隣接行列(辺なし=INF, 対角0) を in-place 更新
fun warshallFloyd(dist: Array<LongArray>) {
  val INF = Long.MAX_VALUE / 4; val n = dist.size
  for (k in 0 until n) for (i in 0 until n) {
    if (dist[i][k] == INF) continue
    for (j in 0 until n)
      if (dist[k][j] != INF && dist[i][k] + dist[k][j] < dist[i][j])
        dist[i][j] = dist[i][k] + dist[k][j]
  }
}`,
      python: `def warshall_floyd(dist):
    # dist: 隣接行列(辺なし=inf, 対角0) を in-place 更新
    n = len(dist)
    INF = float('inf')
    for k in range(n):
        for i in range(n):
            if dist[i][k] == INF:
                continue
            dik = dist[i][k]
            row = dist[i]
            for j in range(n):
                if dik + dist[k][j] < row[j]:
                    row[j] = dik + dist[k][j]`,
      java: `// 全点対最短路。dist は隣接行列(辺なし=INF, 対角0) を in-place 更新
static void warshallFloyd(long[][] dist) {
  long INF = Long.MAX_VALUE / 4; int n = dist.length;
  for (int k = 0; k < n; k++)
    for (int i = 0; i < n; i++) {
      if (dist[i][k] == INF) continue;
      for (int j = 0; j < n; j++)
        if (dist[k][j] != INF && dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];
    }
}`,
      cpp: `// 全点対最短路。dist は隣接行列(辺なし=INF, 対角0) を in-place 更新
void warshall_floyd(vector<vector<ll>>& dist) {
  const ll INF = 4e18; int n = dist.size();
  for (int k = 0; k < n; k++)
    for (int i = 0; i < n; i++) {
      if (dist[i][k] == INF) continue;
      for (int j = 0; j < n; j++)
        if (dist[k][j] != INF && dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];
    }
}`,
    },
  },

  {
    id: 'topo_sort',
    cat: 'graph',
    title: 'トポロジカルソート',
    sub: 'DAG の順序付け (Kahn)',
    cx: 'O(V+E)',
    lead: '入次数 0 をキューから取り出し、辺を消しながら並べる。全頂点出せなければ閉路。',
    diagram: `入次数0をキューへ → 取り出しつつ出る辺を消す
 (消した先の入次数が0になったら追加)
全頂点出れば順序確定 / 出きらねば閉路
辞書順最小が要るなら queue → 優先度付き`,
    pitfalls: ['出力数 < N なら閉路あり', '辞書順最小は ArrayDeque を PriorityQueue に'],
    code: {
      kotlin: `// Kahn 法。g: 隣接リスト(有向). 閉路があれば null
fun topoSort(g: Array<MutableList<Int>>): List<Int>? {
  val n = g.size; val indeg = IntArray(n)
  for (v in 0 until n) for (to in g[v]) indeg[to]++
  val q = ArrayDeque<Int>()
  for (v in 0 until n) if (indeg[v] == 0) q.add(v)
  val order = mutableListOf<Int>()
  while (q.isNotEmpty()) {
    val v = q.removeFirst(); order.add(v)
    for (to in g[v]) if (--indeg[to] == 0) q.add(to)
  }
  return if (order.size == n) order else null
}`,
      python: `from collections import deque
def topo_sort(g):
    # g: 隣接リスト(有向). 閉路があれば None
    n = len(g)
    indeg = [0] * n
    for v in range(n):
        for to in g[v]:
            indeg[to] += 1
    q = deque(v for v in range(n) if indeg[v] == 0)
    order = []
    while q:
        v = q.popleft(); order.append(v)
        for to in g[v]:
            indeg[to] -= 1
            if indeg[to] == 0:
                q.append(to)
    return order if len(order) == n else None`,
      java: `// Kahn 法。g: 隣接リスト(有向). 閉路があれば null
static List<Integer> topoSort(List<Integer>[] g) {
  int n = g.length; int[] indeg = new int[n];
  for (int v = 0; v < n; v++) for (int to : g[v]) indeg[to]++;
  ArrayDeque<Integer> q = new ArrayDeque<>();
  for (int v = 0; v < n; v++) if (indeg[v] == 0) q.add(v);
  List<Integer> order = new ArrayList<>();
  while (!q.isEmpty()) {
    int v = q.poll(); order.add(v);
    for (int to : g[v]) if (--indeg[to] == 0) q.add(to);
  }
  return order.size() == n ? order : null;
}`,
      cpp: `// Kahn 法。g: 隣接リスト(有向). 閉路なら ok=false
vector<int> topo_sort(vector<vector<int>>& g, bool& ok) {
  int n = g.size(); vector<int> indeg(n, 0);
  for (int v = 0; v < n; v++) for (int to : g[v]) indeg[to]++;
  queue<int> q;
  for (int v = 0; v < n; v++) if (indeg[v] == 0) q.push(v);
  vector<int> order;
  while (!q.empty()) {
    int v = q.front(); q.pop(); order.push_back(v);
    for (int to : g[v]) if (--indeg[to] == 0) q.push(to);
  }
  ok = ((int) order.size() == n);
  return order;
}`,
    },
  },

  {
    id: 'kruskal',
    cat: 'graph',
    title: 'Kruskal 法 (MST)',
    sub: '最小全域木',
    cx: 'O(E log E)',
    lead: '辺を cost 昇順に見て、端点が別グループなら採用(Union-Find)。全部つなぐ最小コスト。',
    diagram: `辺を cost 昇順にソート
 端点が別グループなら採用(UnionFind で併合)
 採用辺が n-1 本で全域木 完成
※ Union-Find のスニペットが必要`,
    pitfalls: ['採用辺が n-1 本に満たなければ非連結', '同コスト辺の順序は MST 重みに影響しない'],
    code: {
      kotlin: `data class WEdge(val u: Int, val v: Int, val cost: Long)
// 最小全域木。UnionFind が必要。総コスト(非連結なら null)
fun kruskal(n: Int, edges: List<WEdge>): Long? {
  val uf = UnionFind(n); var total = 0L; var used = 0
  for ((u, v, c) in edges.sortedBy { it.cost })
    if (uf.union(u, v)) { total += c; used++ }
  return if (used == n - 1) total else null
}`,
      python: `def kruskal(n, edges):
    # edges: list of (cost, u, v). UnionFind 必要。非連結なら None
    uf = UnionFind(n)
    total = used = 0
    for c, u, v in sorted(edges):
        if uf.union(u, v):
            total += c; used += 1
    return total if used == n - 1 else None`,
      java: `// edges: each {cost, u, v}. UnionFind 必要。非連結なら -1
static long kruskal(int n, long[][] edges) {
  Arrays.sort(edges, (a, b) -> Long.compare(a[0], b[0]));
  UnionFind uf = new UnionFind(n); long total = 0; int used = 0;
  for (long[] e : edges)
    if (uf.union((int) e[1], (int) e[2])) { total += e[0]; used++; }
  return used == n - 1 ? total : -1;
}`,
      cpp: `struct WEdge { ll cost; int u, v; };
// 最小全域木。UnionFind 必要。非連結なら -1
ll kruskal(int n, vector<WEdge> edges) {
  sort(edges.begin(), edges.end(), [](auto& a, auto& b) { return a.cost < b.cost; });
  UnionFind uf(n); ll total = 0; int used = 0;
  for (auto& e : edges)
    if (uf.unite(e.u, e.v)) { total += e.cost; used++; }
  return used == n - 1 ? total : -1;
}`,
    },
  },

  {
    id: 'two_pointers',
    cat: 'util',
    title: 'しゃくとり法',
    sub: '連続区間の最長/数え上げ',
    cx: 'O(N)',
    lead: '窓 [left,right] を右に伸ばし、条件を破ったら左を詰める。単調性が前提(非負配列など)。',
    diagram: `[left,right] 窓を右へ伸ばし、破ったら左を詰める
 和<=k 最大長: 超えたら left++ で縮める
 和>=k 個数: 初めて満たせば右端以降は全部OK
単調性(伸ばすと悪化/縮めると改善)が必要`,
    pitfalls: ['負数があると単調性が崩れ使えない', 'right を左に戻さない(各ポインタは単調に進むだけ)'],
    code: {
      kotlin: `// 和が k 以下の連続区間の最大長 (a は非負)
fun longestAtMost(a: LongArray, k: Long): Int {
  var best = 0; var sum = 0L; var left = 0
  for (right in a.indices) {
    sum += a[right]
    while (sum > k) { sum -= a[left]; left++ }
    best = maxOf(best, right - left + 1)
  }
  return best
}
// 和が k 以上の連続区間の総数 (a は非負)
fun countAtLeast(a: LongArray, k: Long): Long {
  val n = a.size; var count = 0L; var sum = 0L; var right = 0
  for (left in 0 until n) {
    while (right < n && sum < k) { sum += a[right]; right++ }
    if (sum < k) break
    count += n - right + 1
    sum -= a[left]
  }
  return count
}`,
      python: `def longest_at_most(a, k):
    # 和が k 以下の連続区間の最大長 (a は非負)
    best = s = left = 0
    for right in range(len(a)):
        s += a[right]
        while s > k:
            s -= a[left]; left += 1
        best = max(best, right - left + 1)
    return best

def count_at_least(a, k):
    # 和が k 以上の連続区間の総数 (a は非負)
    n = len(a)
    count = s = right = 0
    for left in range(n):
        while right < n and s < k:
            s += a[right]; right += 1
        if s < k:
            break
        count += n - right + 1
        s -= a[left]
    return count`,
      java: `// 和が k 以下の連続区間の最大長 (a は非負)
static int longestAtMost(long[] a, long k) {
  int best = 0, left = 0; long sum = 0;
  for (int right = 0; right < a.length; right++) {
    sum += a[right];
    while (sum > k) { sum -= a[left]; left++; }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
// 和が k 以上の連続区間の総数 (a は非負)
static long countAtLeast(long[] a, long k) {
  int n = a.length, right = 0; long count = 0, sum = 0;
  for (int left = 0; left < n; left++) {
    while (right < n && sum < k) { sum += a[right]; right++; }
    if (sum < k) break;
    count += n - right + 1;
    sum -= a[left];
  }
  return count;
}`,
      cpp: `// 和が k 以下の連続区間の最大長 (a は非負)
int longest_at_most(vector<ll>& a, ll k) {
  int best = 0, left = 0; ll sum = 0;
  for (int right = 0; right < (int) a.size(); right++) {
    sum += a[right];
    while (sum > k) { sum -= a[left]; left++; }
    best = max(best, right - left + 1);
  }
  return best;
}
// 和が k 以上の連続区間の総数 (a は非負)
ll count_at_least(vector<ll>& a, ll k) {
  int n = a.size(), right = 0; ll count = 0, sum = 0;
  for (int left = 0; left < n; left++) {
    while (right < n && sum < k) { sum += a[right]; right++; }
    if (sum < k) break;
    count += n - right + 1;
    sum -= a[left];
  }
  return count;
}`,
    },
  },

  {
    id: 'enumeration',
    cat: 'search',
    title: 'bit 全探索 / 順列',
    sub: '全列挙',
    cx: 'O(2ⁿn) / O(n!·n)',
    lead: 'bit 全探索で選ぶ/選ばない 2ⁿ 通り(n≤20)。next permutation で全順列(n≤10)。',
    diagram: `bit全探索: mask 0..2^n-1, i bit目で i 番目採用
 for mask: for i: if (mask>>i & 1) use i
順列: 末尾から増加位置を探し交換→反転
 012 021 102 120 201 210  (n! 通り)`,
    pitfalls: ['next permutation は最初にソートしてから', '1 shl n は n が大きいと Int 溢れ(Long に)'],
    code: {
      kotlin: `// bit 全探索: for (mask in 0 until (1 shl n)) { (mask shr i and 1) ... }
// 辞書順で次の順列に in-place。なければ false。do{}while で全列挙
fun nextPermutation(a: IntArray): Boolean {
  var i = a.size - 2
  while (i >= 0 && a[i] >= a[i + 1]) i--
  if (i < 0) return false
  var j = a.size - 1
  while (a[j] <= a[i]) j--
  a[i] = a[j].also { a[j] = a[i] }
  var lo = i + 1; var hi = a.size - 1
  while (lo < hi) { a[lo] = a[hi].also { a[hi] = a[lo] }; lo++; hi-- }
  return true
}`,
      python: `# bit 全探索: for mask in range(1 << n): [i for i in range(n) if mask >> i & 1]
# 順列は標準が簡単:  from itertools import permutations
#   for p in permutations(range(n)): ...   # n! 通り
def next_permutation(a):
    # 辞書順で次の順列に in-place。なければ False
    i = len(a) - 2
    while i >= 0 and a[i] >= a[i + 1]:
        i -= 1
    if i < 0:
        return False
    j = len(a) - 1
    while a[j] <= a[i]:
        j -= 1
    a[i], a[j] = a[j], a[i]
    a[i + 1:] = a[i + 1:][::-1]
    return True`,
      java: `// bit 全探索: for (int mask = 0; mask < (1<<n); mask++) { (mask>>i & 1) ... }
// 辞書順で次の順列に in-place。なければ false
static boolean nextPermutation(int[] a) {
  int i = a.length - 2;
  while (i >= 0 && a[i] >= a[i + 1]) i--;
  if (i < 0) return false;
  int j = a.length - 1;
  while (a[j] <= a[i]) j--;
  int t = a[i]; a[i] = a[j]; a[j] = t;
  for (int lo = i + 1, hi = a.length - 1; lo < hi; lo++, hi--) {
    int s = a[lo]; a[lo] = a[hi]; a[hi] = s;
  }
  return true;
}`,
      cpp: `// bit 全探索: for (int mask = 0; mask < (1<<n); mask++) { (mask>>i & 1) ... }
// 順列は標準が使える: sort 後 do{}while(next_permutation(a.begin(), a.end()))
// 自前が要るとき(std と名前を分けて):
bool next_perm(vector<int>& a) {
  int i = (int) a.size() - 2;
  while (i >= 0 && a[i] >= a[i + 1]) i--;
  if (i < 0) return false;
  int j = (int) a.size() - 1;
  while (a[j] <= a[i]) j--;
  swap(a[i], a[j]);
  reverse(a.begin() + i + 1, a.end());
  return true;
}`,
    },
  },

  {
    id: 'lis_lcs',
    cat: 'dp',
    title: 'LIS / LCS / 編集距離',
    sub: '部分列 DP',
    cx: 'O(N log N) / O(NM)',
    lead: 'LIS は末尾最小値を二分探索で更新。LCS・編集距離は 2 次元 DP 表。',
    diagram: `LIS: tail[k] = 長さ k+1 の増加列の末尾の最小値
 各 x を lower_bound で 置換 or 追加 → 長さが答え
LCS/編集距離: dp[i][j] を表で
 一致なら ＼+1 / 不一致は周囲の最小から`,
    pitfalls: ['LIS 広義単調増加は lower→upper bound に変える', 'LCS/編集距離は O(NM) メモリ。長いと 1 次元ロールで節約'],
    code: {
      kotlin: `// LIS (最長増加部分列) O(N log N)
fun lis(a: IntArray): Int {
  val tail = mutableListOf<Int>()
  for (x in a) {
    val pos = tail.binarySearch(x).let { if (it < 0) -(it + 1) else it }
    if (pos == tail.size) tail.add(x) else tail[pos] = x
  }
  return tail.size
}
// LCS (最長共通部分列) O(NM)
fun lcs(s: String, t: String): Int {
  val dp = Array(s.length + 1) { IntArray(t.length + 1) }
  for (i in s.indices) for (j in t.indices)
    dp[i + 1][j + 1] = if (s[i] == t[j]) dp[i][j] + 1
                       else maxOf(dp[i][j + 1], dp[i + 1][j])
  return dp[s.length][t.length]
}
// 編集距離 (Levenshtein) O(NM)
fun editDistance(s: String, t: String): Int {
  val dp = Array(s.length + 1) { IntArray(t.length + 1) }
  for (i in 0..s.length) dp[i][0] = i
  for (j in 0..t.length) dp[0][j] = j
  for (i in 1..s.length) for (j in 1..t.length) {
    val c = if (s[i - 1] == t[j - 1]) 0 else 1
    dp[i][j] = minOf(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + c)
  }
  return dp[s.length][t.length]
}`,
      python: `from bisect import bisect_left
def lis(a):
    # 最長増加部分列 O(N log N)。広義単調増加なら bisect_right に
    tail = []
    for x in a:
        p = bisect_left(tail, x)
        if p == len(tail):
            tail.append(x)
        else:
            tail[p] = x
    return len(tail)

def lcs(s, t):                            # 最長共通部分列 O(NM)
    n, m = len(s), len(t)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n):
        for j in range(m):
            dp[i + 1][j + 1] = dp[i][j] + 1 if s[i] == t[j] \\
                else max(dp[i][j + 1], dp[i + 1][j])
    return dp[n][m]

def edit_distance(s, t):                  # 編集距離 O(NM)
    n, m = len(s), len(t)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            c = 0 if s[i - 1] == t[j - 1] else 1
            dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + c)
    return dp[n][m]`,
      java: `// LIS (最長増加部分列) O(N log N)
static int lis(int[] a) {
  ArrayList<Integer> tail = new ArrayList<>();
  for (int x : a) {
    int p = Collections.binarySearch(tail, x);
    if (p < 0) p = -(p + 1);
    if (p == tail.size()) tail.add(x); else tail.set(p, x);
  }
  return tail.size();
}
// LCS (最長共通部分列) O(NM)
static int lcs(String s, String t) {
  int n = s.length(), m = t.length();
  int[][] dp = new int[n + 1][m + 1];
  for (int i = 0; i < n; i++) for (int j = 0; j < m; j++)
    dp[i + 1][j + 1] = s.charAt(i) == t.charAt(j) ? dp[i][j] + 1
                       : Math.max(dp[i][j + 1], dp[i + 1][j]);
  return dp[n][m];
}
// 編集距離 (Levenshtein) O(NM)
static int editDistance(String s, String t) {
  int n = s.length(), m = t.length();
  int[][] dp = new int[n + 1][m + 1];
  for (int i = 0; i <= n; i++) dp[i][0] = i;
  for (int j = 0; j <= m; j++) dp[0][j] = j;
  for (int i = 1; i <= n; i++) for (int j = 1; j <= m; j++) {
    int c = s.charAt(i - 1) == t.charAt(j - 1) ? 0 : 1;
    dp[i][j] = Math.min(Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1), dp[i - 1][j - 1] + c);
  }
  return dp[n][m];
}`,
      cpp: `// LIS (最長増加部分列) O(N log N)
int lis(vector<int>& a) {
  vector<int> tail;
  for (int x : a) {
    auto it = lower_bound(tail.begin(), tail.end(), x);
    if (it == tail.end()) tail.push_back(x); else *it = x;
  }
  return tail.size();
}
// LCS (最長共通部分列) O(NM)
int lcs(const string& s, const string& t) {
  int n = s.size(), m = t.size();
  vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
  for (int i = 0; i < n; i++) for (int j = 0; j < m; j++)
    dp[i + 1][j + 1] = (s[i] == t[j]) ? dp[i][j] + 1
                       : max(dp[i][j + 1], dp[i + 1][j]);
  return dp[n][m];
}
// 編集距離 (Levenshtein) O(NM)
int edit_distance(const string& s, const string& t) {
  int n = s.size(), m = t.size();
  vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
  for (int i = 0; i <= n; i++) dp[i][0] = i;
  for (int j = 0; j <= m; j++) dp[0][j] = j;
  for (int i = 1; i <= n; i++) for (int j = 1; j <= m; j++) {
    int c = (s[i - 1] == t[j - 1]) ? 0 : 1;
    dp[i][j] = min({dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + c});
  }
  return dp[n][m];
}`,
    },
  },

  {
    id: 'prime_factor',
    cat: 'math',
    title: '素因数分解 / 約数',
    sub: '√N の整数論',
    cx: 'O(√N)',
    lead: 'p=2 から割り続ける素因数分解。約数は d と n/d をペアで集める。素数判定も同様。',
    diagram: `factorize: p=2.. (p*p<=v) の間割り続ける
 残った v>1 は最大の素因数
 360 = 2^3 · 3^2 · 5
divisors: d*d<=n, n%d==0 で d と n/d を集める
 12 の約数 = 1 2 3 4 6 12`,
    pitfalls: ['p*p<=v / d*d<=n で √N 打ち切り(オーバーフローは long)', 'クエリが多いなら篩で最小素因数表(spf)を作り O(log N) に'],
    code: {
      kotlin: `// 素因数分解 {素因数: 指数} O(√N)
fun factorize(n: Long): Map<Long, Int> {
  val res = LinkedHashMap<Long, Int>(); var v = n; var p = 2L
  while (p * p <= v) { while (v % p == 0L) { res[p] = (res[p] ?: 0) + 1; v /= p }; p++ }
  if (v > 1) res[v] = (res[v] ?: 0) + 1
  return res
}
// 約数列挙 (ソート済み) O(√N)
fun divisors(n: Long): List<Long> {
  val small = mutableListOf<Long>(); val large = mutableListOf<Long>(); var d = 1L
  while (d * d <= n) {
    if (n % d == 0L) { small.add(d); if (d != n / d) large.add(n / d) }
    d++
  }
  return small + large.reversed()
}
fun isPrime(n: Long): Boolean {
  if (n < 2) return false
  var d = 2L; while (d * d <= n) { if (n % d == 0L) return false; d++ }
  return true
}`,
      python: `def factorize(n):                         # {素因数: 指数} O(√N)
    res = {}
    v, p = n, 2
    while p * p <= v:
        while v % p == 0:
            res[p] = res.get(p, 0) + 1
            v //= p
        p += 1
    if v > 1:
        res[v] = res.get(v, 0) + 1
    return res

def divisors(n):                          # 約数 (ソート済み) O(√N)
    small, large = [], []
    d = 1
    while d * d <= n:
        if n % d == 0:
            small.append(d)
            if d != n // d:
                large.append(n // d)
        d += 1
    return small + large[::-1]

def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True`,
      java: `// 素因数分解 {素因数: 指数} O(√N)
static Map<Long, Integer> factorize(long n) {
  Map<Long, Integer> res = new LinkedHashMap<>();
  long v = n;
  for (long p = 2; p * p <= v; p++)
    while (v % p == 0) { res.merge(p, 1, Integer::sum); v /= p; }
  if (v > 1) res.merge(v, 1, Integer::sum);
  return res;
}
// 約数列挙 (ソート済み) O(√N)
static List<Long> divisors(long n) {
  List<Long> small = new ArrayList<>(), large = new ArrayList<>();
  for (long d = 1; d * d <= n; d++)
    if (n % d == 0) { small.add(d); if (d != n / d) large.add(n / d); }
  for (int i = large.size() - 1; i >= 0; i--) small.add(large.get(i));
  return small;
}
static boolean isPrime(long n) {
  if (n < 2) return false;
  for (long d = 2; d * d <= n; d++) if (n % d == 0) return false;
  return true;
}`,
      cpp: `// 素因数分解 {素因数: 指数} O(√N)
map<ll, int> factorize(ll n) {
  map<ll, int> res; ll v = n;
  for (ll p = 2; p * p <= v; p++)
    while (v % p == 0) { res[p]++; v /= p; }
  if (v > 1) res[v]++;
  return res;
}
// 約数列挙 (ソート済み) O(√N)
vector<ll> divisors(ll n) {
  vector<ll> small, large;
  for (ll d = 1; d * d <= n; d++)
    if (n % d == 0) { small.push_back(d); if (d != n / d) large.push_back(n / d); }
  for (int i = (int) large.size() - 1; i >= 0; i--) small.push_back(large[i]);
  return small;
}
bool is_prime(ll n) {
  if (n < 2) return false;
  for (ll d = 2; d * d <= n; d++) if (n % d == 0) return false;
  return true;
}`,
    },
  },

  {
    id: 'bit_dp',
    cat: 'dp',
    title: 'bitDP (TSP)',
    sub: '巡回セールスマン',
    cx: 'O(2ᴺN²)',
    lead: '訪問済み集合を bit で持つ DP。N≤16 程度。全頂点を回って戻る最小コスト等。',
    diagram: `dp[S][v] = 訪問済み集合 S で今 v にいる最小コスト
 0 から出発: dp[{0}][0] = 0
 S に未訪問 to を足して遷移
最後に全訪問+0へ戻る最小。N<=16 (2^16·16^2)`,
    pitfalls: ['1 shl N の集合サイズ。N>20 で破綻', '到達不能 (INF) からは遷移しない'],
    code: {
      kotlin: `// bitDP 巡回セールスマン O(2^N N^2). N<=16
// dist[i][j] = i->j のコスト。0 から全頂点回り 0 に戻る最小
fun tsp(dist: Array<LongArray>): Long {
  val INF = Long.MAX_VALUE / 4; val n = dist.size; val full = 1 shl n
  val dp = Array(full) { LongArray(n) { INF } }
  dp[1][0] = 0
  for (s in 0 until full) for (v in 0 until n) {
    if (dp[s][v] == INF) continue
    for (to in 0 until n) {
      if (s shr to and 1 == 1) continue
      val ns = s or (1 shl to)
      if (dp[s][v] + dist[v][to] < dp[ns][to]) dp[ns][to] = dp[s][v] + dist[v][to]
    }
  }
  var res = INF
  for (v in 1 until n) if (dp[full - 1][v] != INF) res = minOf(res, dp[full - 1][v] + dist[v][0])
  return res
}`,
      python: `def tsp(dist):
    # bitDP 巡回セールスマン O(2^N N^2). N<=16
    INF = float('inf')
    n = len(dist); full = 1 << n
    dp = [[INF] * n for _ in range(full)]
    dp[1][0] = 0
    for s in range(full):
        for v in range(n):
            if dp[s][v] == INF:
                continue
            for to in range(n):
                if s >> to & 1:
                    continue
                ns = s | (1 << to)
                cost = dp[s][v] + dist[v][to]
                if cost < dp[ns][to]:
                    dp[ns][to] = cost
    return min((dp[full - 1][v] + dist[v][0]
                for v in range(1, n) if dp[full - 1][v] != INF), default=INF)`,
      java: `// bitDP 巡回セールスマン O(2^N N^2). N<=16
static long tsp(long[][] dist) {
  long INF = Long.MAX_VALUE / 4; int n = dist.length, full = 1 << n;
  long[][] dp = new long[full][n];
  for (long[] row : dp) Arrays.fill(row, INF);
  dp[1][0] = 0;
  for (int s = 0; s < full; s++) for (int v = 0; v < n; v++) {
    if (dp[s][v] == INF) continue;
    for (int to = 0; to < n; to++) {
      if ((s >> to & 1) == 1) continue;
      int ns = s | (1 << to);
      if (dp[s][v] + dist[v][to] < dp[ns][to]) dp[ns][to] = dp[s][v] + dist[v][to];
    }
  }
  long res = INF;
  for (int v = 1; v < n; v++)
    if (dp[full - 1][v] != INF) res = Math.min(res, dp[full - 1][v] + dist[v][0]);
  return res;
}`,
      cpp: `// bitDP 巡回セールスマン O(2^N N^2). N<=16
ll tsp(vector<vector<ll>>& dist) {
  const ll INF = 4e18; int n = dist.size(), full = 1 << n;
  vector<vector<ll>> dp(full, vector<ll>(n, INF));
  dp[1][0] = 0;
  for (int s = 0; s < full; s++) for (int v = 0; v < n; v++) {
    if (dp[s][v] == INF) continue;
    for (int to = 0; to < n; to++) {
      if (s >> to & 1) continue;
      int ns = s | (1 << to);
      if (dp[s][v] + dist[v][to] < dp[ns][to]) dp[ns][to] = dp[s][v] + dist[v][to];
    }
  }
  ll res = INF;
  for (int v = 1; v < n; v++)
    if (dp[full - 1][v] != INF) res = min(res, dp[full - 1][v] + dist[v][0]);
  return res;
}`,
    },
  },

  {
    id: 'rolling_hash',
    cat: 'string',
    title: 'ローリングハッシュ',
    sub: '部分文字列比較 O(1)',
    cx: '構築 O(N) / 比較 O(1)',
    lead: '文字列を多項式ハッシュに。mod 2⁶¹-1 で衝突回避。部分文字列の一致判定が O(1)。',
    diagram: `h[i] = s[0..i-1] の多項式ハッシュ (base 進数)
 get(l,r) = h[r] - h[l]·base^(r-l)  (mod 2^61-1)
部分文字列が等しい ⇔ ハッシュ一致 (O(1))
base はランダム、mod は 2^61-1 が安全`,
    pitfalls: ['単一ハッシュは衝突リスク。心配なら 2 種の mod で二重化', 'C++ は __int128、Java/Kotlin は Math.multiplyHigh で 128bit 乗算'],
    code: {
      kotlin: `// ローリングハッシュ (mod 2^61-1)。部分文字列比較 O(1)
class RollingHash(s: String) {
  val MOD = (1L shl 61) - 1
  val BASE = 1_000_003L
  val h = LongArray(s.length + 1)
  val pw = LongArray(s.length + 1)
  init {
    pw[0] = 1
    for (i in s.indices) {
      h[i + 1] = mul(h[i], BASE) + s[i].code
      if (h[i + 1] >= MOD) h[i + 1] -= MOD
      pw[i + 1] = mul(pw[i], BASE)
    }
  }
  fun mul(a: Long, b: Long): Long {              // a*b mod (2^61-1)
    val hi = Math.multiplyHigh(a, b); val lo = a * b
    var r = (hi shl 3) + (lo ushr 61) + (lo and MOD)
    if (r >= MOD) r -= MOD
    return r
  }
  fun get(l: Int, r: Int): Long {                // [l, r)
    var res = h[r] - mul(h[l], pw[r - l])
    if (res < 0) res += MOD
    return res
  }
}`,
      python: `class RollingHash:
    # mod 2^61-1。Python は多倍長なので素直に書ける
    MOD = (1 << 61) - 1
    BASE = 1_000_003
    def __init__(self, s):
        n = len(s)
        self.h = [0] * (n + 1)
        self.pw = [1] * (n + 1)
        for i, ch in enumerate(s):
            self.h[i + 1] = (self.h[i] * self.BASE + ord(ch)) % self.MOD
            self.pw[i + 1] = self.pw[i] * self.BASE % self.MOD
    def get(self, l, r):                          # [l, r)
        return (self.h[r] - self.h[l] * self.pw[r - l]) % self.MOD`,
      java: `// ローリングハッシュ (mod 2^61-1)。部分文字列比較 O(1)
class RollingHash {
  static final long MOD = (1L << 61) - 1;
  static final long BASE = 1_000_003L;
  long[] h, pw;
  RollingHash(String s) {
    int n = s.length();
    h = new long[n + 1]; pw = new long[n + 1]; pw[0] = 1;
    for (int i = 0; i < n; i++) {
      h[i + 1] = mul(h[i], BASE) + s.charAt(i);
      if (h[i + 1] >= MOD) h[i + 1] -= MOD;
      pw[i + 1] = mul(pw[i], BASE);
    }
  }
  static long mul(long a, long b) {               // a*b mod (2^61-1)
    long hi = Math.multiplyHigh(a, b), lo = a * b;
    long r = (hi << 3) + (lo >>> 61) + (lo & MOD);
    if (r >= MOD) r -= MOD;
    return r;
  }
  long get(int l, int r) {                        // [l, r)
    long res = h[r] - mul(h[l], pw[r - l]);
    if (res < 0) res += MOD;
    return res;
  }
}`,
      cpp: `// ローリングハッシュ (mod 2^61-1)。部分文字列比較 O(1)
struct RollingHash {
  static const ll MOD = (1LL << 61) - 1;
  static const ll BASE = 1000003;
  vector<ll> h, pw;
  RollingHash(const string& s) {
    int n = s.size();
    h.assign(n + 1, 0); pw.assign(n + 1, 1);
    for (int i = 0; i < n; i++) {
      h[i + 1] = mul(h[i], BASE) + s[i];
      if (h[i + 1] >= MOD) h[i + 1] -= MOD;
      pw[i + 1] = mul(pw[i], BASE);
    }
  }
  static ll mul(ll a, ll b) {                     // a*b mod (2^61-1)
    __int128 t = (__int128) a * b;
    ll r = (ll)((t >> 61) + (t & MOD));
    if (r >= MOD) r -= MOD;
    return r;
  }
  ll get(int l, int r) {                          // [l, r)
    ll res = h[r] - mul(h[l], pw[r - l]);
    if (res < 0) res += MOD;
    return res;
  }
};`,
    },
  },

  {
    id: 'geometry',
    cat: 'geometry',
    title: '平面幾何',
    sub: 'ccw / 線分交差 / 凸包',
    cx: '凸包 O(N log N)',
    lead: 'ccw(外積で回転方向)が基礎。線分交差・凸包・面積。誤差は EPS で比較、整数なら Long で。',
    diagram: `ccw(a,b,c): 外積の符号で回転方向
  1:反時計 -1:時計 0/±2:一直線上
線分交差: 互いに相手を挟む ⇔ 交差
凸包(Andrew): x昇順→下側→上側
 cross<EPS で pop (左折だけ残す=反時計回り)`,
    pitfalls: ['== でなく EPS 比較。退化(同一点・一直線)に注意', '整数座標なら Long の cross で誤差ゼロにできる', '凸包は一直線上の点を残すなら pop 条件を < -EPS に'],
    code: {
      kotlin: `const val EPS = 1e-9
class P(val x: Double, val y: Double) {
  operator fun minus(o: P) = P(x - o.x, y - o.y)
  fun cross(o: P) = x * o.y - y * o.x
  fun dot(o: P) = x * o.x + y * o.y
}
// 1:反時計 -1:時計 2:c-a-b -2:a-b-c 0:線分ab上
fun ccw(a: P, b: P, c: P): Int {
  val ab = b - a; val ac = c - a
  return when {
    ab.cross(ac) > EPS -> 1
    ab.cross(ac) < -EPS -> -1
    ab.dot(ac) < -EPS -> 2
    ab.dot(ab) < ac.dot(ac) - EPS -> -2
    else -> 0
  }
}
fun segIntersect(a: P, b: P, c: P, d: P): Boolean =
  ccw(a, b, c) * ccw(a, b, d) <= 0 && ccw(c, d, a) * ccw(c, d, b) <= 0
// 凸包(反時計回り) O(N log N)
fun convexHull(ps: List<P>): List<P> {
  val s = ps.sortedWith(compareBy({ it.x }, { it.y }))
  if (s.size <= 2) return s
  val h = mutableListOf<P>()
  fun build(floor: Int, pts: List<P>) {
    for (p in pts) {
      while (h.size > floor &&
        (h[h.size - 1] - h[h.size - 2]).cross(p - h[h.size - 1]) < EPS)
        h.removeAt(h.size - 1)
      h.add(p)
    }
  }
  build(1, s); val lower = h.size; build(lower, s.reversed().drop(1))
  return h.dropLast(1)
}
// 符号付き面積(反時計回りで正)
fun polygonArea(poly: List<P>): Double {
  var s = 0.0
  for (i in poly.indices) s += poly[i].cross(poly[(i + 1) % poly.size])
  return s / 2
}`,
      python: `EPS = 1e-9
def sub(a, b): return (a[0] - b[0], a[1] - b[1])
def cross(a, b): return a[0] * b[1] - a[1] * b[0]
def dot(a, b): return a[0] * b[0] + a[1] * b[1]
def ccw(a, b, c):
    # 1:反時計 -1:時計 2:c-a-b -2:a-b-c 0:線分ab上
    ab, ac = sub(b, a), sub(c, a)
    cr = cross(ab, ac)
    if cr > EPS: return 1
    if cr < -EPS: return -1
    if dot(ab, ac) < -EPS: return 2
    if dot(ab, ab) < dot(ac, ac) - EPS: return -2
    return 0
def seg_intersect(a, b, c, d):
    return ccw(a, b, c) * ccw(a, b, d) <= 0 and ccw(c, d, a) * ccw(c, d, b) <= 0
def convex_hull(ps):                      # 反時計回り O(N log N)
    s = sorted(set(ps))
    if len(s) <= 2: return s
    h = []
    def build(floor, pts):
        for p in pts:
            while len(h) > floor and cross(sub(h[-1], h[-2]), sub(p, h[-1])) < EPS:
                h.pop()
            h.append(p)
    build(1, s); lower = len(h); build(lower, s[::-1][1:])
    return h[:-1]
def polygon_area(poly):                   # 符号付き面積(反時計回りで正)
    n = len(poly)
    return sum(cross(poly[i], poly[(i + 1) % n]) for i in range(n)) / 2`,
      java: `static final double EPS = 1e-9;
static double[] sub(double[] a, double[] b) { return new double[]{a[0]-b[0], a[1]-b[1]}; }
static double cross(double[] a, double[] b) { return a[0]*b[1] - a[1]*b[0]; }
static double dot(double[] a, double[] b) { return a[0]*b[0] + a[1]*b[1]; }
// 1:反時計 -1:時計 2:c-a-b -2:a-b-c 0:線分ab上
static int ccw(double[] a, double[] b, double[] c) {
  double[] ab = sub(b, a), ac = sub(c, a);
  double cr = cross(ab, ac);
  if (cr > EPS) return 1;
  if (cr < -EPS) return -1;
  if (dot(ab, ac) < -EPS) return 2;
  if (dot(ab, ab) < dot(ac, ac) - EPS) return -2;
  return 0;
}
static boolean segIntersect(double[] a, double[] b, double[] c, double[] d) {
  return ccw(a,b,c)*ccw(a,b,d) <= 0 && ccw(c,d,a)*ccw(c,d,b) <= 0;
}
// 凸包(反時計回り) O(N log N)
static List<double[]> convexHull(List<double[]> ps) {
  List<double[]> s = new ArrayList<>(ps);
  s.sort((p,q) -> p[0]!=q[0] ? Double.compare(p[0],q[0]) : Double.compare(p[1],q[1]));
  int n = s.size();
  if (n <= 2) return s;
  double[][] h = new double[2 * n][]; int k = 0;
  for (int i = 0; i < n; i++) {
    while (k >= 2 && cross(sub(h[k-1], h[k-2]), sub(s.get(i), h[k-1])) < EPS) k--;
    h[k++] = s.get(i);
  }
  for (int i = n - 2, lower = k + 1; i >= 0; i--) {
    while (k >= lower && cross(sub(h[k-1], h[k-2]), sub(s.get(i), h[k-1])) < EPS) k--;
    h[k++] = s.get(i);
  }
  List<double[]> res = new ArrayList<>();
  for (int i = 0; i < k - 1; i++) res.add(h[i]);
  return res;
}
static double polygonArea(List<double[]> poly) {   // 反時計回りで正
  double s = 0; int n = poly.size();
  for (int i = 0; i < n; i++) s += cross(poly.get(i), poly.get((i + 1) % n));
  return s / 2;
}`,
      cpp: `const double EPS = 1e-9;
struct Pt { double x, y; };
Pt sub(Pt a, Pt b) { return {a.x - b.x, a.y - b.y}; }
double cross(Pt a, Pt b) { return a.x * b.y - a.y * b.x; }
double dot(Pt a, Pt b) { return a.x * b.x + a.y * b.y; }
// 1:反時計 -1:時計 2:c-a-b -2:a-b-c 0:線分ab上
int ccw(Pt a, Pt b, Pt c) {
  Pt ab = sub(b, a), ac = sub(c, a);
  double cr = cross(ab, ac);
  if (cr > EPS) return 1;
  if (cr < -EPS) return -1;
  if (dot(ab, ac) < -EPS) return 2;
  if (dot(ab, ab) < dot(ac, ac) - EPS) return -2;
  return 0;
}
bool seg_intersect(Pt a, Pt b, Pt c, Pt d) {
  return ccw(a,b,c)*ccw(a,b,d) <= 0 && ccw(c,d,a)*ccw(c,d,b) <= 0;
}
// 凸包(反時計回り) O(N log N)
vector<Pt> convex_hull(vector<Pt> ps) {
  sort(ps.begin(), ps.end(), [](Pt a, Pt b){ return a.x != b.x ? a.x < b.x : a.y < b.y; });
  int n = ps.size();
  if (n <= 2) return ps;
  vector<Pt> h(2 * n); int k = 0;
  for (int i = 0; i < n; i++) {
    while (k >= 2 && cross(sub(h[k-1], h[k-2]), sub(ps[i], h[k-1])) < EPS) k--;
    h[k++] = ps[i];
  }
  for (int i = n - 2, lower = k + 1; i >= 0; i--) {
    while (k >= lower && cross(sub(h[k-1], h[k-2]), sub(ps[i], h[k-1])) < EPS) k--;
    h[k++] = ps[i];
  }
  h.resize(k - 1);
  return h;
}
double polygon_area(vector<Pt>& poly) {            // 反時計回りで正
  double s = 0; int n = poly.size();
  for (int i = 0; i < n; i++) s += cross(poly[i], poly[(i + 1) % n]);
  return s / 2;
}`,
    },
  },

  {
    id: 'bipartite_matching',
    cat: 'graph',
    title: '二部マッチング',
    sub: '増加路 (Hopcroft不要版)',
    cx: 'O(VE)',
    lead: '左頂点から増加路を DFS で探す。割り当て問題、最大マッチング = 最小頂点被覆(König)。',
    diagram: `左→右の辺。各左頂点から増加路を DFS
 右が空 or その相手を押し出せれば マッチ確定
最大マッチング数 = 最小頂点被覆 (König の定理)
used[] を頂点ごとにリセットして探索`,
    pitfalls: ['used は左頂点ごとに毎回リセット', 'もっと速くしたいなら Hopcroft-Karp / Dinic'],
    code: {
      kotlin: `// 増加路 DFS O(VE)。左 n, 右 m。addEdge 後 solve()
class BipartiteMatching(val n: Int, val m: Int) {
  val g = Array(n) { mutableListOf<Int>() }
  val matchR = IntArray(m) { -1 }
  fun addEdge(u: Int, v: Int) { g[u].add(v) }
  fun dfs(u: Int, used: BooleanArray): Boolean {
    for (v in g[u]) {
      if (used[v]) continue
      used[v] = true
      if (matchR[v] == -1 || dfs(matchR[v], used)) { matchR[v] = u; return true }
    }
    return false
  }
  fun solve(): Int {
    var res = 0
    for (u in 0 until n) if (dfs(u, BooleanArray(m))) res++
    return res
  }
}`,
      python: `class BipartiteMatching:
    # 増加路 DFS O(VE)。左 n, 右 m
    def __init__(self, n, m):
        self.n, self.m = n, m
        self.g = [[] for _ in range(n)]
        self.match_r = [-1] * m
    def add_edge(self, u, v):
        self.g[u].append(v)
    def _dfs(self, u, used):
        for v in self.g[u]:
            if used[v]:
                continue
            used[v] = True
            if self.match_r[v] == -1 or self._dfs(self.match_r[v], used):
                self.match_r[v] = u
                return True
        return False
    def solve(self):
        res = 0
        for u in range(self.n):
            if self._dfs(u, [False] * self.m):
                res += 1
        return res`,
      java: `// 増加路 DFS O(VE)。左 n, 右 m
class BipartiteMatching {
  int n, m; List<Integer>[] g; int[] matchR;
  @SuppressWarnings("unchecked")
  BipartiteMatching(int n, int m) {
    this.n = n; this.m = m;
    g = new List[n];
    for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
    matchR = new int[m]; Arrays.fill(matchR, -1);
  }
  void addEdge(int u, int v) { g[u].add(v); }
  boolean dfs(int u, boolean[] used) {
    for (int v : g[u]) {
      if (used[v]) continue;
      used[v] = true;
      if (matchR[v] == -1 || dfs(matchR[v], used)) { matchR[v] = u; return true; }
    }
    return false;
  }
  int solve() {
    int res = 0;
    for (int u = 0; u < n; u++) if (dfs(u, new boolean[m])) res++;
    return res;
  }
}`,
      cpp: `// 増加路 DFS O(VE)。左 n, 右 m
struct BipartiteMatching {
  int n, m; vector<vector<int>> g; vector<int> matchR;
  BipartiteMatching(int n, int m) : n(n), m(m), g(n), matchR(m, -1) {}
  void add_edge(int u, int v) { g[u].push_back(v); }
  bool dfs(int u, vector<char>& used) {
    for (int v : g[u]) {
      if (used[v]) continue;
      used[v] = 1;
      if (matchR[v] == -1 || dfs(matchR[v], used)) { matchR[v] = u; return true; }
    }
    return false;
  }
  int solve() {
    int res = 0;
    for (int u = 0; u < n; u++) { vector<char> used(m, 0); if (dfs(u, used)) res++; }
    return res;
  }
};`,
    },
  },

  {
    id: 'dinic',
    cat: 'graph',
    title: 'Dinic 法 (最大流)',
    sub: '最大流 = 最小カット',
    cx: 'O(V²E)',
    lead: 'BFS でレベル分けし、レベル順に DFS で流す。最大流・最小カット・二部マッチングに。',
    diagram: `BFS でレベル(最短距離)を付ける
 → レベルが増える辺だけ DFS で流す
 逆辺(rev)に流量を戻し増加路を表現。繰り返す
最大流 = 最小カット。「同時不可の最小除去」に`,
    pitfalls: ['容量は溢れない型(Long)。INF も大きすぎない値', 'iter[] で見た辺を再訪しない(これが効率の肝)'],
    code: {
      kotlin: `// Dinic 最大流 O(V^2 E)。最大流=最小カット
class Dinic(val n: Int) {
  class E(val to: Int, var cap: Long, val rev: Int)
  val g = Array(n) { mutableListOf<E>() }
  val level = IntArray(n); val iter = IntArray(n)
  fun addEdge(from: Int, to: Int, cap: Long) {
    g[from].add(E(to, cap, g[to].size))
    g[to].add(E(from, 0, g[from].size - 1))
  }
  fun bfs(s: Int) {
    level.fill(-1); level[s] = 0
    val q = ArrayDeque<Int>(); q.add(s)
    while (q.isNotEmpty()) {
      val v = q.removeFirst()
      for (e in g[v]) if (e.cap > 0 && level[e.to] < 0) { level[e.to] = level[v] + 1; q.add(e.to) }
    }
  }
  fun dfs(v: Int, t: Int, f: Long): Long {
    if (v == t) return f
    while (iter[v] < g[v].size) {
      val e = g[v][iter[v]]
      if (e.cap > 0 && level[v] < level[e.to]) {
        val d = dfs(e.to, t, minOf(f, e.cap))
        if (d > 0) { e.cap -= d; g[e.to][e.rev].cap += d; return d }
      }
      iter[v]++
    }
    return 0
  }
  fun maxFlow(s: Int, t: Int): Long {
    var flow = 0L
    while (true) {
      bfs(s); if (level[t] < 0) return flow
      iter.fill(0)
      while (true) { val f = dfs(s, t, Long.MAX_VALUE / 4); if (f == 0L) break; flow += f }
    }
  }
}`,
      python: `from collections import deque
class Dinic:
    # 最大流 O(V^2 E)。各辺 [to, cap, rev]
    def __init__(self, n):
        self.n = n
        self.g = [[] for _ in range(n)]
    def add_edge(self, fr, to, cap):
        self.g[fr].append([to, cap, len(self.g[to])])
        self.g[to].append([fr, 0, len(self.g[fr]) - 1])
    def _bfs(self, s, t):
        self.level = [-1] * self.n
        self.level[s] = 0
        q = deque([s])
        while q:
            v = q.popleft()
            for to, cap, _ in self.g[v]:
                if cap > 0 and self.level[to] < 0:
                    self.level[to] = self.level[v] + 1
                    q.append(to)
        return self.level[t] >= 0
    def _dfs(self, v, t, f):
        if v == t:
            return f
        while self.it[v] < len(self.g[v]):
            e = self.g[v][self.it[v]]
            if e[1] > 0 and self.level[v] < self.level[e[0]]:
                d = self._dfs(e[0], t, min(f, e[1]))
                if d > 0:
                    e[1] -= d
                    self.g[e[0]][e[2]][1] += d
                    return d
            self.it[v] += 1
        return 0
    def max_flow(self, s, t):
        flow = 0
        while self._bfs(s, t):
            self.it = [0] * self.n
            while True:
                f = self._dfs(s, t, float('inf'))
                if f == 0:
                    break
                flow += f
        return flow`,
      java: `// Dinic 最大流 O(V^2 E)。各辺 {to, cap, rev}
class Dinic {
  int n; int[] level, iter; List<long[]>[] g;
  @SuppressWarnings("unchecked")
  Dinic(int n) {
    this.n = n; g = new List[n];
    for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
    level = new int[n]; iter = new int[n];
  }
  void addEdge(int from, int to, long cap) {
    g[from].add(new long[]{to, cap, g[to].size()});
    g[to].add(new long[]{from, 0, g[from].size() - 1});
  }
  void bfs(int s) {
    Arrays.fill(level, -1); level[s] = 0;
    ArrayDeque<Integer> q = new ArrayDeque<>(); q.add(s);
    while (!q.isEmpty()) {
      int v = q.poll();
      for (long[] e : g[v])
        if (e[1] > 0 && level[(int) e[0]] < 0) { level[(int) e[0]] = level[v] + 1; q.add((int) e[0]); }
    }
  }
  long dfs(int v, int t, long f) {
    if (v == t) return f;
    for (; iter[v] < g[v].size(); iter[v]++) {
      long[] e = g[v].get(iter[v]); int to = (int) e[0];
      if (e[1] > 0 && level[v] < level[to]) {
        long d = dfs(to, t, Math.min(f, e[1]));
        if (d > 0) { e[1] -= d; g[to].get((int) e[2])[1] += d; return d; }
      }
    }
    return 0;
  }
  long maxFlow(int s, int t) {
    long flow = 0;
    while (true) {
      bfs(s);
      if (level[t] < 0) return flow;
      Arrays.fill(iter, 0);
      long f;
      while ((f = dfs(s, t, Long.MAX_VALUE / 4)) > 0) flow += f;
    }
  }
}`,
      cpp: `// Dinic 最大流 O(V^2 E)。最大流=最小カット
struct Dinic {
  struct E { int to; ll cap; int rev; };
  int n; vector<vector<E>> g; vector<int> level, iter;
  Dinic(int n) : n(n), g(n), level(n), iter(n) {}
  void add_edge(int from, int to, ll cap) {
    g[from].push_back({to, cap, (int) g[to].size()});
    g[to].push_back({from, 0, (int) g[from].size() - 1});
  }
  void bfs(int s) {
    fill(level.begin(), level.end(), -1); level[s] = 0;
    queue<int> q; q.push(s);
    while (!q.empty()) {
      int v = q.front(); q.pop();
      for (auto& e : g[v]) if (e.cap > 0 && level[e.to] < 0) { level[e.to] = level[v] + 1; q.push(e.to); }
    }
  }
  ll dfs(int v, int t, ll f) {
    if (v == t) return f;
    for (; iter[v] < (int) g[v].size(); iter[v]++) {
      E& e = g[v][iter[v]];
      if (e.cap > 0 && level[v] < level[e.to]) {
        ll d = dfs(e.to, t, min(f, e.cap));
        if (d > 0) { e.cap -= d; g[e.to][e.rev].cap += d; return d; }
      }
    }
    return 0;
  }
  ll max_flow(int s, int t) {
    ll flow = 0;
    while (true) {
      bfs(s);
      if (level[t] < 0) return flow;
      fill(iter.begin(), iter.end(), 0);
      ll f;
      while ((f = dfs(s, t, (ll) 4e18)) > 0) flow += f;
    }
  }
};`,
    },
  },
]
