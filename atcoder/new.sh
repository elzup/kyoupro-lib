#!/usr/bin/env bash
set -euo pipefail

# コンテスト用ディレクトリを作る + サンプル自動DL
# usage: ./new.sh abc415 [タスク数 (default: 7 = a..g)]
# env:   NO_DL=1 ./new.sh abc415   # oj によるサンプルDLをスキップ

PARENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
CONTEST="${1:?usage: ./new.sh <contest> [tasks]}"
TASKS="${2:-7}"

TASK_NAMES=(a b c d e f g h)

for ((i = 0; i < TASKS; i++)); do
  t="${TASK_NAMES[$i]}"
  dir="$PARENT_PATH/$CONTEST/$t"
  mkdir -p "$dir"
  if [ ! -f "$dir/Main.kt" ]; then
    cp "$PARENT_PATH/template/Main.kt" "$dir/Main.kt"
  fi
  # 各タスクを独立 Maven プロジェクトにする (LSP 用・git 管理外)
  if [ ! -f "$dir/pom.xml" ]; then
    cp "$PARENT_PATH/template/pom.xml" "$dir/pom.xml"
  fi

  # サンプルを test/ に自動DL (oj)。失敗しても止めない (未公開 / 要 oj login など)
  if [ -z "${NO_DL:-}" ] && command -v oj >/dev/null 2>&1 && [ ! -d "$dir/test" ]; then
    url="https://atcoder.jp/contests/$CONTEST/tasks/${CONTEST}_$t"
    if oj download -d "$dir/test" "$url" >/dev/null 2>&1; then
      echo "  samples: $t ok"
    else
      echo "  samples: $t skip (未公開 or 要 'oj login https://atcoder.jp')"
    fi
  fi
done

echo "created: $CONTEST/{$(IFS=,; echo "${TASK_NAMES[*]:0:$TASKS}")}"
