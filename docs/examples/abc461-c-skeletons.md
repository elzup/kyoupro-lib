# 例題ドリル（多言語）: ABC461 C — イメージ→コード 雛形

**「イメージ（各工程の目標状態）はできた。あとはコードにできるか？」**を訓練するための穴埋め。
アイデアからいきなりコードではなく、設計で作ったイメージをコードに写す練習。
方針の解説は [`abc461-c-variety.md`](./abc461-c-variety.md)、変数の動き（＝イメージ）は [`abc461-c-variable-trace.html`](./abc461-c-variable-trace.html) を参照。

ルール: 入出力（I/O）は雛形で用意済み。各工程の **目標状態（＝イメージ）** を見て、その状態に到達するコードを `TODO` に書く。
変数名は図と揃える → `byColor`（色ごとのバケツ）/ `t`（各色の代表＝最大）/ `q`（残り）/ `sum`（合計）。

---

## 工程ごとの目標状態（入力 `5 3 2`）

| 工程 | やること | 到達したい状態 |
| --- | --- | --- |
| 1 | 色ごとに振り分け | `byColor = [[30,40,50], [10], [20]]` |
| 2 | 各バケツ降順ソート | `byColor = [[50,40,30], [10], [20]]` |
| 3 | 代表→`t` / 残り→`q` | `t=[50,10,20]`  `q=[40,30]` |
| 4 | `t` から大きい順に M=2 個 | `sum=70`、`t` 残り `[10]` |
| 5 | 余った代表を `q` に合流 | `q=[40,30,10]` |
| 6 | `q` から大きい順に K−M=1 個 | `sum=110`（選択 50,20,40 / 色 {c1,c3} ✓） |

> この表の「状態」を口で言えるのに手が動かない＝コーディング力（言語理解）の穴。そこが訓練対象。

---

## 雛形（穴埋め）— Java

```java
import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int n = Integer.parseInt(st.nextToken());
        int k = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());

        List<List<Integer>> byColor = new ArrayList<>();
        for (int i = 0; i < n; i++) byColor.add(new ArrayList<>());
        for (int i = 0; i < n; i++) {
            st = new StringTokenizer(br.readLine());
            int c = Integer.parseInt(st.nextToken());
            int v = Integer.parseInt(st.nextToken());
            // TODO 1: 色 c の宝石を byColor へ（c は 1-indexed）
        }

        PriorityQueue<Integer> t = new PriorityQueue<>(Collections.reverseOrder()); // 代表
        PriorityQueue<Integer> q = new PriorityQueue<>(Collections.reverseOrder()); // 残り
        // TODO 2-3: 各バケツを降順ソートし、先頭(最大)を t に、残りを q に入れる

        long sum = 0;                 // ← long（Int だとオーバーフロー）
        // TODO 4: t から大きい順に m 個取り出して sum へ
        // TODO 5: 余った t を q に合流
        // TODO 6: q から大きい順に (k - m) 個取り出して sum へ

        System.out.println(sum);
    }
}
```

## 雛形（穴埋め）— Python

```python
import sys
input = sys.stdin.readline

def main():
    n, k, m = map(int, input().split())
    byColor = [[] for _ in range(n)]
    for _ in range(n):
        c, v = map(int, input().split())
        # TODO 1: 色 c の宝石を byColor へ（c は 1-indexed）

    t = []  # 代表（各色の最大）
    q = []  # 残り
    # TODO 2-3: 各バケツを降順ソートし、先頭を t に、残りを q に入れる

    total = 0   # Python の int は多倍長なのでオーバーフロー心配なし
    # TODO 4: t を降順にして先頭 m 個を total へ
    # TODO 5: 余った t（m 個目以降）を q に合流
    # TODO 6: q を降順にして先頭 (k - m) 個を total へ

    print(total)

main()
```

## 雛形（穴埋め）— C++

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k, m;
    scanf("%d %d %d", &n, &k, &m);
    vector<vector<int>> byColor(n);
    for (int i = 0; i < n; i++) {
        int c, v; scanf("%d %d", &c, &v);
        // TODO 1: 色 c の宝石を byColor へ（c は 1-indexed）
    }

    priority_queue<int> t, q;   // 既定で最大ヒープ（t=代表 / q=残り）
    // TODO 2-3: 各バケツを降順ソートし、先頭を t に、残りを q に入れる

    long long sum = 0;          // ← long long（int だとオーバーフロー）
    // TODO 4: t から大きい順に m 個取り出して sum へ
    // TODO 5: 余った t を q に合流
    // TODO 6: q から大きい順に (k - m) 個取り出して sum へ

    printf("%lld\n", sum);
}
```

---

## 解答（工程ごと・3 言語）

詰まった工程だけ開いて答え合わせ。

<details><summary>工程 1: 色ごとに振り分け</summary>

```java
byColor.get(c - 1).add(v);
```
```python
byColor[c - 1].append(v)
```
```cpp
byColor[c - 1].push_back(v);
```
</details>

<details><summary>工程 2-3: 降順ソート → 代表 t / 残り q</summary>

```java
for (List<Integer> bucket : byColor) {
    if (bucket.isEmpty()) continue;
    bucket.sort(Collections.reverseOrder());
    t.add(bucket.get(0));
    for (int j = 1; j < bucket.size(); j++) q.add(bucket.get(j));
}
```
```python
for bucket in byColor:
    if not bucket:
        continue
    bucket.sort(reverse=True)
    t.append(bucket[0])
    q.extend(bucket[1:])
```
```cpp
for (auto& bucket : byColor) {
    if (bucket.empty()) continue;
    sort(bucket.rbegin(), bucket.rend());
    t.push(bucket[0]);
    for (size_t j = 1; j < bucket.size(); j++) q.push(bucket[j]);
}
```
</details>

<details><summary>工程 4: t から大きい順に m 個</summary>

```java
for (int i = 0; i < m; i++) sum += t.poll();
```
```python
t.sort(reverse=True)
total += sum(t[:m])
```
```cpp
for (int i = 0; i < m; i++) { sum += t.top(); t.pop(); }
```
</details>

<details><summary>工程 5: 余った代表を q に合流</summary>

```java
q.addAll(t);
```
```python
q.extend(t[m:])
```
```cpp
while (!t.empty()) { q.push(t.top()); t.pop(); }
```
</details>

<details><summary>工程 6: q から大きい順に (k − m) 個</summary>

```java
for (int i = 0; i < k - m; i++) sum += q.poll();
```
```python
q.sort(reverse=True)
total += sum(q[:k - m])
```
```cpp
for (int i = 0; i < k - m; i++) { sum += q.top(); q.pop(); }
```
</details>

---

## フル解答

<details><summary>Java</summary>

```java
import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int n = Integer.parseInt(st.nextToken());
        int k = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());

        List<List<Integer>> byColor = new ArrayList<>();
        for (int i = 0; i < n; i++) byColor.add(new ArrayList<>());
        for (int i = 0; i < n; i++) {
            st = new StringTokenizer(br.readLine());
            int c = Integer.parseInt(st.nextToken());
            int v = Integer.parseInt(st.nextToken());
            byColor.get(c - 1).add(v);
        }

        PriorityQueue<Integer> t = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Integer> q = new PriorityQueue<>(Collections.reverseOrder());
        for (List<Integer> bucket : byColor) {
            if (bucket.isEmpty()) continue;
            bucket.sort(Collections.reverseOrder());
            t.add(bucket.get(0));
            for (int j = 1; j < bucket.size(); j++) q.add(bucket.get(j));
        }

        long sum = 0;
        for (int i = 0; i < m; i++) sum += t.poll();
        q.addAll(t);
        for (int i = 0; i < k - m; i++) sum += q.poll();

        System.out.println(sum);
    }
}
```
</details>

<details><summary>Python</summary>

```python
import sys
input = sys.stdin.readline

def main():
    n, k, m = map(int, input().split())
    byColor = [[] for _ in range(n)]
    for _ in range(n):
        c, v = map(int, input().split())
        byColor[c - 1].append(v)

    t, q = [], []
    for bucket in byColor:
        if not bucket:
            continue
        bucket.sort(reverse=True)
        t.append(bucket[0])
        q.extend(bucket[1:])

    t.sort(reverse=True)
    total = sum(t[:m])
    q.extend(t[m:])
    q.sort(reverse=True)
    total += sum(q[:k - m])

    print(total)

main()
```
</details>

<details><summary>C++</summary>

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k, m;
    scanf("%d %d %d", &n, &k, &m);
    vector<vector<int>> byColor(n);
    for (int i = 0; i < n; i++) {
        int c, v; scanf("%d %d", &c, &v);
        byColor[c - 1].push_back(v);
    }

    priority_queue<int> t, q;
    for (auto& bucket : byColor) {
        if (bucket.empty()) continue;
        sort(bucket.rbegin(), bucket.rend());
        t.push(bucket[0]);
        for (size_t j = 1; j < bucket.size(); j++) q.push(bucket[j]);
    }

    long long sum = 0;
    for (int i = 0; i < m; i++) { sum += t.top(); t.pop(); }
    while (!t.empty()) { q.push(t.top()); t.pop(); }
    for (int i = 0; i < k - m; i++) { sum += q.top(); q.pop(); }

    printf("%lld\n", sum);
}
```
</details>

---

## 言語ごとの「手癖」メモ（コーディング力の差が出る所）

| 工程 | Java | Python | C++ |
| --- | --- | --- | --- |
| バケツ確保 | `new ArrayList<>()` を n 個 | `[[] for _ in range(n)]` | `vector<vector<int>>(n)` |
| 降順ソート | `Collections.reverseOrder()` | `sort(reverse=True)` | `sort(rbegin(),rend())` |
| 最大を取り出す | `PriorityQueue`+`reverseOrder` / `poll` | `sort` して `[:r]`（or `heapq` は最小ヒープ注意） | `priority_queue<int>`（既定で最大）`top/pop` |
| 合流 | `addAll` | `extend` | ループで `push` |
| オーバーフロー | `long` 必須 | 気にしない（多倍長） | `long long` 必須 |

> Python の `heapq` は**最小ヒープ**しかないので、最大を取りたいなら符号反転 or `sort`。ここは言語差が出る典型。

関連: [`abc461-c-variety.md`](./abc461-c-variety.md) / [`abc461-c-variable-trace.html`](./abc461-c-variable-trace.html) / `docs/solving-flow.md`
