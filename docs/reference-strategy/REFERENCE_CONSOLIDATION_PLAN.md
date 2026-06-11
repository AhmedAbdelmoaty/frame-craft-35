# Reference Consolidation Plan

## Goal

Keep the new statistics/business game as the main root project while preserving useful workflow knowledge from imported reference projects.

## Current State

The repo now contains:

* clean placeholder source/runtime folders under `src/` and `public/`
* project asset workspace under `assets/`
* project knowledge base under `docs/`
* imported reference projects under `references/imported-projects/`
* original root Phaser starter under `references/imported-projects/root-phaser-starter/`
* pre-promotion workspace snapshot under `references/internal-workspace-snapshots/`
* original root local skill references preserved under `references/imported-projects/root-phaser-starter/.agents` and `.claude`

The old nested `projects/statistics-business-game/` workspace has been promoted into the root project structure. The old root Phaser starter has been moved into references.

## Current Root Shape

```text
statistics-business-game/
  src/
  public/
  assets/
  docs/
  references/
  package.json
```

Optional future addition:

```text
.codex/skills/
```

Only add project-local Codex skills if they provide value beyond installed global skills.

## What Has Been Extracted

Already extracted into `docs/`:

* mentor playbook
* transcripts
* agent operating system
* asset generation workflow
* animated spritesheet workflow
* isometric workflow
* prompt library
* task readiness checklist
* asset quality checklist
* skills audit
* reference project audit
* prompt/plan audit
* skill decision matrix

## What To Keep As References

Keep for now:

* `references/imported-projects/Another Project1` for asset cleanup and failure examples
* `references/imported-projects/Another Project2` for prompt sequence examples
* `references/imported-projects/Another Project3` for isometric and `fal-ai-image` skill reference
* `references/imported-projects/Another Project4` for broad skill pack and starter structures
* `references/imported-projects/root-phaser-starter` for the original root Phaser starter shell and local Phaser skills

## What Can Be Archived Later

Candidate order:

1. `references/imported-projects/Another Project1` after asset failure examples are fully captured.
2. `references/imported-projects/Another Project2` after the first original character pipeline is complete.
3. `references/imported-projects/Another Project4` after skill decisions and useful starter structures are captured.
4. `references/imported-projects/Another Project3` after deciding whether isometric/fal.ai are needed.
5. `references/imported-projects/root-phaser-starter` after deciding whether any starter shell code is useful for the new game.

Archive means move to a clearer reference/archive location, not delete.

Deletion should only happen after:

* audit is complete
* extraction is complete
* user explicitly approves deletion

## What Not To Move Again Without Approval

Do not move again without a specific cleanup plan:

* `references/imported-projects`
* `references/imported-projects/root-phaser-starter/.agents`
* `references/imported-projects/root-phaser-starter/.claude`
* `src`
* `public`
* `docs/mentor-playbook`

## Next Safe Action

Before gameplay implementation:

1. Decide whether to copy/adopt `fal-ai-image` if external provider generation will be used.
2. Decide whether to create project-local skills after the first repeated asset or spritesheet task.
3. Start Game Vision Workshop only when the user is ready.
