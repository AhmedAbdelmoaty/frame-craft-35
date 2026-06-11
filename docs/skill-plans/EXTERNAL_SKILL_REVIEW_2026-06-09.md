# External Skill Review - 2026-06-09

## Purpose

Review the requested external game-development skills before installing anything new.

The current rule is to avoid duplicate skills when the project already has equivalent local or global coverage.

## Current Coverage

Project-local skills:

- `project-game-agent-router`: routes non-technical game requests to the right workflow.
- `asset-generation-pipeline`: anchors, characters, props, backgrounds, asset review, and indexing.
- `animated-spritesheet-pipeline`: generated animation recovery, curation, normalization, and QA.
- `project-walk-cycle-pipeline`: project-specific one-direction walk-cycle workflow.

Available global/plugin coverage in this Codex setup:

- Game Studio skills for Phaser, Three.js, React Three Fiber, game UI, foundations, sprite work, and playtesting.
- Browser plugin for local visual testing and screenshots.
- Image generation skill for bitmap asset generation.

Reference-only skill sources preserved in this repository:

- `references/imported-projects/root-phaser-starter/.agents/skills/phaser-gamedev`
- `references/imported-projects/root-phaser-starter/.agents/skills/phaser4-gamedev`
- `references/imported-projects/Another Project3/.codex/skills/fal-ai-image`
- `references/imported-projects/Another Project4/.agents/skills`

## Requested Skills Decision

| Requested skill | Decision | Reason |
| --- | --- | --- |
| `phaser-gamedev` | Do not install now | Phaser workflow is covered by global Game Studio skills, and a reference copy is already preserved under `references/imported-projects/root-phaser-starter/`. |
| `generate2dsprite` | Do not install now | Covered by `asset-generation-pipeline`, `animated-spritesheet-pipeline`, `project-walk-cycle-pipeline`, and global sprite/image skills. |
| `generate2dmap` | Do not install now | Map generation is premature until room list, camera model, and prototype plan are approved. Use Game Studio/Phaser skills later. |
| `game-character-sprites` | Do not install now | Character anchor, turnaround, and spritesheet workflow is already project-specific and indexed. |
| `threejs-fundamentals` | Do not install now | Three.js libraries are installed, and global Three.js skills cover implementation when 3D is actually chosen. |
| `r3f-fundamentals` | Do not install now | React Three Fiber libraries are installed, and global R3F skills cover future React-hosted 3D work. |
| Playwright/browser testing | Do not install now | Browser plugin and Game Studio playtest skills cover the current visual QA need. |

## Future Installation Candidates

Install a new skill only if a real project decision creates a gap:

- `fal-ai-image`: only if the project commits to fal.ai as an image provider and needs provider-specific queue/model/cost tracking.
- A map/tile workflow skill: only after the office room plan and camera model are approved.
- A learning-game design skill: only if project-specific educational design rules become too large for normal docs.

## Practical Rule

Use existing project-local skills first for project decisions and assets. Use global Game Studio/Browser skills for engine and rendered verification. Treat external skills as references unless they add a capability the current setup cannot perform.
