#!/usr/bin/env bash
set -euo pipefail

# コンテスト用ディレクトリを作る
# usage: ./new.sh abc415 [タスク数 (default: 7 = a..g)]

PARENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
CONTEST="${1:?usage: ./new.sh <contest> [tasks]}"
TASKS="${2:-7}"

TASK_NAMES=(a b c d e f g h)

for ((i = 0; i < TASKS; i++)); do
  dir="$PARENT_PATH/$CONTEST/${TASK_NAMES[$i]}"
  mkdir -p "$dir"
  if [ ! -f "$dir/Main.kt" ]; then
    cp "$PARENT_PATH/template/Main.kt" "$dir/Main.kt"
  fi
done

echo "created: $CONTEST/{$(IFS=,; echo "${TASK_NAMES[*]:0:$TASKS}")}"
