# Reference Consolidation Plan

## Goal

Make the new statistics/business game the main project while preserving the useful knowledge from imported reference projects.

## Current State

The repo currently contains:

* starter game code at the root
* mentor playbook docs under `docs/`
* new workspace under `projects/statistics-business-game/`
* reference projects named `Another Project1` through `Another Project4`
* local skills under `.agents/skills` and `.claude/skills`

This is acceptable during learning, but not ideal as the final project structure.

## Desired End State

Eventually the repo should clearly center the new game:

```text
projects/statistics-business-game/
  README.md
  docs/
  assets/
  src/              # future, when implementation begins
  public/           # future runtime assets
  package.json      # future, if this becomes standalone
  .codex/skills/    # future, only if project-local skills are needed

references/         # optional future location
  extracted/
  archived-projects/
```

Or, if the root repo is converted into the game itself later:

```text
src/
public/
assets/
docs/
references/
.codex/skills/
package.json
```

That decision should be made before implementation begins.

## What To Extract

Extract into the new workspace:

* reusable prompt patterns
* asset-generation workflow
* spritesheet workflow
* isometric workflow
* skill decision rules
* testing/checklist rules
* project organization patterns

Already extracted:

* mentor playbook docs
* agent operating system
* asset workflow docs
* animated spritesheet workflow docs
* prompt library
* task and asset quality checklists
* skill consolidation recommendation

## What To Keep As References

Keep for now:

* `Another Project1` for asset cleanup/failure examples
* `Another Project2` for prompt sequence examples
* `Another Project3` for isometric and fal.ai skill reference
* `Another Project4` for broad skill pack and starter structures

## What Can Be Archived Later

Candidate order:

1. `Another Project1` after asset failure examples are fully captured.
2. `Another Project2` after first original character pipeline is complete.
3. `Another Project4` after skill decisions and useful starter structures are captured.
4. `Another Project3` after deciding whether isometric/fal.ai are needed.

Archive means move to a clearly named reference/archive folder, not delete.

Deletion should only happen after:

* audit is complete
* extraction is complete
* user approves deletion explicitly

## What Not To Move Now

Do not move:

* reference projects
* `.agents/skills`
* `.claude/skills`
* `src`
* `public/assets`
* mentor playbook docs

## Next Safe Action

Before any cleanup:

1. Decide whether the new game should live under `projects/statistics-business-game` or become the repo root.
2. Decide whether to copy `fal-ai-image` if external provider generation will be used.
3. Decide whether to create project-local skills after first repeated asset/spritesheet task.
