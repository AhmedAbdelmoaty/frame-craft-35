# AGENTS.md

This repository is the clean root workspace for a new statistics/business learning game.

## Current State

No gameplay has been built yet.

The old Phaser starter project is preserved as a reference under:

`references/imported-projects/root-phaser-starter/`

Imported mentor/reference projects are preserved under:

`references/imported-projects/`

These references are workflow material only. Do not copy their visual style, genre, characters, enemies, story, combat systems, or specific game identity.

## First Files To Read

Before major work, read:

* `docs/PROJECT_KNOWLEDGE_INDEX.md`
* `docs/agent-system/AGENT_OPERATING_SYSTEM.md`
* `docs/agent-system/READY_STATE.md`
* `docs/checklists/TASK_READINESS_CHECKLIST.md`
* `docs/mentor-playbook/FINAL_MENTOR_WORKFLOW_SUMMARY.md`

Do not recursively read `docs/`, `references/`, `assets/`, or the whole workspace by default. Use the index and the task-specific skill to choose the minimum files needed.

## Project-Local Skills

Use these local Codex skills when relevant:

* `.codex/skills/project-game-agent-router` - choose the right workflow for vague or non-technical requests.
* `.codex/skills/asset-generation-pipeline` - generate and validate still assets.
* `.codex/skills/animated-spritesheet-pipeline` - create, clean, normalize, and test animation sheets.
* `.codex/skills/project-walk-cycle-pipeline` - generate, recover, review, and index one-direction character walk cycles with project-specific speed and quality rules.

Prefer global skills for general Phaser, Three.js, React Three Fiber, Playwright, and browser-game implementation.

For assets, also read:

* `docs/workflows/ASSET_GENERATION_WORKFLOW.md`
* `docs/workflows/ANIMATED_SPRITESHEET_WORKFLOW.md`
* `docs/checklists/ASSET_QUALITY_CHECKLIST.md`

## Agent Startup Contract

Use the smallest relevant context for the task:

* Asset anchors/turnarounds: read `assets/ASSET_INDEX.md`, `docs/CHARACTER_BIBLE.md`, and `.codex/skills/asset-generation-pipeline/SKILL.md`.
* Walk cycles: read `assets/ASSET_INDEX.md`, `docs/SPRITESHEET_EXECUTION_NOTES.md`, and `.codex/skills/project-walk-cycle-pipeline/SKILL.md`.
* General animation work outside walk cycles: read `.codex/skills/animated-spritesheet-pipeline/SKILL.md` plus only the relevant workflow/checklist.
* Gameplay/runtime work: read `docs/GAME_SLICE_IDENTITY.md`, the relevant `src/` files, and the appropriate Game Studio/global skill.
* Reference research: read `docs/audit/REFERENCE_PROJECTS_AUDIT.md` first; inspect `references/` only for a specific workflow question.

Skip these directories unless the task explicitly requires them:

* `node_modules/`
* `dist/`
* `tmp/`
* `references/` recursive scans
* old rejected/generated drafts not referenced by `assets/ASSET_INDEX.md`

## User Context

The user is not technical.

Do not expect the user to know:

* which skill to use
* which engine to choose
* how spritesheets work
* how asset cleanup works
* how to test visual bugs
* how to structure prompts

Choose the correct workflow automatically and explain decisions simply.

## Core Rules

* Do not build gameplay until the game vision and prototype plan are approved.
* Do not copy reference project style or content.
* Do not duplicate global skills unless a project-local skill adds clear value.
* Do not delete reference material without explicit approval.
* Use plans for multi-step work.
* Use visual/browser testing when visual behavior matters.
* Treat AI-generated assets as raw material until cleaned, normalized, indexed, and tested.

## Project Structure

```text
src/          future game source code
public/       future runtime public files
assets/       new-game asset workspace
docs/         project knowledge and decisions
references/   imported references and old starter snapshots
```

## Commands

No app build is configured yet.

```bash
npm run check
npm test
```
