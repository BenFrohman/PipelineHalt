-- Add to lakefile.lean so the default `lake build` runs the semantics lock audit.
-- Generate scripts/SemanticsLock.lean with: pipelinehalt truth-gate emit-lean --lock truth-gate.lock.json
-- (For lakefile.toml: [[lean_lib]] name = "SemanticsLock", srcDir = "scripts", and add it to defaultTargets.)
@[default_target]
lean_lib «SemanticsLock» where
  srcDir := "scripts"
  roots := #[`SemanticsLock]
