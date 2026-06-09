# Statistics Business Game

This is the clean root workspace for the MADAR statistics/business learning game.

The repository now contains an early Phaser/Vite playable slice plus the project knowledge base, asset workflow, generated character candidates, and preserved workflow references.

## Current Structure

```text
src/          current Phaser/Vite prototype source
public/       current runtime public files
assets/       new-game asset workspace
docs/         project knowledge, workflows, plans, prompts, and decisions
.codex/skills project-local agent skills
references/   imported references and archived setup snapshots
```

## Important Rule

All imported projects are workflow references only.

Do not copy their visual style, genre, characters, enemies, combat systems, story, or specific game identity into this project.

Use them only to learn:

* planning habits
* prompt patterns
* skill-selection logic
* asset-generation pipelines
* animated spritesheet workflows
* testing methods
* common failures and fixes

## Current Prototype

The current slice is a 2D / 2.5D business investigation prototype inside Madar Distribution. The player is a data analyst who moves through office areas, collects evidence, reviews two sales teams, and submits a recommendation.

Design rules to preserve:

* Arabic-first player-facing text.
* Game-first experience, not a quiz, lecture, dashboard, or spreadsheet.
* Statistics appears through evidence, decisions, and consequences.
* Do not reveal early that the mean is misleading.
* Do not copy reference-project visual style, story, characters, genre, or combat systems.

## Key Docs

Start with:

* `docs/agent-system/AGENT_OPERATING_SYSTEM.md`
* `docs/agent-system/READY_STATE.md`
* `docs/workflows/ASSET_GENERATION_WORKFLOW.md`
* `docs/workflows/ANIMATED_SPRITESHEET_WORKFLOW.md`
* `docs/checklists/TASK_READINESS_CHECKLIST.md`
* `docs/checklists/ASSET_QUALITY_CHECKLIST.md`
* `docs/mentor-playbook/FINAL_MENTOR_WORKFLOW_SUMMARY.md`
* `docs/HANDOFF_CURRENT_STATE.md`
* `assets/ASSET_INDEX.md`

## Project-Local Skills

The project includes these local Codex skills:

* `.codex/skills/project-game-agent-router`
* `.codex/skills/asset-generation-pipeline`
* `.codex/skills/animated-spritesheet-pipeline`
* `.codex/skills/project-walk-cycle-pipeline`

Use global skills for general Phaser, Three.js, React Three Fiber, Playwright, browser testing, and generic game implementation.

## Commands

No application build is configured yet.

```bash
npm run check
npm test
```

The previous Phaser starter project is preserved under:

```text
references/imported-projects/root-phaser-starter/
```

Old setup snapshots are preserved under:

```text
references/archive/internal-workspace-snapshots/
```
