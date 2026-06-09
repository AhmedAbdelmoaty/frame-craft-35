# Project Knowledge Index

This is the customized knowledge base for the statistics/business game.

It contains the lessons extracted from mentor transcripts and reference projects, rewritten for this project rather than copied as reference content.

## Agent System

* `docs/agent-system/AGENT_OPERATING_SYSTEM.md`
* `docs/agent-system/READY_STATE.md`
* `docs/WORKSPACE_CLEANUP_AUDIT.md`

Use these to understand how Codex should work with a non-technical user, choose workflows automatically, plan safely, avoid copying reference styles, and avoid scanning unnecessary folders.

## Workflows

* `docs/workflows/ASSET_GENERATION_WORKFLOW.md`
* `docs/workflows/ANIMATED_SPRITESHEET_WORKFLOW.md`
* `docs/workflows/ISOMETRIC_WORKFLOW.md`

Use these for project-specific asset, animation, and isometric workflows.

## Game Direction

* `docs/GAME_SLICE_IDENTITY.md`
* `docs/game-design/madar-analyst-core-loop.md`
* `docs/CHARACTER_BIBLE.md`

Use these as the approved identity and character direction for the MADAR analyst slice before generating or replacing game assets.

## Learning Goals

* `docs/learning-goals/misunderstanding-statistics-case.md`

Use this to understand the first statistics case from `Why Analysis Fails - HR.pdf`, including the business rule, team data, correct interpretation, and what the game must teach without spoiling early.

## Implementation Plans

* `docs/plans/game-logic-next-steps.md`

Use this after the user approves moving from concept alignment into gameplay implementation.

## Prompt Library

* `docs/prompt-library/ASSET_PROMPT_PATTERNS.md`
* `docs/mentor-playbook/PROMPT_PATTERNS.md`

Use these as starting patterns, then customize prompts for the actual game concept.

## Checklists

* `docs/checklists/TASK_READINESS_CHECKLIST.md`
* `docs/checklists/ASSET_QUALITY_CHECKLIST.md`

Use before and after tasks to avoid common mistakes.

## Skill Planning

* `docs/skill-plans/SKILL_CONSOLIDATION_RECOMMENDATION.md`
* `docs/skill-plans/SKILL_DECISION_MATRIX.md`
* `docs/mentor-playbook/SKILL_ACTION_PLAN.md`
* `docs/mentor-playbook/SKILLS_INVENTORY.md`

Use these before copying, converting, or creating project-local skills.

## Project-Local Skills

Project-local Codex skills are stored under:

* `.codex/skills/project-game-agent-router/`
* `.codex/skills/asset-generation-pipeline/`
* `.codex/skills/animated-spritesheet-pipeline/`
* `.codex/skills/project-walk-cycle-pipeline/`

Use these for project-specific routing, asset generation, spritesheet workflow, and one-direction walk-cycle generation. Use global Codex/Game Studio skills for general Phaser, Three.js, React Three Fiber, Playwright, browser testing, and generic sprite generation.

## Audits

* `docs/audit/REFERENCE_PROJECTS_AUDIT.md`
* `docs/audit/SKILLS_AUDIT.md`
* `docs/audit/PROMPTS_AND_PLANS_AUDIT.md`

Use these to understand what was learned from references and what still needs decisions.

## Mentor Playbook

* `docs/mentor-playbook/AI_GAME_DEV_MENTOR_PLAYBOOK.md`
* `docs/mentor-playbook/FINAL_MENTOR_WORKFLOW_SUMMARY.md`
* `docs/mentor-playbook/ASSET_PIPELINE.md`
* `docs/mentor-playbook/COMMON_FAILURES_AND_FIXES.md`

Use these as the long-term memory of the extracted AI game-development workflow.

## References

Reference projects are stored under:

* `references/imported-projects/`
* `references/archive/internal-workspace-snapshots/`
* `docs/reference-strategy/REFERENCE_EXTRACTION_STATUS.md`

References are not final style. They exist for traceability and workflow inspection only.

Do not recursively inspect `references/` by default. Read `docs/audit/REFERENCE_PROJECTS_AUDIT.md` and `docs/reference-strategy/REFERENCE_EXTRACTION_STATUS.md`, then open only the specific reference path needed for the task.

The original root Phaser starter is stored at:

* `references/imported-projects/root-phaser-starter/`

## Default Reading Discipline

Do not read every file in the workspace. Start with this index, `AGENTS.md`, and the task-specific local skill. Skip `node_modules/`, `dist/`, `tmp/`, and recursive reference scans unless the task explicitly requires them.
