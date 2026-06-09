---
name: project-game-agent-router
description: Choose the correct project workflow and global or local skill for the statistics/business game. Use at the start of ambiguous, non-technical, planning, asset, UI, gameplay, testing, or skill-related requests in this repository, especially when the user does not know which skill or workflow to ask for.
---

# Project Game Agent Router

Use this skill to convert a non-technical request into the right action without making the user name tools or workflows.

## First Pass

1. Read `docs/PROJECT_KNOWLEDGE_INDEX.md` when orientation is needed.
2. Classify the request:
   - game idea or learning design
   - gameplay/system implementation
   - asset generation
   - animated spritesheet
   - UI/HUD/menu
   - browser testing/playtest
   - project organization
   - skill creation or consolidation
3. Pick the smallest useful skill set:
   - Use global Game Studio skills for engine/game implementation.
   - Use global Phaser/Three/R3F skills when the engine is chosen.
   - Use global Playwright/browser testing skills for rendered verification.
   - Use `asset-generation-pipeline` for still assets.
   - Use `animated-spritesheet-pipeline` for animation sheets.
   - Use Skill Creator only when creating or changing skills.

## Decision Rules

- Ask the user only when the answer changes product direction, art direction, learning goals, or irreversible scope.
- Decide automatically when the issue is workflow, file organization, QA, cleanup, prompt structure, or technical sequence.
- Do not start building gameplay until the game vision and prototype plan are approved.
- Do not copy reference style. Translate reference lessons into project-specific plans.
- Do not duplicate global skills unless a local skill adds project-specific decision rules.

## Completion Rules

Before saying a task is done:

- verify the requested files/folders exist
- run the relevant lightweight check when available
- report what changed and what remains
- call out anything not done intentionally
