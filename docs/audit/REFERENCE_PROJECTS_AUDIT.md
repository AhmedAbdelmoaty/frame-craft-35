# Reference Projects Audit

## Purpose

This audit summarizes what should be learned from the imported reference projects before the statistics/business game becomes the main project.

The reference projects are workflow references only. They must not define the new game's final style, genre, characters, enemies, story, or mechanics.

## references/imported-projects/Another Project1

Primary value:

* strongest practical generated-asset cleanup reference
* pixel snapping workflow
* frame recovery workflow
* per-frame snap workflow
* runtime normalization and alignment
* visual examples of failures: mixels, bleeding, drift, height drift

Most useful folders:

* `prompts/`
* `references/problems/`
* `references/poseboard/`
* `references/diagrams/`
* `references/grids/`
* `spritesheets/`

Keep as reference until:

* asset-generation and animated-spritesheet workflows are proven in the new game
* useful diagrams/problems are either referenced or recreated in project docs

Archive priority later:

* high candidate for first archive after extraction because it is focused and already well represented in our workflow docs

Do not copy:

* character identity
* combat content
* pirate/skeleton/fantasy visuals

## references/imported-projects/Another Project2

Primary value:

* clearest step-by-step prompt sequence for character asset generation
* box art to anchor
* neutral anchor reset
* directional anchors
* walk cycle via image-to-video
* attack/idle pose sheets
* normalization

Most useful folders/files:

* `README.md`
* `prompts/01-box-art.md`
* `prompts/02-south-anchor.md`
* `prompts/03-neutral-anchor.md`
* `prompts/04-directional-anchors.md`
* `prompts/05-walk-cycle-i2v.md`
* `prompts/08-normalization.md`
* `references/anchors/`
* `references/animations/`
* `references/normalization/`

Keep as reference until:

* the new game has its first original character anchor and first non-combat animation workflow

Archive priority later:

* medium; keep longer than references/imported-projects/Another Project1 because its prompts are directly reusable as patterns

Do not copy:

* character style
* fantasy/magic framing
* any specific identity or action content

## references/imported-projects/Another Project3

Primary value:

* isometric 8-way turnaround workflow
* fal.ai image-generation Codex skill exists here
* plans, prompts, and learnings are organized cleanly
* experiment request/response records show reproducibility discipline

Most useful folders/files:

* `.codex/skills/fal-ai-image/`
* `.agents/skills/fal-ai-image/`
* `.claude/skills/fal-ai-image/`
* `plans/`
* `prompts/`
* `learnings/`
* `experiments/fal-image/`
* `public/assets/tictac/characters/...`

Keep as reference until:

* we decide whether the statistics/business game needs isometric movement or fal.ai model comparison

Archive priority later:

* low until skill decisions are complete, because it contains the strongest actual Codex-ready external-provider skill

Do not copy:

* tactics style
* adventurer character
* fantasy framing

## references/imported-projects/Another Project4

Primary value:

* broad starter pack
* multiple local skills
* Phaser/Three.js/Playwright/fal.ai/Retro Diffusion workflows
* example projects for 2D, 3D, tiny games, asset manifests, and deployment structures

Most useful folders/files:

* `START-HERE.md`
* `README.md`
* `.agents/skills/`
* `.claude/skills/`
* `projects/oakwoods/prompts/`
* `projects/oakwoods/plans/`
* `projects/forest-census/public/ASSET_INDEX.md`
* `bonus/vibe-isometric-sprites/`

Keep as reference until:

* all skills have a clear keep/copy/convert/ignore decision
* project structure patterns are extracted into the new workspace

Archive priority later:

* medium-low because it is broad and contains several useful skill references

Do not copy:

* bundled project styles
* starter game content
* third-party asset-specific workflows unless the new game uses that exact asset pack

## Overall Reference Decision

Most important knowledge:

* `references/imported-projects/Another Project4` for broad game-dev skill ecosystem
* `references/imported-projects/Another Project1` for asset cleanup and failure examples
* `references/imported-projects/Another Project2` for reusable prompt flow
* `references/imported-projects/Another Project3` for isometric workflow and fal.ai Codex skill
* `references/imported-projects/root-phaser-starter` for the original root Phaser shell and local Phaser skills

Most important prompts:

* `references/imported-projects/Another Project2/prompts`
* `references/imported-projects/Another Project1/prompts`
* `references/imported-projects/Another Project3/prompts`
* `references/imported-projects/Another Project4/projects/oakwoods/prompts`

Most important asset workflow:

* `references/imported-projects/Another Project1` and `references/imported-projects/Another Project2`

Most important skill source:

* `references/imported-projects/Another Project3/.codex/skills/fal-ai-image`
* `references/imported-projects/Another Project4/.agents/skills`
* `references/imported-projects/root-phaser-starter/.agents/skills`

## Current Action

The original root Phaser starter has been moved into `references/imported-projects/root-phaser-starter`.

Next safe action is a controlled skill consolidation decision, then a user-approved reference cleanup plan.
