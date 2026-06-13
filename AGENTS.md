# AGENTS.md

This repository is the workspace for the IMP educational game project.

## Project Direction

- Current approved game direction: `Analyst Triage`.
- IMP professional game-first learning experience.
- Topic: `Descriptive Statistics for Data Analysts`.
- Player: `Data Analyst` / `Business Performance Analyst` inside a retail company.
- Older B2B Distribution / Madar Distribution / investigation-slice framing is legacy unless explicitly re-approved.

## Default Reading Rule

Before any task, read only:

- `AGENTS.md`
- `docs/PROJECT_KNOWLEDGE_INDEX.md`
- the specific active task file or design file named by the user

Do NOT read all docs.
Do NOT recursively scan references.
Do NOT scan assets unless the task is asset-related.
Do NOT inspect `node_modules`, `dist`, or `tmp`.

## Current Source of Truth

For any Analyst Triage game-design, prototype, feedback, roadmap, or Codex execution task, the main source of truth is now:

- `docs/game-design/ANALYST_TRIAGE_MASTER_BLUEPRINT.md`
- `docs/game-design/PROTOTYPE_V1_PLAYABLE_SPEC.md`
- `docs/game-design/FEEDBACK_ANIMATION_RULEBOOK.md`
- `docs/game-design/DEVELOPMENT_ROADMAP_V1_TO_FULL.md`
- `docs/game-design/MISSIONS_PROGRESSION.md`
- `docs/codex/CODEX_EXECUTION_MANUAL.md`
- `docs/codex/TASK_PROMPTS_SEQUENCE.md`
- `docs/codex/NO_GO_AND_ACCEPTANCE_CRITERIA.md`
- `docs/codex/CREDIT_SAVER_RULES.md`

Use `AGENTS.md` and `docs/PROJECT_KNOWLEDGE_INDEX.md` as the reading router and guardrails.

## User Context

The user is non-technical.

Do not ask the user technical questions about engines, file architecture, sprite frame counts, or workflows.

Choose workflow automatically and explain simply.

## Core Rules

- Game-first, not quiz-first.
- Do not convert the case study into clickable slides or reports.
- Do not use walking between rooms as the core gameplay.
- Do not use NPC dialogue as the core gameplay.
- Do not build gameplay before the approved prototype spec is added.
- Do not generate assets before the core playable prototype requires them.
- Do not copy reference project style/content.
- Use small scoped tasks.
- Every implementation task must state:
  - Goal
  - Files to read
  - Files to edit
  - Constraints
  - Done when

## References Rule

`references/` are workflow-only.

Do not delete references.
Do not read them unless the current task explicitly asks for a named workflow lookup.

If needed, read `docs/audit/REFERENCE_PROJECTS_AUDIT.md` and `docs/reference-strategy/REFERENCE_EXTRACTION_STATUS.md` first, then inspect only the named reference path.

## Skills Rule

Use existing project-local skills only when relevant.

Analyst Triage project-local skills are available for scoped prototype, feedback, and credit-safe Codex tasks:

- `.codex/skills/analyst-triage-prototype-task/`
- `.codex/skills/gameplay-feedback-review/`
- `.codex/skills/credit-safe-codex-task/`

Do not create new skills in this task.
Do not copy skills from references in this task.

## Commands

Run commands only when relevant.
Do not run build/server for docs-only tasks.

```bash
npm run check
npm test
```
