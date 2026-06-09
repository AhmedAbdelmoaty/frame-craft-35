# Reference Extraction Status

Last updated: 2026-06-07.

References are workflow material only. They are not game style, story, character, or mechanic sources.

## Current Decision

The user approved cleanup after extracting useful lessons. Do not delete or move `references/` in bulk yet.

The project has extracted a large amount of useful reference knowledge into `docs/` and `.codex/skills/`, but reference projects remain useful for targeted inspection until each category below is marked complete.

Reference cleanup must now happen folder-by-folder:

1. confirm the folder's useful workflow lessons are already represented in `docs/` or `.codex/skills/`;
2. mark that folder as `delete-ready` or `archive-ready` in this file;
3. delete/archive only that folder, not the whole reference tree;
4. update this file immediately after the action.

## Extracted Into Project Sources

| Reference Knowledge | Project Source | Status |
| --- | --- | --- |
| Agent operating approach | `docs/agent-system/AGENT_OPERATING_SYSTEM.md` | extracted |
| Ready-state/task discipline | `docs/agent-system/READY_STATE.md`, `docs/checklists/TASK_READINESS_CHECKLIST.md` | extracted |
| Asset generation workflow | `docs/workflows/ASSET_GENERATION_WORKFLOW.md`, `.codex/skills/asset-generation-pipeline/` | extracted |
| Animated spritesheet workflow | `docs/workflows/ANIMATED_SPRITESHEET_WORKFLOW.md`, `.codex/skills/animated-spritesheet-pipeline/` | extracted |
| Walk-cycle recovery/speed rules | `docs/SPRITESHEET_EXECUTION_NOTES.md`, `.codex/skills/project-walk-cycle-pipeline/`, `scripts/recover_spritesheet_strip.py` | extracted/current |
| Isometric workflow | `docs/workflows/ISOMETRIC_WORKFLOW.md` | extracted |
| Prompt patterns | `docs/prompt-library/ASSET_PROMPT_PATTERNS.md`, `docs/mentor-playbook/PROMPT_PATTERNS.md` | extracted |
| Common failures and fixes | `docs/mentor-playbook/COMMON_FAILURES_AND_FIXES.md`, `docs/audit/REFERENCE_PROJECTS_AUDIT.md` | extracted |
| Reference project audit | `docs/audit/REFERENCE_PROJECTS_AUDIT.md` | extracted |
| Skill consolidation decisions | `docs/skill-plans/SKILL_CONSOLIDATION_RECOMMENDATION.md`, `docs/skill-plans/SKILL_DECISION_MATRIX.md` | extracted |

## Still Useful For Targeted Lookup

| Reference Area | Why Keep For Now | Archive Readiness |
| --- | --- | --- |
| `references/imported-projects/Another Project1` | Practical failure examples for asset cleanup, frame recovery, drift, bleeding, and normalization | keep until the male/female runtime sprite pipeline is proven |
| `references/imported-projects/Another Project2` | Step-by-step prompt sequence examples for anchors, directional references, and walk cycles | keep until both player characters have accepted walk/idle sets |
| `references/imported-projects/Another Project3` | Isometric and external provider experiment discipline | keep until environment/isometric decision is final |
| `references/imported-projects/Another Project4` | Broad skill/starter ecosystem and example project structures | keep until runtime/gameplay structure is stable |
| `references/imported-projects/root-phaser-starter` | Original Phaser shell and old local Phaser skills | keep until final runtime architecture is chosen |

## Archive Criteria

A reference folder can be proposed for archive only when:

- the useful workflow lessons are represented in `docs/` or `.codex/skills/`;
- no active task depends on inspecting that folder;
- a quick audit lists what will be archived;
- the user explicitly approves the archive/move.

Deletion requires a separate explicit user approval after archive readiness is confirmed.

## Agent Rule

Before inspecting `references/`, read `docs/audit/REFERENCE_PROJECTS_AUDIT.md` and this file. Then open only the specific reference path needed for the current question.
