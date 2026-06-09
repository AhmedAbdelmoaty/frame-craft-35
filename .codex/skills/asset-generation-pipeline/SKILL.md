---
name: asset-generation-pipeline
description: Generate, refine, organize, and validate 2D game assets for the statistics/business game. Use when the user asks for characters, business or office people, props, backgrounds, UI images, isometric references, visual style exploration, asset prompts, or cleanup plans, especially when the request is non-technical or incomplete.
---

# Asset Generation Pipeline

Use this skill to turn a loose visual request into a safe, testable asset plan. Do not copy the style, genre, characters, enemies, story, or world identity of reference projects.

## Workflow

1. Classify the asset: character anchor, prop, background, UI asset, isometric reference, or style exploration.
2. Read the project workflow only as needed:
   - `docs/workflows/ASSET_GENERATION_WORKFLOW.md`
   - `docs/prompt-library/ASSET_PROMPT_PATTERNS.md`
   - `docs/checklists/ASSET_QUALITY_CHECKLIST.md`
3. Convert vague user language into a concrete prompt with:
   - intended game role
   - camera/view
   - full body or cropped bounds
   - neutral pose or required expression
   - chroma/flat removable background when useful
   - explicit "do not include shadows/background props/text/logos" constraints when needed
4. Generate or request generation through the best available tool for the task.
5. Treat generated images as raw source, not game-ready assets.
6. Plan cleanup: background removal, transparent export, trimming, scale normalization, and naming.
7. Store working files under `assets/generated/` and approved files under `assets/final/`.
8. When visual quality matters, run a visual check before calling the asset ready.

## Quality Rules

- Prefer neutral anchor images before animation or directional variants.
- Keep business/statistics tone separate from reference-project fantasy, pirate, combat, or pixel-art identities unless the user explicitly chooses a style later.
- Avoid fake transparency, soft colored halos, inconsistent scale, cropped feet/hands, embedded text, and perspective drift.
- Use references for workflow memory only. Do not use them as direct visual targets.

## Output Contract

For each asset task, report:

- asset type and intended use
- selected workflow/tool
- generated or planned file location
- cleanup status
- whether a visual test is still needed
