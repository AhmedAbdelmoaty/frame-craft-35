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

Until Analyst Triage design files are added, the current direction comes from this `AGENTS.md` and `docs/PROJECT_KNOWLEDGE_INDEX.md`.

When Analyst Triage design files are added later, they become the main design source of truth.

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

Do not create new skills in this task.
Do not copy skills from references in this task.

## Commands

Run commands only when relevant.
Do not run build/server for docs-only tasks.

```bash
npm run check
npm test
```
