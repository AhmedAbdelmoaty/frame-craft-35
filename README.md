# Statistics Business Game

This is the clean root workspace for the new statistics/business learning game.

The game itself has not been designed or built yet. The current repository is prepared for discovery, planning, asset workflow design, prompt organization, and future implementation.

## Current Structure

```text
src/          future game source code
public/       future runtime public files
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

## Before Building

Do not build gameplay until these are defined:

* target learner
* statistics/business concept
* learning goal
* core player decision
* feedback model
* win/fail condition
* smallest playable prototype
* art direction

## Key Docs

Start with:

* `docs/agent-system/AGENT_OPERATING_SYSTEM.md`
* `docs/agent-system/READY_STATE.md`
* `docs/workflows/ASSET_GENERATION_WORKFLOW.md`
* `docs/workflows/ANIMATED_SPRITESHEET_WORKFLOW.md`
* `docs/checklists/TASK_READINESS_CHECKLIST.md`
* `docs/checklists/ASSET_QUALITY_CHECKLIST.md`
* `docs/mentor-playbook/FINAL_MENTOR_WORKFLOW_SUMMARY.md`

## Project-Local Skills

The project includes these local Codex skills:

* `.codex/skills/project-game-agent-router`
* `.codex/skills/asset-generation-pipeline`
* `.codex/skills/animated-spritesheet-pipeline`

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
