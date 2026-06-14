#!/usr/bin/env bash
set -euo pipefail

# コンパイルして実行する
# usage:
#   ./run.sh abc415/a                # <contest>/<task> 指定
#   ./run.sh /abs/path/to/taskdir    # ディレクトリ直接指定 (VSCode タスクが ${fileDirname} を渡す)
# 入力の優先順位: in.txt → test/sample-1.in → 手入力(標準入力)。

PARENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
ARG="${1:?usage: ./run.sh <contest>/<task> | <taskdir>}"

if [ -d "$ARG" ]; then
  DIR=$(cd "$ARG" && pwd -P)
else
  DIR="$PARENT_PATH/$ARG"
fi

# in.txt も test/ も無ければ自動でサンプル DL (oj のログは抑制)
if [ ! -f "$DIR/in.txt" ] && [ ! -d "$DIR/test" ]; then
  echo "[run.sh] サンプル自動DL..." >&2
  "$PARENT_PATH/dl.sh" "$DIR" >/dev/null 2>&1 || true
fi

kotlinc "$DIR/Main.kt" -include-runtime -d "$DIR/main.jar" 2>/dev/null

if [ -f "$DIR/in.txt" ]; then
  # in.txt があればそれを 1 回だけ実行
  java -jar "$DIR/main.jar" < "$DIR/in.txt"
elif ls "$DIR"/test/sample-*.in >/dev/null 2>&1; then
  # test の全サンプルを実行し、各出力と AC/WA を表示 (判定の詳細は ./t.sh で)
  for infile in "$DIR"/test/sample-*.in; do
    name=$(basename "$infile" .in)
    got=$(java -jar "$DIR/main.jar" < "$infile")
    outfile="${infile%.in}.out"
    if [ -f "$outfile" ] && [ "$got" = "$(cat "$outfile")" ]; then
      verdict="AC"
    elif [ -f "$outfile" ]; then
      verdict="WA"
    else
      verdict="-"
    fi
    echo "===== $name [$verdict] ====="
    echo "$got"
    if [ "$verdict" = "WA" ]; then
      echo "--- expected ---"
      cat "$outfile"
    fi
  done
else
  echo "[run.sh] in.txt も test/ も無し → 標準入力(手入力)待ち" >&2
  java -jar "$DIR/main.jar"
fi
