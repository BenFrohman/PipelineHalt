#!/usr/bin/env bash
# Tamper negatives for scripts/verify-lock.sh. Each tamper/<name>.lean is applied to a scratch copy of the fixture
# whose lock (truth-gate.lock.json) and in-build audit (scripts/SemanticsLock.lean) stay the committed, APPROVED
# ones, i.e. the edit happens after approval. verify-lock.sh must exit 1 with the expected reason:
#   -- action: delete          remove Fixture/Semantics.lean instead of replacing it
#   -- expect-reject: <reason> the "TRUTH GATE: REJECT <reason>" prefix verify-lock.sh must print
#   -- expect-check: <ids>     (reason gate) check ids that must fail
# With no tamper file the unmodified fixture must pass (the passing demo): run-tamper.sh pass
# Usage: run-tamper.sh [name ...]   (defaults to pass + all)
set -uo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
verify="$here/../../../scripts/verify-lock.sh"
names=("$@"); [ ${#names[@]} -eq 0 ] && names=(pass $(cd "$here/tamper" && ls *.lean | sed 's/\.lean$//'))
fails=0
for n in "${names[@]}"; do
  tmp=$(mktemp -d)
  cp -r "$here"/{Fixture,scripts,lakefile.lean,lean-toolchain,lake-manifest.json,paper.tex,truth-gate.lock.json} "$tmp"/
  [ -d "$here/.lake" ] && cp -r "$here/.lake" "$tmp/"   # reuse built oleans; lake rebuilds what changed
  if [ "$n" = pass ]; then want=PASS; action=; checks=
  else
    f="$here/tamper/$n.lean"
    want=$(sed -n 's/^-- expect-reject: //p' "$f"); action=$(sed -n 's/^-- action: //p' "$f"); checks=$(sed -n 's/^-- expect-check: //p' "$f")
    if [ "$action" = delete ]; then rm "$tmp/Fixture/Semantics.lean"; else cp "$f" "$tmp/Fixture/Semantics.lean"; fi
  fi
  log="$tmp/log.txt"; ok=1
  ( cd "$tmp" && MATHLIB_CACHE=0 "$verify" . ) >"$log" 2>&1; v=$?
  line=$(grep -m1 '^TRUTH GATE:' "$log")
  if [ "$want" = PASS ]; then
    [ $v -eq 0 ] && [[ "$line" == "TRUTH GATE: PASS"* ]] || ok=0
  else
    [ $v -eq 1 ] && [[ "$line" == "TRUTH GATE: REJECT $want"* ]] || ok=0
    for id in $checks; do [[ "$line" == *"$id="* ]] || ok=0; done
  fi
  if [ $ok -eq 1 ]; then echo "[$n] ok: exit $v; $line"
  else fails=$((fails+1)); echo "[$n] FAIL: exit $v; ${line:-no verdict} (want $want${checks:+ with $checks})"; cat "$log"; fi
  rm -rf "$tmp"
done
echo "tamper: $(( ${#names[@]} - fails ))/${#names[@]} as expected"
[ $fails -eq 0 ]
