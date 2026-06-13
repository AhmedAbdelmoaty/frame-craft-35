# Credit-Safe Codex Task Skill

## When to use

Use this skill before any task where scope, cost, or unnecessary reading may become a problem.

## Goal

Keep Codex efficient: minimum context, minimum file edits, appropriate validation.

## Rules

1. Read only named files and directly relevant source files.
2. Do not recursively scan the repo.
3. Do not read `references/` unless explicitly requested.
4. Do not run dev server for docs-only work.
5. Do not run build repeatedly.
6. Do not generate assets unless the task is asset generation.
7. Do not create new files unless requested.
8. Do not refactor unrelated code.
9. Stop and ask before expanding scope.

## Task framing template

```text
Goal:
Read only:
Edit only:
Do not touch:
Validation:
Done when:
```

## Validation guide

- Docs task: no build/server.
- Source logic task: fastest configured check.
- Visual task: browser/dev server only if needed.
- Asset task: index/dimensions/review; no app unless integration.

## Completion report

Always report:

- files changed;
- commands run;
- commands intentionally skipped;
- whether references/assets/src were touched.

