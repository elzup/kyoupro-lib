// snippets.mjs の 4 言語コードを実際にコンパイル/実行して正しさを検証する。
// 各言語: 全スニペットを連結 + テスト main を付けてビルド・実行。
import { execSync } from 'node:child_process'
import { writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { snippets } from './snippets.mjs'

const dir = join(tmpdir(), 'kyolib_verify')
rmSync(dir, { recursive: true, force: true })
mkdirSync(dir, { recursive: true })

const codeOf = (lang) => snippets.map((s) => s.code[lang]).join('\n\n')

const run = (label, cmd) => {
  try {
    const out = execSync(cmd, { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'] })
    console.log(`  ${out.toString().trim()}`)
    return true
  } catch (e) {
    console.log(`  ${label} FAILED`)
    console.log((e.stdout?.toString() || '') + (e.stderr?.toString() || ''))
    return false
  }
}

// ---- Kotlin (import を先頭へ巻き上げ) ----
const ktBodies = snippets.map((s) => s.code.kotlin)
const ktImports = new Set()
const ktStripped = ktBodies.map((b) =>
  b
    .split('\n')
    .filter((l) => {
      if (/^import /.test(l)) { ktImports.add(l); return false }
      return true
    })
    .join('\n')
)
const kt = `${[...ktImports].join('\n')}

${ktStripped.join('\n\n')}

fun main() {
  val uf = UnionFind(5); uf.union(0,1); uf.union(2,3); uf.union(1,2)
  require(uf.same(0,3) && !uf.same(0,4) && uf.size(0)==4)
  require(inversions(intArrayOf(3,1,4,1,5,9,2,6))==8L)
  val g = Array(3){ mutableListOf<Pair<Int,Long>>() }
  g[0].add(1 to 5L); g[0].add(2 to 2L); g[2].add(1 to 1L)
  require(dijkstra(g,0).contentEquals(longArrayOf(0,3,2)))
  require(gridBfs(arrayOf("...","...","..."),0,0)[2][2]==4)
  require(bisect(1000,0){ it*it>=1000 }==32L)
  require(lowerBound(longArrayOf(1,3,3,5,7),3)==1 && upperBound(longArrayOf(1,3,3,5,7),3)==3)
  val ps = prefixSum(longArrayOf(1,2,3,4,5)); require(ps[4]-ps[1]==9L)
  val im = Imos(5); im.add(0,3,1); im.add(2,5,10)
  require(im.build().contentEquals(longArrayOf(1,1,11,10,10)))
  require(modpow(2,10)==1024L && modinv(2)*2%MOD==1L)
  require(Comb(100).nCr(10,3)==120L)
  require(sieve(20).let{ it[17] && !it[15] && !it[1] })
  require(gcd(12,18)==6L && lcm(4,6)==12L)
  val (gg,x,y)=extGcd(111,30); require(gg==3L && 111*x+30*y==3L)
  require(knapsack01(intArrayOf(2,1,3,2),longArrayOf(3,2,4,2),5)==7L)
  require(subsetSum(intArrayOf(3,5,7),12) && !subsetSum(intArrayOf(3,5,7),11))
  val st = SegTree(5, Long.MAX_VALUE) { x, y -> minOf(x, y) }
  listOf(5L,3L,7L,1L,9L).forEachIndexed { i, v -> st.update(i, v) }
  require(st.query(0,3)==3L && st.query(2,5)==1L)
  val (cc, vals) = compress(longArrayOf(100,50,100,7))
  require(cc.contentEquals(intArrayOf(2,1,2,0)) && vals.contentEquals(longArrayOf(7,50,100)))
  require(bellmanFord(3, listOf(Edge(0,1,5),Edge(0,2,2),Edge(2,1,-1)), 0)!![1]==1L)
  require(bellmanFord(3, listOf(Edge(0,1,1),Edge(1,2,-5),Edge(2,1,1)), 0)==null)
  val INF = Long.MAX_VALUE / 4
  val wf = Array(3){ i -> LongArray(3){ j -> if (i==j) 0L else INF } }
  wf[0][1]=5; wf[0][2]=2; wf[2][1]=1; warshallFloyd(wf); require(wf[0][1]==3L)
  val tg = Array(3){ mutableListOf<Int>() }; tg[2].add(0); tg[0].add(1)
  require(topoSort(tg)==listOf(2,0,1)); tg[1].add(2); require(topoSort(tg)==null)
  require(kruskal(3, listOf(WEdge(0,1,10),WEdge(1,2,5),WEdge(0,2,3)))==8L)
  require(longestAtMost(longArrayOf(1,2,1,1,3),4)==3 && countAtLeast(longArrayOf(1,2,3),4)==2L)
  val perm = intArrayOf(0,1,2); var pc = 1
  while (nextPermutation(perm)) pc++
  require(pc==6 && perm.contentEquals(intArrayOf(2,1,0)))
  require(lis(intArrayOf(4,2,3,1,5))==3)
  require(lcs("axbycz","abc")==3 && editDistance("kitten","sitting")==3)
  require(factorize(360)==mapOf(2L to 3, 3L to 2, 5L to 1))
  require(divisors(12)==listOf(1L,2L,3L,4L,6L,12L) && isPrime(17) && !isPrime(1))
  val td = arrayOf(longArrayOf(0,1,10,10),longArrayOf(10,0,1,10),longArrayOf(10,10,0,1),longArrayOf(1,10,10,0))
  require(tsp(td)==4L)
  val rh = RollingHash("abcabc")
  require(rh.get(0,3)==rh.get(3,6) && rh.get(0,2)!=rh.get(1,3))
  require(ccw(P(0.0,0.0),P(1.0,0.0),P(1.0,1.0))==1 && ccw(P(0.0,0.0),P(1.0,0.0),P(1.0,-1.0))==-1)
  require(ccw(P(0.0,0.0),P(2.0,0.0),P(1.0,0.0))==0)
  require(segIntersect(P(0.0,0.0),P(2.0,2.0),P(0.0,2.0),P(2.0,0.0)))
  require(!segIntersect(P(0.0,0.0),P(1.0,1.0),P(2.0,0.0),P(3.0,1.0)))
  require(convexHull(listOf(P(0.0,0.0),P(2.0,0.0),P(2.0,2.0),P(0.0,2.0),P(1.0,1.0),P(1.0,0.0))).size==4)
  require(kotlin.math.abs(polygonArea(listOf(P(0.0,0.0),P(2.0,0.0),P(2.0,2.0),P(0.0,2.0))) - 4.0) < 1e-9)
  val bm = BipartiteMatching(3, 3)
  bm.addEdge(0,0); bm.addEdge(0,1); bm.addEdge(1,0); bm.addEdge(2,2)
  require(bm.solve()==3)
  val din = Dinic(6)
  din.addEdge(0,1,1); din.addEdge(0,2,1); din.addEdge(1,3,1); din.addEdge(1,4,1)
  din.addEdge(2,3,1); din.addEdge(3,5,1); din.addEdge(4,5,1)
  require(din.maxFlow(0,5)==2L)
  println("kotlin OK")
}`
writeFileSync(join(dir, 'Verify.kt'), kt)

// ---- Python ----
const py = `${codeOf('python')}

uf = UnionFind(5); uf.union(0,1); uf.union(2,3); uf.union(1,2)
assert uf.same(0,3) and not uf.same(0,4) and uf.size(0)==4
assert inversions([3,1,4,1,5,9,2,6])==8
g=[[(1,5),(2,2)],[],[(1,1)]]
assert dijkstra(g,0)==[0,3,2]
assert grid_bfs(["...","...","..."],0,0)[2][2]==4
assert bisect_meguru(1000,0,lambda m:m*m>=1000)==32
assert bisect_left([1,3,3,5,7],3)==1 and bisect_right([1,3,3,5,7],3)==3
ps=prefix_sum([1,2,3,4,5]); assert ps[4]-ps[1]==9
im=Imos(5); im.add(0,3,1); im.add(2,5,10); assert im.build()==[1,1,11,10,10]
assert modpow(2,10)==1024 and modinv(2)*2%MOD==1
assert Comb(100).nCr(10,3)==120
sp=sieve(20); assert sp[17] and not sp[15] and not sp[1]
assert gcd(12,18)==6 and lcm(4,6)==12
gg,x,y=ext_gcd(111,30); assert gg==3 and 111*x+30*y==3
assert knapsack01([2,1,3,2],[3,2,4,2],5)==7
assert subset_sum([3,5,7],12) and not subset_sum([3,5,7],11)
st = SegTree(5, float('inf'), min)
for i, v in enumerate([5,3,7,1,9]): st.update(i, v)
assert st.query(0,3)==3 and st.query(2,5)==1
cc, vals = compress([100,50,100,7]); assert cc==[2,1,2,0] and vals==[7,50,100]
assert bellman_ford(3,[(0,1,5),(0,2,2),(2,1,-1)],0)[1]==1
assert bellman_ford(3,[(0,1,1),(1,2,-5),(2,1,1)],0) is None
INF = float('inf')
wf = [[0 if i==j else INF for j in range(3)] for i in range(3)]
wf[0][1]=5; wf[0][2]=2; wf[2][1]=1; warshall_floyd(wf); assert wf[0][1]==3
assert topo_sort([[1],[],[0]])==[2,0,1]
assert topo_sort([[1],[2],[0]]) is None
assert kruskal(3,[(10,0,1),(5,1,2),(3,0,2)])==8
assert longest_at_most([1,2,1,1,3],4)==3 and count_at_least([1,2,3],4)==2
perm=[0,1,2]; pc=1
while next_permutation(perm): pc+=1
assert pc==6 and perm==[2,1,0]
assert lis([4,2,3,1,5])==3
assert lcs("axbycz","abc")==3 and edit_distance("kitten","sitting")==3
assert factorize(360)=={2:3,3:2,5:1}
assert divisors(12)==[1,2,3,4,6,12] and is_prime(17) and not is_prime(1)
td=[[0,1,10,10],[10,0,1,10],[10,10,0,1],[1,10,10,0]]
assert tsp(td)==4
rh=RollingHash("abcabc")
assert rh.get(0,3)==rh.get(3,6) and rh.get(0,2)!=rh.get(1,3)
assert ccw((0,0),(1,0),(1,1))==1 and ccw((0,0),(1,0),(1,-1))==-1 and ccw((0,0),(2,0),(1,0))==0
assert seg_intersect((0,0),(2,2),(0,2),(2,0))
assert not seg_intersect((0,0),(1,1),(2,0),(3,1))
assert len(convex_hull([(0,0),(2,0),(2,2),(0,2),(1,1),(1,0)]))==4
assert abs(polygon_area([(0,0),(2,0),(2,2),(0,2)]) - 4.0) < 1e-9
bm=BipartiteMatching(3,3)
for u,v in [(0,0),(0,1),(1,0),(2,2)]: bm.add_edge(u,v)
assert bm.solve()==3
din=Dinic(6)
for f,t,c in [(0,1,1),(0,2,1),(1,3,1),(1,4,1),(2,3,1),(3,5,1),(4,5,1)]: din.add_edge(f,t,c)
assert din.max_flow(0,5)==2
print("python OK")`
writeFileSync(join(dir, 'verify.py'), py)

// ---- Java (top-level class -> static nested) ----
const javaBody = codeOf('java').replace(/^class /gm, 'static class ')
const java = `import java.util.*;
public class Main {
${javaBody}
  static void ck(boolean b){ if(!b) throw new RuntimeException("CHECK FAILED"); }
  public static void main(String[] args){
    UnionFind uf=new UnionFind(5); uf.union(0,1); uf.union(2,3); uf.union(1,2);
    ck(uf.same(0,3) && !uf.same(0,4) && uf.size(0)==4);
    ck(inversions(new int[]{3,1,4,1,5,9,2,6})==8);
    @SuppressWarnings("unchecked") List<long[]>[] g=new List[3];
    for(int i=0;i<3;i++) g[i]=new ArrayList<>();
    g[0].add(new long[]{1,5}); g[0].add(new long[]{2,2}); g[2].add(new long[]{1,1});
    ck(Arrays.equals(dijkstra(g,0), new long[]{0,3,2}));
    char[][] grid={{'.','.','.'},{'.','.','.'},{'.','.','.'}};
    ck(gridBfs(grid,0,0)[2][2]==4);
    ck(bisect(1000,0,m->m*m>=1000)==32);
    ck(lowerBound(new long[]{1,3,3,5,7},3)==1 && upperBound(new long[]{1,3,3,5,7},3)==3);
    long[] ps=prefixSum(new long[]{1,2,3,4,5}); ck(ps[4]-ps[1]==9);
    Imos im=new Imos(5); im.add(0,3,1); im.add(2,5,10);
    ck(Arrays.equals(im.build(), new long[]{1,1,11,10,10}));
    ck(modpow(2,10,MOD)==1024 && modinv(2,MOD)*2%MOD==1);
    ck(new Comb(100,MOD).nCr(10,3)==120);
    boolean[] sp=sieve(20); ck(sp[17] && !sp[15] && !sp[1]);
    ck(gcd(12,18)==6 && lcm(4,6)==12);
    long[] eg=extGcd(111,30); ck(eg[0]==3 && 111*eg[1]+30*eg[2]==3);
    ck(knapsack01(new int[]{2,1,3,2}, new long[]{3,2,4,2}, 5)==7);
    ck(subsetSum(new int[]{3,5,7},12) && !subsetSum(new int[]{3,5,7},11));
    SegTree<Long> st = new SegTree<>(5, Long.MAX_VALUE, (x,y)->Math.min(x,y));
    long[] sv={5,3,7,1,9}; for(int i=0;i<5;i++) st.update(i, sv[i]);
    ck(st.query(0,3)==3L && st.query(2,5)==1L);
    ck(Arrays.equals(compress(new long[]{100,50,100,7}), new int[]{2,1,2,0}));
    ck(bellmanFord(3, new long[][]{{0,1,5},{0,2,2},{2,1,-1}}, 0)[1]==1);
    ck(bellmanFord(3, new long[][]{{0,1,1},{1,2,-5},{2,1,1}}, 0)==null);
    long INF=Long.MAX_VALUE/4; long[][] wf=new long[3][3];
    for(int i=0;i<3;i++)for(int j=0;j<3;j++) wf[i][j]=i==j?0:INF;
    wf[0][1]=5; wf[0][2]=2; wf[2][1]=1; warshallFloyd(wf); ck(wf[0][1]==3);
    @SuppressWarnings("unchecked") List<Integer>[] tg=new List[3];
    for(int i=0;i<3;i++) tg[i]=new ArrayList<>();
    tg[2].add(0); tg[0].add(1);
    ck(topoSort(tg).equals(Arrays.asList(2,0,1)));
    tg[1].add(2); ck(topoSort(tg)==null);
    ck(kruskal(3, new long[][]{{10,0,1},{5,1,2},{3,0,2}})==8);
    ck(longestAtMost(new long[]{1,2,1,1,3},4)==3 && countAtLeast(new long[]{1,2,3},4)==2);
    int[] perm={0,1,2}; int pc=1;
    while(nextPermutation(perm)) pc++;
    ck(pc==6 && Arrays.equals(perm, new int[]{2,1,0}));
    ck(lis(new int[]{4,2,3,1,5})==3);
    ck(lcs("axbycz","abc")==3 && editDistance("kitten","sitting")==3);
    ck(factorize(360).equals(Map.of(2L,3,3L,2,5L,1)));
    ck(divisors(12).equals(Arrays.asList(1L,2L,3L,4L,6L,12L)) && isPrime(17) && !isPrime(1));
    long[][] td={{0,1,10,10},{10,0,1,10},{10,10,0,1},{1,10,10,0}};
    ck(tsp(td)==4);
    RollingHash rh=new RollingHash("abcabc");
    ck(rh.get(0,3)==rh.get(3,6) && rh.get(0,2)!=rh.get(1,3));
    ck(ccw(new double[]{0,0},new double[]{1,0},new double[]{1,1})==1);
    ck(ccw(new double[]{0,0},new double[]{1,0},new double[]{1,-1})==-1);
    ck(ccw(new double[]{0,0},new double[]{2,0},new double[]{1,0})==0);
    ck(segIntersect(new double[]{0,0},new double[]{2,2},new double[]{0,2},new double[]{2,0}));
    ck(!segIntersect(new double[]{0,0},new double[]{1,1},new double[]{2,0},new double[]{3,1}));
    List<double[]> gp=new ArrayList<>(java.util.Arrays.asList(
      new double[]{0,0},new double[]{2,0},new double[]{2,2},new double[]{0,2},new double[]{1,1},new double[]{1,0}));
    ck(convexHull(gp).size()==4);
    List<double[]> sq=java.util.Arrays.asList(
      new double[]{0,0},new double[]{2,0},new double[]{2,2},new double[]{0,2});
    ck(Math.abs(polygonArea(sq) - 4.0) < 1e-9);
    BipartiteMatching bm=new BipartiteMatching(3,3);
    bm.addEdge(0,0); bm.addEdge(0,1); bm.addEdge(1,0); bm.addEdge(2,2);
    ck(bm.solve()==3);
    Dinic din=new Dinic(6);
    din.addEdge(0,1,1); din.addEdge(0,2,1); din.addEdge(1,3,1); din.addEdge(1,4,1);
    din.addEdge(2,3,1); din.addEdge(3,5,1); din.addEdge(4,5,1);
    ck(din.maxFlow(0,5)==2);
    System.out.println("java OK");
  }
}`
writeFileSync(join(dir, 'Main.java'), java)

// ---- C++ ----
// 本番 judge は <bits/stdc++.h> だが mac clang に無いので検証用に明示 include
const cpp = `#include <vector>
#include <queue>
#include <string>
#include <map>
#include <algorithm>
#include <numeric>
#include <utility>
#include <functional>
#include <cassert>
#include <cstdio>
#include <cmath>
using namespace std;
using ll = long long;

${codeOf('cpp')}

int main(){
  UnionFind uf(5); uf.unite(0,1); uf.unite(2,3); uf.unite(1,2);
  assert(uf.same(0,3) && !uf.same(0,4) && uf.size(0)==4);
  vector<int> inv={3,1,4,1,5,9,2,6}; assert(inversions(inv)==8);
  vector<vector<pair<int,ll>>> g(3);
  g[0]={{1,5},{2,2}}; g[2]={{1,1}};
  assert((dijkstra(g,0)==vector<ll>{0,3,2}));
  vector<string> grid={"...","...","..."};
  assert(grid_bfs(grid,0,0)[2][2]==4);
  assert(bisect(1000,0,[](ll m){return m*m>=1000;})==32);
  vector<ll> pa={1,2,3,4,5}; auto ps=prefix_sum(pa); assert(ps[4]-ps[1]==9);
  Imos im(5); im.add(0,3,1); im.add(2,5,10);
  assert((im.build()==vector<ll>{1,1,11,10,10}));
  assert(modpow(2,10)==1024 && modinv(2)*2%MOD==1);
  assert(Comb(100).nCr(10,3)==120);
  auto sp=sieve(20); assert(sp[17] && !sp[15] && !sp[1]);
  assert(gcdll(12,18)==6 && lcmll(4,6)==12);
  ll x,y,gg=ext_gcd(111,30,x,y); assert(gg==3 && 111*x+30*y==3);
  vector<int> w={2,1,3,2}; vector<ll> v={3,2,4,2}; assert(knapsack01(w,v,5)==7);
  vector<int> ss={3,5,7}; assert(subset_sum(ss,12) && !subset_sum(ss,11));
  SegTree<ll> st(5, (ll)4e18, [](ll a, ll b){ return min(a, b); });
  ll sv[]={5,3,7,1,9}; for(int i=0;i<5;i++) st.update(i, sv[i]);
  assert(st.query(0,3)==3 && st.query(2,5)==1);
  vector<ll> ca={100,50,100,7}, cvals; auto cc=compress(ca, cvals);
  assert((cc==vector<int>{2,1,2,0} && cvals==vector<ll>{7,50,100}));
  vector<BFEdge> be={{0,1,5},{0,2,2},{2,1,-1}}; bool bok;
  auto bd=bellman_ford(3, be, 0, bok); assert(bok && bd[1]==1);
  vector<BFEdge> bn={{0,1,1},{1,2,-5},{2,1,1}}; bool bok2;
  bellman_ford(3, bn, 0, bok2); assert(!bok2);
  ll INF=4e18; vector<vector<ll>> wf(3, vector<ll>(3, INF));
  for(int i=0;i<3;i++) wf[i][i]=0;
  wf[0][1]=5; wf[0][2]=2; wf[2][1]=1; warshall_floyd(wf); assert(wf[0][1]==3);
  vector<vector<int>> tg(3); tg[2]={0}; tg[0]={1}; bool tok;
  auto to=topo_sort(tg, tok); assert((tok && to==vector<int>{2,0,1}));
  tg[1]={2}; bool tok2; topo_sort(tg, tok2); assert(!tok2);
  vector<WEdge> ke={{10,0,1},{5,1,2},{3,0,2}}; assert(kruskal(3, ke)==8);
  vector<ll> tp={1,2,1,1,3}, tp2={1,2,3};
  assert(longest_at_most(tp,4)==3 && count_at_least(tp2,4)==2);
  vector<int> perm={0,1,2}; int pc=1;
  while(next_perm(perm)) pc++;
  assert(pc==6 && (perm==vector<int>{2,1,0}));
  vector<int> la={4,2,3,1,5}; assert(lis(la)==3);
  assert(lcs("axbycz","abc")==3 && edit_distance("kitten","sitting")==3);
  auto fz=factorize(360); assert(fz[2]==3 && fz[3]==2 && fz[5]==1 && fz.size()==3);
  auto dv=divisors(12); assert((dv==vector<ll>{1,2,3,4,6,12}));
  assert(is_prime(17) && !is_prime(1));
  vector<vector<ll>> td={{0,1,10,10},{10,0,1,10},{10,10,0,1},{1,10,10,0}};
  assert(tsp(td)==4);
  RollingHash rh("abcabc");
  assert(rh.get(0,3)==rh.get(3,6) && rh.get(0,2)!=rh.get(1,3));
  assert(ccw({0,0},{1,0},{1,1})==1 && ccw({0,0},{1,0},{1,-1})==-1 && ccw({0,0},{2,0},{1,0})==0);
  assert(seg_intersect({0,0},{2,2},{0,2},{2,0}));
  assert(!seg_intersect({0,0},{1,1},{2,0},{3,1}));
  vector<Pt> gp={{0,0},{2,0},{2,2},{0,2},{1,1},{1,0}};
  assert(convex_hull(gp).size()==4);
  vector<Pt> sq={{0,0},{2,0},{2,2},{0,2}};
  assert(fabs(polygon_area(sq) - 4.0) < 1e-9);
  BipartiteMatching bm(3,3);
  bm.add_edge(0,0); bm.add_edge(0,1); bm.add_edge(1,0); bm.add_edge(2,2);
  assert(bm.solve()==3);
  Dinic din(6);
  din.add_edge(0,1,1); din.add_edge(0,2,1); din.add_edge(1,3,1); din.add_edge(1,4,1);
  din.add_edge(2,3,1); din.add_edge(3,5,1); din.add_edge(4,5,1);
  assert(din.max_flow(0,5)==2);
  printf("cpp OK\\n");
}`
writeFileSync(join(dir, 'v.cpp'), cpp)

console.log('verifying generated code by compile+run:')
const r = []
r.push(run('python', 'python3 verify.py'))
r.push(run('cpp', 'clang++ -std=c++17 -O0 v.cpp -o v && ./v'))
r.push(run('java', 'javac Main.java && java Main'))
r.push(run('kotlin', 'kotlinc Verify.kt -include-runtime -d v.jar 2>/dev/null && java -jar v.jar'))

rmSync(dir, { recursive: true, force: true })
if (r.every(Boolean)) console.log('ALL 4 LANGUAGES OK')
else { console.log('SOME FAILED'); process.exit(1) }
