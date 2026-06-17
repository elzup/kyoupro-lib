// 配列操作 + 予選通過までに使う標準ライブラリの早見 (言語ごとに別ページ)。
// 各項目は state (中身の変化 before→after) を図示してからコードを見せる。
// build.mjs が renderArrBlock で描画する。group はチップ表示用のラベル。

export const arrayPatterns = [
  {
    id: 'create',
    group: '生成',
    title: '生成・初期化',
    sub: '1D / 2D / 値埋め',
    state: `IntArray(5)        → [0, 0, 0, 0, 0]
fill(-1)           → [-1,-1,-1,-1,-1]
2D h×w             → [[0,0,0], [0,0,0]]`,
    note: '長さ N の 0 埋め・値埋め、2 次元配列、可変リスト。',
    code: {
      kotlin: `val a = IntArray(n)                 // 0 埋め
val b = IntArray(n) { -1 }          // -1 埋め
val g = Array(h) { IntArray(w) }    // 2次元 h×w (0 埋め)
val list = mutableListOf<Int>()     // 可変リスト`,
      python: `a = [0] * n                         # 0 埋め
b = [-1] * n                        # -1 埋め
g = [[0] * w for _ in range(h)]     # 2次元 (× [[0]*w]*h は参照共有でバグ)
lst = []                            # 可変リスト`,
      java: `int[] a = new int[n];               // 0 埋め
int[] b = new int[n]; Arrays.fill(b, -1);   // -1 埋め
int[][] g = new int[h][w];          // 2次元
List<Integer> list = new ArrayList<>();`,
      cpp: `vector<int> a(n);                   // 0 埋め
vector<int> b(n, -1);               // -1 埋め
vector<vector<int>> g(h, vector<int>(w));   // 2次元
// vector<int> list; list.push_back(x);`,
    },
  },

  {
    id: 'iterate',
    group: '走査',
    title: '走査（添字つき）',
    sub: '値 / 添字 / 両方',
    state: `[10,20,30] → i=0:10  i=1:20  i=2:30`,
    note: '値だけ / 添字だけ / 添字と値の両方を回す 3 パターン。',
    code: {
      kotlin: `for (x in a) { }                    // 値
for (i in a.indices) { }            // 添字 (a[i])
for ((i, x) in a.withIndex()) { }   // 両方`,
      python: `for x in a: ...                     # 値
for i in range(len(a)): ...         # 添字
for i, x in enumerate(a): ...       # 両方`,
      java: `for (int x : a) { }                 // 値
for (int i = 0; i < a.length; i++){ }   // 添字`,
      cpp: `for (int x : a) { }                 // 値
for (int i = 0; i < (int)a.size(); i++){ }  // 添字`,
    },
  },

  {
    id: 'pushpop',
    group: '編集',
    title: '追加・取り出し（末尾/先頭）',
    sub: 'push/pop/shift/unshift',
    state: `[1,2] +3(末尾) → [1,2,3]   pop → 3, 残 [1,2]
[1,2] 先頭0     → [0,1,2]   shift → 0, 残 [1,2]`,
    note: '末尾の add/pop は O(1)。先頭の挿入/削除は配列だと O(N)、多用するなら Deque。',
    code: {
      kotlin: `val a = mutableListOf(1, 2)
a.add(3)                            // 末尾追加 (push)
val last = a.removeAt(a.size - 1)   // 末尾取り出し (pop)
a.add(0, 0)                         // 先頭挿入 (unshift, O(N))
val first = a.removeAt(0)           // 先頭取り出し (shift, O(N))`,
      python: `a = [1, 2]
a.append(3)                         # 末尾追加 (push)
last = a.pop()                      # 末尾取り出し (pop)
a.insert(0, 0)                      # 先頭挿入 (unshift, O(N))
first = a.pop(0)                    # 先頭取り出し (shift, O(N)) → deque 推奨`,
      java: `List<Integer> a = new ArrayList<>(List.of(1, 2));
a.add(3);                           // 末尾追加
int last = a.remove(a.size() - 1);  // 末尾取り出し
a.add(0, 0);                        // 先頭挿入 (O(N))
int first = a.remove(0);            // 先頭取り出し (O(N)) → ArrayDeque`,
      cpp: `vector<int> a = {1, 2};
a.push_back(3);                     // 末尾追加
int last = a.back(); a.pop_back();  // 末尾取り出し
a.insert(a.begin(), 0);             // 先頭挿入 (O(N))
a.erase(a.begin());                 // 先頭削除 (O(N)) → deque 推奨`,
    },
  },

  {
    id: 'concat',
    group: '編集',
    title: '連結・マージ',
    sub: 'concat / merge',
    state: `[1,2] ++ [3,4] → [1,2,3,4]
ソート済 [1,3] と [2,4] を merge → [1,2,3,4]`,
    note: '2 つの列をつなぐ。両方ソート済みなら merge で O(N) に整列したまま結合。',
    code: {
      kotlin: `val c = a + b                       // 連結 (新 List)
val merged = (a + b).sorted()       // つないで整列`,
      python: `c = a + b                           # 連結
import heapq
m = list(heapq.merge(a, b))         # ソート済 2 列を O(N) マージ`,
      java: `List<Integer> c = new ArrayList<>(a);
c.addAll(b);                        // 連結`,
      cpp: `vector<int> c = a;
c.insert(c.end(), b.begin(), b.end());          // 連結
vector<int> m;
merge(a.begin(), a.end(), b.begin(), b.end(), back_inserter(m)); // ソート済マージ`,
    },
  },

  {
    id: 'unique',
    group: '編集',
    title: '重複除去',
    sub: 'distinct / unique',
    state: `[1,1,2,3,3] → [1,2,3]`,
    note: '順序を保つ重複除去と、ソートして潰す方法。',
    code: {
      kotlin: `val u = a.distinct()                // 順序保持
val us = a.toSortedSet().toList()   // ソート + 重複排除`,
      python: `u = list(dict.fromkeys(a))          # 順序保持
us = sorted(set(a))                 # ソート + 重複排除`,
      java: `List<Integer> u = a.stream().distinct().collect(Collectors.toList());`,
      cpp: `sort(a.begin(), a.end());
a.erase(unique(a.begin(), a.end()), a.end());   // unique は隣接重複を後ろへ寄せる`,
    },
  },

  {
    id: 'contains',
    group: '探索',
    title: '含む・位置',
    sub: 'contains / indexOf',
    state: `[5,3,9] 3を含む? → true   9の位置 → 2`,
    note: '存在判定と添字。配列の contains は O(N)（多用なら Set 化で O(1)）。',
    code: {
      kotlin: `val has = 3 in a                    // 含むか
val idx = a.indexOf(9)              // 無ければ -1`,
      python: `has = 3 in a                        # O(N) (集合化で O(1))
idx = a.index(9) if 9 in a else -1  # index は無いと例外`,
      java: `boolean has = list.contains(3);
int idx = list.indexOf(9);          // 無ければ -1`,
      cpp: `bool has = find(a.begin(), a.end(), 3) != a.end();
int idx = find(a.begin(), a.end(), 9) - a.begin();  // 無いと size()`,
    },
  },

  {
    id: 'aggregate',
    group: '集計',
    title: '合計・最大・最小',
    sub: 'sum / max / min',
    state: `[3,1,2] → sum=6  max=3  min=1`,
    note: '合計はオーバーフローに注意（Long で受ける）。空配列の max/min は例外。',
    code: {
      kotlin: `val s = a.sumOf { it.toLong() }     // Long で集計 (溢れ防止)
val mx = a.max(); val mn = a.min()  // 空は例外 → maxOrNull()`,
      python: `s = sum(a)
mx = max(a); mn = min(a)            # 空はエラー → max(a, default=0)`,
      java: `long s = 0; for (int x : a) s += x; // long で集計
int mx = Arrays.stream(a).max().getAsInt();
int mn = Arrays.stream(a).min().getAsInt();`,
      cpp: `ll s = accumulate(a.begin(), a.end(), 0LL);  // 0LL で long long
int mx = *max_element(a.begin(), a.end());
int mn = *min_element(a.begin(), a.end());`,
    },
  },

  {
    id: 'count',
    group: '集計',
    title: '条件カウント・抽出',
    sub: 'count / filter',
    state: `[1,2,3,4] → even を抽出 → [2,4]  cnt=2`,
    note: '条件を満たす個数を数える / 満たす要素だけ取り出す。',
    code: {
      kotlin: `val cnt = a.count { it % 2 == 0 }
val evens = a.filter { it % 2 == 0 }`,
      python: `cnt = sum(1 for x in a if x % 2 == 0)
evens = [x for x in a if x % 2 == 0]`,
      java: `long cnt = Arrays.stream(a).filter(x -> x % 2 == 0).count();
int[] evens = Arrays.stream(a).filter(x -> x % 2 == 0).toArray();`,
      cpp: `int cnt = count_if(a.begin(), a.end(), [](int x){ return x%2==0; });
vector<int> evens; for (int x : a) if (x%2==0) evens.push_back(x);`,
    },
  },

  {
    id: 'map',
    group: '変換',
    title: '変換（map）',
    sub: '各要素を加工',
    state: `[1,2,3] → ×2 → [2,4,6]`,
    note: '各要素に同じ加工をして新しい列を作る。',
    code: {
      kotlin: `val b = a.map { it * 2 }            // List<Int>`,
      python: `b = [x * 2 for x in a]`,
      java: `int[] b = Arrays.stream(a).map(x -> x * 2).toArray();`,
      cpp: `vector<int> b(a.size());
for (size_t i = 0; i < a.size(); i++) b[i] = a[i] * 2;`,
    },
  },

  {
    id: 'sort',
    group: '整列',
    title: 'ソート（昇順・降順・キー）',
    sub: 'sort / desc / key',
    state: `[3,1,2] → 昇順 [1,2,3] / 降順 [3,2,1]`,
    note: '破壊的か非破壊か、降順、キー指定（複数キー）を押さえる。',
    code: {
      kotlin: `a.sort()                            // 破壊的・昇順
val asc = a.sorted()                // 非破壊 (List)
val desc = a.sortedDescending()
list.sortBy { it.second }           // キー指定`,
      python: `a.sort()                            # 破壊的・昇順
asc = sorted(a)                     # 非破壊
desc = sorted(a, reverse=True)
pairs.sort(key=lambda p: p[1])      # キー指定`,
      java: `Arrays.sort(a);                     // 昇順 (プリミティブは昇順のみ)
list.sort(Comparator.reverseOrder());           // 降順
list.sort(Comparator.comparingInt(p -> p.b));   // キー指定`,
      cpp: `sort(a.begin(), a.end());           // 昇順
sort(a.rbegin(), a.rend());         // 降順
sort(v.begin(), v.end(), [](auto&x, auto&y){ return x.second < y.second; });`,
    },
  },

  {
    id: 'reverse',
    group: '整列',
    title: '反転・回転・スライス',
    sub: 'reverse / slice',
    state: `[1,2,3,4] → 反転 [4,3,2,1] / [1,3) = [2,3]`,
    note: '反転、部分列の切り出し（半開区間 [l, r)）、左 k 回転。',
    code: {
      kotlin: `val r = a.reversed()                // List
val sub = a.slice(1..2)             // 添字 1..2`,
      python: `r = a[::-1]                         # 反転
sub = a[1:3]                        # [1,3)
rot = a[k:] + a[:k]                 # 左 k 回転`,
      java: `int[] sub = Arrays.copyOfRange(a, 1, 3);    // [1,3)
// 反転(List): Collections.reverse(list);`,
      cpp: `reverse(a.begin(), a.end());                // 破壊的反転
vector<int> sub(a.begin()+1, a.begin()+3);  // [1,3)
rotate(a.begin(), a.begin()+k, a.end());    // 左 k 回転`,
    },
  },

  {
    id: 'argmax',
    group: '探索',
    title: '最大の位置（argmax）',
    sub: '値でなく添字',
    state: `[3,9,1] → maxIdx = 1 (値 9)`,
    note: '「最大値そのもの」でなく「最大の添字」が欲しいとき。',
    code: {
      kotlin: `val idx = a.indices.maxByOrNull { a[it] }!!`,
      python: `idx = max(range(len(a)), key=lambda i: a[i])`,
      java: `int idx = 0;
for (int i = 1; i < a.length; i++) if (a[i] > a[idx]) idx = i;`,
      cpp: `int idx = max_element(a.begin(), a.end()) - a.begin();`,
    },
  },

  {
    id: 'prefix',
    group: '集計',
    title: '累積和',
    sub: '区間和を O(1)',
    state: `a=[1,2,3] → pre=[0,1,3,6]
sum[l,r) = pre[r] - pre[l]`,
    note: '前計算 O(N)、以後どの区間和も O(1)。pre は長さ N+1、半開区間で引く。',
    code: {
      kotlin: `val pre = LongArray(n + 1)
for (i in 0 until n) pre[i + 1] = pre[i] + a[i]
val s = pre[r] - pre[l]             // [l, r)`,
      python: `from itertools import accumulate
pre = [0] + list(accumulate(a))
s = pre[r] - pre[l]                 # [l, r)`,
      java: `long[] pre = new long[n + 1];
for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];
long s = pre[r] - pre[l];           // [l, r)`,
      cpp: `vector<ll> pre(n + 1);
for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];
ll s = pre[r] - pre[l];             // [l, r)`,
    },
  },

  {
    id: 'transpose',
    group: '変換',
    title: '2次元・転置',
    sub: '行列の行↔列',
    state: `[[1,2,3],
 [4,5,6]]  →  [[1,4],
              [2,5],
              [3,6]]`,
    note: 'h×w を w×h に。grid[i][j] → t[j][i]。',
    code: {
      kotlin: `val t = Array(w) { j -> IntArray(h) { i -> g[i][j] } }`,
      python: `t = [list(row) for row in zip(*g)]      # 転置の定番`,
      java: `int[][] t = new int[w][h];
for (int i = 0; i < h; i++)
  for (int j = 0; j < w; j++) t[j][i] = g[i][j];`,
      cpp: `vector<vector<int>> t(w, vector<int>(h));
for (int i = 0; i < h; i++)
  for (int j = 0; j < w; j++) t[j][i] = g[i][j];`,
    },
  },

  {
    id: 'pq',
    group: 'コレクション',
    title: '優先度付きキュー',
    sub: '最小 / 最大ヒープ',
    state: `push 3,1,2 → poll → 1,2,3  (最小ヒープ)
add/poll は O(log N)`,
    note: 'Dijkstra・貪欲で頻出。「常に最小（or 最大）を取り出す」袋。',
    code: {
      kotlin: `val pq = PriorityQueue<Int>()                 // 最小ヒープ
val mx = PriorityQueue<Int>(reverseOrder())   // 最大ヒープ
pq.add(3); pq.add(1)
val top = pq.poll()                           // 最小を取り出す`,
      python: `import heapq
pq = []
heapq.heappush(pq, 3)               # 最小ヒープのみ
x = heapq.heappop(pq)
# 最大は符号反転: heappush(pq, -v); -heappop(pq)`,
      java: `PriorityQueue<Integer> pq = new PriorityQueue<>();   // 最小
PriorityQueue<Integer> mx =
    new PriorityQueue<>(Collections.reverseOrder());     // 最大
pq.add(3); int top = pq.poll();`,
      cpp: `priority_queue<int> mx;                         // 最大ヒープ (既定)
priority_queue<int, vector<int>, greater<>> mn; // 最小ヒープ
mx.push(3); int t = mx.top(); mx.pop();`,
    },
  },

  {
    id: 'deque',
    group: 'コレクション',
    title: 'Deque / Queue / Stack',
    sub: '両端 push/pop',
    state: `BFS=Queue(先入れ先出し) / DFS=Stack(後入れ先出し)
front [ . . . ] back`,
    note: '両端から出し入れできる。Queue は BFS、Stack は DFS に使う。',
    code: {
      kotlin: `val dq = ArrayDeque<Int>()
dq.addLast(1); dq.addFirst(0)       // 両端追加
val f = dq.removeFirst(); val l = dq.removeLast()
// Queue=addLast/removeFirst, Stack=addLast/removeLast`,
      python: `from collections import deque
dq = deque()
dq.append(1); dq.appendleft(0)
f = dq.popleft(); l = dq.pop()`,
      java: `Deque<Integer> dq = new ArrayDeque<>();
dq.addLast(1); dq.addFirst(0);
int f = dq.pollFirst(), l = dq.pollLast();`,
      cpp: `deque<int> dq;
dq.push_back(1); dq.push_front(0);
int f = dq.front(); dq.pop_front();
// queue<int> / stack<int> も同様`,
    },
  },

  {
    id: 'set',
    group: 'コレクション',
    title: 'Set（重複排除・存在判定）',
    sub: 'contains O(1)',
    state: `[1,1,2,3] → {1,2,3}  (3 in set? → true)`,
    note: '重複を消す / 含まれるかを高速判定。順序つきが要るなら Tree/std::set。',
    code: {
      kotlin: `val s = a.toHashSet()               // 重複排除
if (3 in s) { }                     // 存在判定 O(1)
val ts = a.toSortedSet()            // 順序つき (TreeSet)`,
      python: `s = set(a)
if 3 in s: ...`,
      java: `Set<Integer> s = new HashSet<>();
for (int x : a) s.add(x);
if (s.contains(3)) { }`,
      cpp: `set<int> s(a.begin(), a.end());     // 重複排除 + 昇順
if (s.count(3)) { }                 // unordered_set は平均 O(1)`,
    },
  },

  {
    id: 'mapcount',
    group: 'コレクション',
    title: 'Map（頻度カウント）',
    sub: '値 → 個数',
    state: `[a,b,a] → {a:2, b:1}`,
    note: '出現回数の数え上げが定番。無いキーの既定 0 の扱いが言語差。',
    code: {
      kotlin: `val cnt = HashMap<Int, Int>()
for (x in a) cnt[x] = (cnt[x] ?: 0) + 1
val c = cnt.getOrDefault(x, 0)
// a.groupingBy { it }.eachCount() でも`,
      python: `from collections import Counter
cnt = Counter(a)                    # {値: 個数}
c = cnt[x]                          # 無ければ 0`,
      java: `Map<Integer, Integer> cnt = new HashMap<>();
for (int x : a) cnt.merge(x, 1, Integer::sum);
int c = cnt.getOrDefault(x, 0);`,
      cpp: `map<int, int> cnt;
for (int x : a) cnt[x]++;           // 既定 0 から +1
int c = cnt[x];                     // 注意: 参照で要素が増える`,
    },
  },

  {
    id: 'bisect',
    group: '探索',
    title: '二分探索（挿入位置）',
    sub: 'lower / upper bound',
    state: `sorted=[1,3,5,7]  x=5
lower=2 (5以上の先頭) / upper=3 (5より大の先頭)`,
    note: 'ソート済み配列で「x 以上が始まる位置」。x の個数 = upper - lower。',
    code: {
      kotlin: `// list はソート済み
val i = a.toList().binarySearch(x)  // 見つかれば添字、無ければ -(挿入点)-1
val ins = if (i < 0) -i - 1 else i  // 挿入位置`,
      python: `import bisect
lo = bisect.bisect_left(a, x)       # x 以上の先頭 (lower_bound)
hi = bisect.bisect_right(a, x)      # x より大の先頭 (upper_bound)`,
      java: `int i = Arrays.binarySearch(a, x);  // 無ければ -(挿入点)-1
int ins = i < 0 ? -i - 1 : i;`,
      cpp: `int lo = lower_bound(a.begin(), a.end(), x) - a.begin(); // x 以上の先頭
int hi = upper_bound(a.begin(), a.end(), x) - a.begin(); // x より大`,
    },
  },

  {
    id: 'str',
    group: '文字列',
    title: '文字列 ⇄ 配列',
    sub: 'split / join',
    state: `"a b c" → split → [a, b, c]
[a, b, c] → join(" ") → "a b c"`,
    note: '空白区切りで分解、配列を連結、文字単位の配列化。',
    code: {
      kotlin: `val parts = s.split(" ")
val nums = s.split(" ").map { it.toInt() }
val joined = list.joinToString(" ")
val chars = s.toCharArray()`,
      python: `parts = s.split()                   # 空白で分解
nums = list(map(int, s.split()))
joined = " ".join(map(str, lst))
chars = list(s)`,
      java: `String[] parts = s.split(" ");
String joined = String.join(" ", arr);
char[] cs = s.toCharArray();`,
      cpp: `stringstream ss(s); string w;       // split は stringstream
while (ss >> w) parts.push_back(w);
// join: 自前ループで " " を挟む`,
    },
  },
]
