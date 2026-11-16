#!/usr/bin/env bash
# Each negatives/<name>.lean replaces Fixture/Semantics.lean in a scratch copy of the fixture. The lock is then
# proposed AND approved from that bad file, so the test shows an approved lock cannot make it pass:
#   * `-- expect-fail: <check ids>`  ids that must fail in `truth-gate check` (gate exit 1), or `lock` if
#                                    `truth-gate lock` itself must refuse;
#   * `-- expect-build: <text>`      text the in-build audit (lake build SemanticsLock) must fail with, or `-`
#                                    when the rejection is made by `check` only (provenance file checks).
# Usage: run-negatives.sh [name ...]   (defaults to all)
set -uo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
PH="node $here/../../../dist/src/bin.js truth-gate"
names=("$@"); [ ${#names[@]} -eq 0 ] && names=($(cd "$here/negatives" && ls *.lean | sed 's/\.lean$//'))
fails=0
for n in "${names[@]}"; do
  f="$here/negatives/$n.lean"
  want=$(sed -n 's/^-- expect-fail: //p' "$f"); build=$(sed -n 's/^-- expect-build: //p' "$f")
  tmp=$(mktemp -d); cp -r "$here"/{Fixture,scripts,lakefile.lean,lean-toolchain,lake-manifest.json,paper.tex} "$tmp"/
  cp "$f" "$tmp/Fixture/Semantics.lean"
  log="$tmp/log.txt"; ok=1
  ( cd "$tmp" && lake build Fixture ) >"$log" 2>&1 || { echo "[$n] lake build Fixture failed"; ok=0; }
  if [ $ok -eq 1 ]; then
    ( cd "$tmp" && $PH lock --project . --root Fixture.Semantics --prefix Fixture --semantics Fixture/Semantics.lean \
        --headline Fixture.headline --paper paper.tex --claim thm:main --out truth-gate.lock.json ) >>"$log" 2>&1
    lk=$?
    if [ "$want" = "lock" ]; then
      [ $lk -ne 0 ] && echo "[$n] ok: lock refused" || { echo "[$n] FAIL: lock was accepted"; ok=0; }
    elif [ $lk -ne 0 ]; then echo "[$n] FAIL: lock errored"; ok=0
    else
      ( cd "$tmp" && $PH approve --lock truth-gate.lock.json --by "negative test (not an author approval)" &&
        $PH emit-lean --lock truth-gate.lock.json --out scripts/SemanticsLock.lean ) >>"$log" 2>&1
      ( cd "$tmp" && lake build SemanticsLock ) >"$tmp/build.txt" 2>&1; b=$?
      if [ "$build" != "-" ]; then
        if [ $b -ne 0 ] && grep -qF -- "$build" "$tmp/build.txt"; then echo "[$n] ok: lake build SemanticsLock failed: $(grep -o 'truth gate:[^"]*' "$tmp/build.txt" | head -1)"
        else echo "[$n] FAIL: lake build SemanticsLock exit $b without \"$build\""; cat "$tmp/build.txt"; ok=0; fi
      fi
      ( cd "$tmp" && $PH check --project . --report-json r.json ) >>"$log" 2>&1; g=$?
      failed=$(node -e 'const r=require(process.argv[1]);console.log(r.checks.filter(c=>c.status==="fail").map(c=>c.id).join(" "))' "$tmp/r.json" 2>/dev/null)
      [ $g -eq 1 ] || { echo "[$n] FAIL: gate exit $g (want 1)"; ok=0; }
      for id in $want; do
        [[ " $failed " == *" $id "* ]] || { echo "[$n] FAIL: check $id did not fail (failed: $failed)"; ok=0; }
      done
      [ $ok -eq 1 ] && echo "[$n] ok: gate exit 1; failed: $failed"
    fi
  fi
  [ $ok -eq 1 ] || { fails=$((fails+1)); echo "--- log for $n"; cat "$log"; }
  rm -rf "$tmp"
done
echo "negatives: $(( ${#names[@]} - fails ))/${#names[@]} rejected as expected"
[ $fails -eq 0 ]
