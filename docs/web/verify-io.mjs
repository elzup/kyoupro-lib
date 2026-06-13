// io.mjs の P1 テンプレ (高速 I/O 雛形) を 4 言語とも実際に stdin を流して検証する。
// マーカー行を「N + 配列 + グリッドを読んで sum と grid[1][0] を出力」する本体に差し替える。
//   入力: 3 / 1 2 3 / 2 2 / ab / cd   → 期待出力: "6 c"
import { execSync } from 'node:child_process'
import { writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ioPatterns } from './io.mjs'

const dir = join(tmpdir(), 'kyolib_io_verify')
rmSync(dir, { recursive: true, force: true })
mkdirSync(dir, { recursive: true })

const tpl = ioPatterns.find((p) => p.id === 'template').code
const STDIN = '3\n1 2 3\n2 2\nab\ncd\n'
const EXPECT = '6 c'

const bodies = {
  kotlin: `  val n = nextInt()
  val a = IntArray(n) { nextInt() }
  val h = nextInt(); val w = nextInt()
  val grid = Array(h) { next() }
  var s = 0; for (x in a) s += x
  out.println(s.toString() + " " + grid[1][0])`,
  python: `    n = int(input())
    a = list(map(int, input().split()))
    h, w = map(int, input().split())
    grid = [input().rstrip() for _ in range(h)]
    print(sum(a), grid[1][0])`,
  java: `    int n = nextInt();
    int[] a = new int[n];
    for (int i = 0; i < n; i++) a[i] = nextInt();
    int h = nextInt(), w = nextInt();
    char[][] grid = new char[h][];
    for (int i = 0; i < h; i++) grid[i] = next().toCharArray();
    int s = 0; for (int x : a) s += x;
    sb.append(s).append(' ').append(grid[1][0]).append('\\n');`,
  cpp: `  int n; cin >> n;
  vector<int> a(n);
  for (auto& x : a) cin >> x;
  int h, w; cin >> h >> w;
  vector<string> grid(h);
  for (auto& row : grid) cin >> row;
  int s = 0; for (int x : a) s += x;
  cout << s << " " << grid[1][0] << "\\n";`,
}

const fill = (lang) => {
  const marker = lang === 'python' ? /^[ \t]*# \.\.\. 読む \.\.\.$/m : /^[ \t]*\/\/ \.\.\. 読む \.\.\.$/m
  let code = tpl[lang].replace(marker, bodies[lang])
  if (lang === 'cpp')
    code = code.replace('#include <bits/stdc++.h>', '#include <iostream>\n#include <vector>\n#include <string>')
  return code
}

const run = (label, file, content, cmd) => {
  writeFileSync(join(dir, file), content)
  try {
    const out = execSync(cmd, { cwd: dir, input: STDIN, stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim()
    if (out === EXPECT) { console.log(`  ${label} OK`); return true }
    console.log(`  ${label} FAILED: got "${out}" expected "${EXPECT}"`); return false
  } catch (e) {
    console.log(`  ${label} FAILED`)
    console.log((e.stdout?.toString() || '') + (e.stderr?.toString() || ''))
    return false
  }
}

console.log('verifying io templates by compile+run with stdin:')
const r = []
r.push(run('python', 'sol.py', fill('python'), 'python3 sol.py'))
r.push(run('cpp', 'sol.cpp', fill('cpp'), 'clang++ -std=c++17 -O0 sol.cpp -o sol && ./sol'))
r.push(run('java', 'Main.java', fill('java'), 'javac Main.java && java Main'))
r.push(run('kotlin', 'Sol.kt', fill('kotlin'), 'kotlinc Sol.kt -include-runtime -d sol.jar 2>/dev/null && java -jar sol.jar'))

rmSync(dir, { recursive: true, force: true })
if (r.every(Boolean)) console.log('ALL 4 IO TEMPLATES OK')
else { console.log('SOME FAILED'); process.exit(1) }
