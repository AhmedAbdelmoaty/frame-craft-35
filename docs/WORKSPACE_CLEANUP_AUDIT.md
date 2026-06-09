# Workspace Cleanup Audit

Last updated: 2026-06-07.

This audit classifies the main workspace folders so agents do not waste time scanning large or low-value areas.

## Classification

| Path | Class | Current Use | Agent Rule |
| --- | --- | --- | --- |
| `AGENTS.md` | source-of-truth | Primary agent rules and startup contract | Read first for major work |
| `docs/PROJECT_KNOWLEDGE_INDEX.md` | source-of-truth | Router for project knowledge | Read instead of scanning all `docs/` |
| `docs/CHARACTER_BIBLE.md` | source-of-truth | Character identity and visual direction | Read for character asset tasks |
| `docs/SPRITESHEET_EXECUTION_NOTES.md` | source-of-truth | Current speed/quality rules for walk cycles | Read for walk/idle animation tasks |
| `.codex/skills/` | active | Project-local skills | Use the task-specific skill automatically |
| `scripts/recover_spritesheet_strip.py` | active | Deterministic frame recovery for generated strips | Use for repeated strip recovery |
| `assets/ASSET_INDEX.md` | source-of-truth | Current asset registry | Read before touching generated assets |
| `assets/generated/` | generated/current | Raw and candidate generated assets | Keep current candidates and review previews; remove rejected drafts only when safe |
| `assets/final/` | active | Future final cleaned runtime assets | Use only after approval/cleanup |
| `public/` | active/runtime | Runtime public assets and manifest | Edit only for runtime integration |
| `src/` | active/runtime | Game source code | Edit only for gameplay/runtime tasks |
| `docs/mentor-*`, `docs/workflows/`, `docs/checklists/` | reference-only | Extracted workflow knowledge | Read only the relevant file for the task |
| `docs/audit/`, `docs/reference-strategy/`, `docs/skill-plans/` | reference-only | Prior audit and consolidation decisions | Read before cleanup/skill/reference decisions |
| `references/` | reference-only | Imported workflow references | Do not recursively scan; inspect only named files/folders |
| `references/imported-projects/` | archive-candidate | Old projects preserved for workflow learning | Keep until extraction status is complete and deletion/archive is approved |
| `node_modules/` | ignored/tooling | Installed dependencies | Never inspect unless debugging dependency internals |
| `dist/` | ignored/build-output | Build output | Do not inspect for normal tasks |
| `tmp/` | ignored/temporary | Temporary local files | Do not inspect unless task references it |

## Cleanup Applied

2026-06-07 cleanup pass:

- Removed `node_modules/` because it is regenerable dependency output and the largest file-count driver.
- Removed `dist/` because it is build output.
- Removed `tmp/` because it contained temporary local files.
- Removed `docs/mentor-transcripts/` because these raw transcripts were already distilled into `docs/mentor-playbook/`, `docs/workflows/`, and project-local skills.
- Added `tmp` and `.vite-temp` to `.gitignore`.

To run the app again after this cleanup, reinstall dependencies with `npm install`.

## Current Size Drivers

Observed file-count drivers:

- `node_modules`: largest folder by file count; ignored and not useful for normal agent context.
- `references`: large reference corpus; useful only for specific workflow lookup.
- `assets/generated`: growing asset workspace; must be governed by `assets/ASSET_INDEX.md`.
- `docs`: medium-size knowledge base; should be accessed via `docs/PROJECT_KNOWLEDGE_INDEX.md`.

## Cleanup Policy

- Do not delete `references/` without explicit user approval.
- Do not delete files referenced by `assets/ASSET_INDEX.md`.
- Delete rejected generated drafts only after confirming they are not indexed and not needed for review.
- Prefer archiving reference projects over deletion until extraction is complete.
- Do not move large directories in the same task as gameplay or asset generation.
- Keep `node_modules/`, `dist/`, and `tmp/` out of normal workspace context; regenerate them only when needed.

## Speed Policy

- Use the task-specific local skill before broad search.
- Prefer targeted `Select-String`/`rg` over recursive file reading.
- Avoid writing new scripts for repeated asset tasks when a project script already exists.
- Keep review files short; record only status, paths, dimensions/cell size, what works, and blocking issues.
- Do not run build/server for asset-only work.

## Recommended Next Cleanup Actions

1. Keep this audit as the workspace map for future agents.
2. Use `docs/reference-strategy/REFERENCE_EXTRACTION_STATUS.md` to decide when references can be archived.
3. Periodically check `assets/ASSET_INDEX.md` for stale paths before deleting generated files.
4. After a character animation direction is accepted, keep the recovered strip, GIF, frame review, recovered frames, and review file; remove failed unindexed attempts.
