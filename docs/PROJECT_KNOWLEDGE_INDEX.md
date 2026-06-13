# Project Knowledge Index

Use this index to choose the minimum file set. Do not read every docs folder.

## Current Active Direction

Active direction: `Analyst Triage`.

Professional game-first learning experience for IMP.

Topic: `Descriptive Statistics for Data Analysts`.

Player: `Data Analyst` / `Business Performance Analyst` inside a retail company.

Goal: teach statistics through gameplay actions and consequences, not through quiz/course/dashboard/case-study format.

## Active Source of Truth

Current Analyst Triage source of truth:

- `AGENTS.md`
- `docs/PROJECT_KNOWLEDGE_INDEX.md`
- `docs/game-design/ANALYST_TRIAGE_MASTER_BLUEPRINT.md`
- `docs/game-design/PROTOTYPE_V1_PLAYABLE_SPEC.md`
- `docs/game-design/FEEDBACK_ANIMATION_RULEBOOK.md`
- `docs/game-design/DEVELOPMENT_ROADMAP_V1_TO_FULL.md`
- `docs/game-design/MISSIONS_PROGRESSION.md`
- `docs/codex/CODEX_EXECUTION_MANUAL.md`
- `docs/codex/TASK_PROMPTS_SEQUENCE.md`
- `docs/codex/NO_GO_AND_ACCEPTANCE_CRITERIA.md`
- `docs/codex/CREDIT_SAVER_RULES.md`

Use these files for Analyst Triage game design, prototype planning, feedback rules, roadmap, task sequencing, and Codex execution constraints.

## Analyst Triage Project Skills

Use these project-local skills only when their task matches:

- `.codex/skills/analyst-triage-prototype-task/`
- `.codex/skills/gameplay-feedback-review/`
- `.codex/skills/credit-safe-codex-task/`

## Legacy / Reference-Only Material

These files and notes are reference-only and are not final design if they conflict with Analyst Triage:

- `docs/HANDOFF_CURRENT_STATE.md`
- `docs/GAME_SLICE_IDENTITY.md`
- older B2B Distribution / Madar Distribution notes
- old prototype/handoff notes
- reference-strategy docs
- mentor-playbook docs
- old workflow docs

Do not delete these files. Use them only when their historical or workflow context is directly relevant.

## Workflow References

Use only when the task needs them:

- Asset workflows only for asset tasks:
  - `docs/workflows/ASSET_GENERATION_WORKFLOW.md`
  - `docs/checklists/ASSET_QUALITY_CHECKLIST.md`
- Animation workflows only for animation tasks:
  - `docs/workflows/ANIMATED_SPRITESHEET_WORKFLOW.md`
  - `docs/workflows/ISOMETRIC_WORKFLOW.md`
- Reference audits only for reference cleanup or workflow lookup tasks:
  - `docs/audit/REFERENCE_PROJECTS_AUDIT.md`
  - `docs/reference-strategy/REFERENCE_EXTRACTION_STATUS.md`
- Mentor playbook only for workflow questions:
  - `docs/mentor-playbook/AI_GAME_DEV_MENTOR_PLAYBOOK.md`
  - `docs/mentor-playbook/FINAL_MENTOR_WORKFLOW_SUMMARY.md`
  - `docs/mentor-playbook/ASSET_PIPELINE.md`
  - `docs/mentor-playbook/COMMON_FAILURES_AND_FIXES.md`
- Skills docs only for skill planning tasks:
  - `docs/skill-plans/SKILL_CONSOLIDATION_RECOMMENDATION.md`
  - `docs/skill-plans/SKILL_DECISION_MATRIX.md`
  - `docs/mentor-playbook/SKILL_ACTION_PLAN.md`
  - `docs/mentor-playbook/SKILLS_INVENTORY.md`

## Project-Local Skills

Project-local Codex skills are stored under `.codex/skills/`.

Use them only when relevant to the active task. Use global Codex/Game Studio skills for general Phaser, Three.js, React Three Fiber, Playwright, browser testing, and generic game implementation.

## References

Reference projects are stored under:

- `references/imported-projects/`
- `references/archive/internal-workspace-snapshots/`

References are workflow-only. They are not final style, story, genre, mechanics, characters, or game identity.

Do not recursively inspect `references/` by default. If a named workflow lookup is needed, read the reference audit/status docs first, then open only the specific named reference path.

## Default Reading Discipline

Start with `AGENTS.md`, this index, and the specific task/design file named by the user.

Skip `node_modules/`, `dist/`, `tmp/`, broad docs scans, broad asset scans, and recursive reference scans unless the task explicitly requires them.
