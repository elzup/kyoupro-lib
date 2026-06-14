#!/usr/bin/env bash
set -euo pipefail

# 解いた問題を competitive-pg-kotlin (src/atcoder/<contest>/<task>/Main.kt) にアーカイブする
#
# usage:
#   ./sync.sh                  # 全コンテストを同期 (template と同一=未着手は skip)
#   ./sync.sh abc461           # 指定コンテストのみ
#   ./sync.sh abc461 c         # 指定コンテストの 1 タスクのみ
#
# env:
#   DRY_RUN=1 ./sync.sh ...    # コピーせず実行内容だけ表示
#   FORCE=1   ./sync.sh ...    # template と同一(未着手)でもコピー
#   COMMIT=1  ./sync.sh ...    # 送り先で git add + commit まで (push は手動)
#   ARCHIVE_REPO=/path ./sync.sh ...  # 送り先リポジトリを上書き

PARENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
TEMPLATE="$PARENT_PATH/template/Main.kt"
ARCHIVE_REPO="${ARCHIVE_REPO:-$PARENT_PATH/../../competitive-pg-kotlin}"
DEST_ROOT="$ARCHIVE_REPO/src/atcoder"

DRY_RUN="${DRY_RUN:-}"
FORCE="${FORCE:-}"
COMMIT="${COMMIT:-}"

CONTEST="${1:-}"
TASK="${2:-}"

if [ ! -d "$ARCHIVE_REPO/.git" ]; then
  echo "ERROR: アーカイブ先リポジトリが見つかりません: $ARCHIVE_REPO" >&2
  echo "  ARCHIVE_REPO=/path/to/competitive-pg-kotlin ./sync.sh ... で上書きできます" >&2
  exit 1
fi

copied=0
skipped=0

sync_one() {
  local contest="$1" task="$2"
  local src="$PARENT_PATH/$contest/$task/Main.kt"
  [ -f "$src" ] || return 0

  # 未着手 (template と完全一致) は skip
  if [ -z "$FORCE" ] && [ -f "$TEMPLATE" ] && cmp -s "$src" "$TEMPLATE"; then
    echo "  skip (未着手): $contest/$task"
    skipped=$((skipped + 1))
    return 0
  fi

  local dst="$DEST_ROOT/$contest/$task/Main.kt"
  if [ -n "$DRY_RUN" ]; then
    echo "  would copy: $contest/$task -> src/atcoder/$contest/$task/Main.kt"
  else
    mkdir -p "$(dirname "$dst")"
    cp "$src" "$dst"
    echo "  copied: $contest/$task"
  fi
  copied=$((copied + 1))
}

# 対象コンテスト一覧 (template と solve は除外)
contests=()
if [ -n "$CONTEST" ]; then
  contests=("$CONTEST")
else
  while IFS= read -r d; do
    contests+=("$(basename "$d")")
  done < <(find "$PARENT_PATH" -mindepth 1 -maxdepth 1 -type d ! -name template ! -name solve | sort)
fi

for contest in "${contests[@]}"; do
  cdir="$PARENT_PATH/$contest"
  if [ ! -d "$cdir" ]; then
    echo "  no such contest dir: $contest" >&2
    continue
  fi
  if [ -n "$TASK" ]; then
    sync_one "$contest" "$TASK"
  else
    while IFS= read -r td; do
      sync_one "$contest" "$(basename "$td")"
    done < <(find "$cdir" -mindepth 1 -maxdepth 1 -type d | sort)
  fi
done

echo "----"
echo "copied: $copied / skipped(未着手): $skipped -> $DEST_ROOT"

if [ -n "$COMMIT" ] && [ -z "$DRY_RUN" ] && [ "$copied" -gt 0 ]; then
  repo_top=$(cd "$DEST_ROOT" && git rev-parse --show-toplevel)
  (cd "$repo_top" && git add -A src/atcoder && git commit -q -m "archive: sync ${CONTEST:-all} from kyoupro-lib")
  echo "committed in $repo_top (push は手動で)"
fi
