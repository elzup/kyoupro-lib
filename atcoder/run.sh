#!/usr/bin/env bash
set -euo pipefail

# コンパイルして実行する (入力はリダイレクトか手入力)
# usage: ./run.sh abc415/a [< input.txt]

PARENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
TASK="${1:?usage: ./run.sh <contest>/<task>}"
DIR="$PARENT_PATH/$TASK"

kotlinc "$DIR/Main.kt" -include-runtime -d "$DIR/main.jar" 2>/dev/null
java -jar "$DIR/main.jar"
