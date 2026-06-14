#!/usr/bin/env bash
set -euo pipefail

# サンプルを test/ に DL (URL はフォルダ名から自動生成)
# usage:
#   ./dl.sh abc461/c                 # <contest>/<task>
#   ./dl.sh /abs/path/to/taskdir     # ディレクトリ直接 (他スクリプトから)

PARENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
ARG="${1:?usage: ./dl.sh <contest>/<task> | <taskdir>}"

if [ -d "$ARG" ]; then
  DIR=$(cd "$ARG" && pwd -P)
else
  DIR="$PARENT_PATH/$ARG"
fi

contest=$(basename "$(dirname "$DIR")")
task=$(basename "$DIR")
url="https://atcoder.jp/contests/$contest/tasks/${contest}_$task"

oj download -d "$DIR/test" "$url"
