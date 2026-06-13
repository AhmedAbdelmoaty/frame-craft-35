# Analyst Triage — Codex Execution Manual

## 1. Purpose

This file tells Codex how to work on Analyst Triage without wasting time, credits, or scope.

The user is non-technical. Codex must choose the correct workflow and explain simply.

## 2. Default Reading Rule

For most tasks, read only:

1. `AGENTS.md`
2. `docs/PROJECT_KNOWLEDGE_INDEX.md`
3. the specific Analyst Triage file named by the user
4. the specific source files needed for the task

Do not read all docs.
Do not scan references.
Do not scan assets unless the task is asset-related.

## 3. Task Response Contract

Before implementation, provide a short plan:

```text
Goal:
Files I will read:
Files I will edit:
Constraints:
Done when:
```

Keep the plan short.

After implementation, report:

```text
Changed files:
Validation run:
What was not done:
Next suggested step:
```

## 4. Implementation Discipline

Do one small task at a time.

Do not combine:

- gameplay implementation and asset generation;
- documentation cleanup and runtime refactor;
- multiple missions in one task;
- visual polish and system design;
- broad refactor and feature work.

## 5. Game Design Discipline

Any gameplay task must preserve:

- game-first experience;
- player action every 10-20 seconds;
- visible feedback for each action;
- statistics hidden inside gameplay;
- no direct quiz framing;
- no dashboard as core interaction;
- no long NPC dialogue;
- no answer-revealing tools.

## 6. Credit-Safe Execution

Do not run expensive commands unless needed.

### Docs-only task

- Do not run build.
- Do not run dev server.
- Do not inspect browser.
- Use `git diff --name-only` and `git status --short` only if available.

### Runtime UI task

- Run targeted checks if configured.
- Run dev server/browser only when visual validation matters.
- Do not repeatedly restart server without reason.

### Asset task

- Do not run build/server unless integrating asset into runtime.
- Use `assets/ASSET_INDEX.md`.
- Keep review notes short.

## 7. References Rule

`references/` is not source of truth.

Only inspect references if the user explicitly asks for a named workflow lookup, such as:

- “look at walk cycle reference”;
- “inspect fal.ai skill”;
- “check phaser starter pattern”.

Then read:

1. `docs/audit/REFERENCE_PROJECTS_AUDIT.md`
2. `docs/reference-strategy/REFERENCE_EXTRACTION_STATUS.md`
3. only the specific reference path.

## 8. Asset Rule

Do not create final assets before the prototype needs them.

In early V1 use placeholders:

- circles;
- simple avatars;
- cards;
- colored states;
- simple office shapes.

Final assets come after gameplay is proven.

## 9. Validation Rule

Validation must fit the task.

- docs-only: check changed files only.
- gameplay logic: run unit/check if configured.
- visual/gameplay: run app/browser only when necessary.
- asset-only: inspect asset dimensions and index, not full build.

## 10. Non-Technical User Rule

Do not ask the user:

- which engine to choose;
- how many sprite frames;
- how to structure files;
- whether to use a skill;
- whether to run technical commands.

Make the professional choice and explain simply.

