#!/usr/bin/env bash
set -euo pipefail

# コンパイルして oj でサンプル全件テスト (AC/WA/TLE を 1 ケースずつ)
# usage:
#   ./t.sh abc461/b                  # <contest>/<task> 指定
#   ./t.sh /abs/path/to/taskdir      # ディレクトリ直接指定 (VSCode タスクが ${fileDirname} を渡す)
# 事前に test/ が無ければ ./new.sh が DL 済み or 手動で:
#   cd abc461/b && oj d https://atcoder.jp/contests/abc461/tasks/abc461_b

PARENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
ARG="${1:?usage: ./t.sh <contest>/<task> | <taskdir>}"

if [ -d "$ARG" ]; then
  DIR=$(cd "$ARG" && pwd -P)
else
  DIR="$PARENT_PATH/$ARG"
fi

# test/ が無ければ自動でサンプル DL (oj のログは抑制)
if [ ! -d "$DIR/test" ]; then
  echo "[t.sh] サンプル自動DL..." >&2
  "$PARENT_PATH/dl.sh" "$DIR" >/dev/null 2>&1 || true
fi

kotlinc "$DIR/Main.kt" -include-runtime -d "$DIR/main.jar" 2>/dev/null
(cd "$DIR" && oj test -c "java -jar main.jar")
