# Analyst Triage — Credit Saver Rules for Codex

## 1. Goal

Reduce unnecessary token/credit use while keeping quality high.

## 2. Golden Rule

Read the smallest useful context. Edit the smallest useful file set. Validate only what the task requires.

## 3. Default Task Limits

For any task, Codex must identify:

- files to read;
- files to edit;
- commands to run;
- commands not needed.

## 4. Avoid These Expensive Behaviors

Do not:

- scan the entire repo;
- recursively read `references/`;
- read every docs folder;
- run dev server for docs-only work;
- run build repeatedly after small text changes;
- generate assets during gameplay logic tasks;
- refactor unrelated files;
- create new abstractions without request;
- write long plans for small tasks;
- run browser testing when no visual behavior changed.

## 5. When to Run Commands

### Docs-only changes

No build. No server.

Allowed:

- `git diff --name-only`
- `git status --short`

### Gameplay source change

Run the fastest available check first.

Use build only if it is the available validation or if requested.

### Visual interaction change

Run browser/dev server only when visual behavior must be verified.

### Asset-only change

Do not run app unless integrating into runtime.

## 6. Prompt Template for User

Use this for every Codex task:

```text
Task: [specific task]
Read only:
- [file 1]
- [file 2]
Edit only:
- [file 1]
Do not touch:
- references/
- assets/
- src/ unless specified
Validation:
- [specific command or no command]
Done when:
- [clear acceptance]
```

## 7. Stop Conditions

If Codex discovers the task requires broader work, it must stop and ask before expanding scope.

Examples:

- needs new package;
- needs engine decision;
- needs asset generation;
- needs reference scan;
- needs large refactor;
- task conflicts with source of truth.

