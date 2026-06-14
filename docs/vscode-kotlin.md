# VSCode で Kotlin (AtCoder)

外部ライブラリは使わず stdlib だけ。なので**ビルドファイルは基本不要**。
ポイントは fwcd(LSP) の挙動を理解して「開き方」を変えるだけ。

- fwcd の language server は **kotlin-stdlib を同梱**している
  → ビルドファイル無しでも、単独で開いた 1 ファイルなら `println`/`readLine` 等を解決して**正確な構文エラー**を出せる
- 偽エラー (`Overload resolution ambiguity`) が出るのは、**repo 全体を開いて** `package` 無しの
  複数 `Main.kt`/lib を 1 モジュール扱いし、root package で `main`/`nextInt` が重複したときだけ

## 必要な拡張 (`.vscode/extensions.json` に登録済み)

- `fwcd.kotlin` — LSP (補完・構文エラー) + デバッグアダプタ
- `formulahendry.code-runner` — ワンキー実行 (Run Code)
- `mathiasfrohlich.kotlin` — シンタックスハイライト

ツールチェーン: JDK 17 / `kotlinc` / `mvn` (Homebrew)。

## 書くとき: 問題フォルダ単位で開く（pom 不要）

```
code atcoder/abc415/a      # repo 全体ではなく、その問題だけ開く
```

`Main.kt` が 1 つだけ＝衝突なし＝**内蔵 stdlib で正確な赤波線が出る**。設定も pom も不要。

- 並列（A 提出待ち中に B を書く）→ B 用にもう 1 ウィンドウ開いて Cmd+\` で往復
- **提出**はファイル内容をコピペ（`package` 無しなのでそのまま）

## repo 全体のウィンドウは「閲覧・実行・管理」用

repo ルートを開いたウィンドウは衝突するので `kotlin.diagnostics.enabled: false`（赤線ノイズを抑制）。
ここでは lib の閲覧、`new.sh`/`run.sh`/`sync.sh`、Run Code を使う。**構文エラーを見ながら書く作業はしない。**

### 実行 (Run Code)

repo ウィンドウの Code Runner はそのファイルの隣に `Main.jar` を作って実行し、同じフォルダに
`in.txt` があれば標準入力にリダイレクトする（並列でも jar がフォルダ別なので干渉しない）。
問題フォルダ単独ウィンドウで同じ挙動が欲しい場合はターミナルで:

```
kotlinc Main.kt -include-runtime -d Main.jar && java -jar Main.jar < in.txt
```

## ブレークポイントで追いたい問題だけ `atcoder/solve/`

fwcd のデバッガはビルドファイルが要る（standalone 不可）。深掘りする 1 問だけここに寄せる:

1. 対象 `Main.kt` を `atcoder/solve/src/main/kotlin/Main.kt` にコピー
2. `code atcoder/solve` → F5 (`Debug Main.kt`)。`in.txt` を編集して入力を渡す

`solve/` は Maven プロジェクト（`pom.xml` 1 個）で、補完・診断・デバッガが完全動作する。

## アーカイブ

`./sync.sh <contest>` で `competitive-pg-kotlin/src/atcoder/<contest>/<task>/Main.kt` へコピー。
template と同一 (未着手) のタスクは自動 skip。詳細は `atcoder/sync.sh` のヘッダコメント参照。
```
