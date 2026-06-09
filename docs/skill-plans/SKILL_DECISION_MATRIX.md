# Skill Decision Matrix

| Skill | Source | Value | Overlap | Decision Now | Future Action |
|---|---|---|---|---|---|
| `phaser-gamedev` | root `.agents`, `.claude`, references/imported-projects/Another Project4 | Phaser 2D gameplay, spritesheets, physics | Global Phaser skills | Do not copy | Use global/local reference when building |
| `phaser4-gamedev` | root `.agents`, `.claude`, references/imported-projects/Another Project4 | Phaser 4 renderer, migration, texture exactness | Global Phaser 4 skills | Do not copy | Use if project uses Phaser 4 |
| `playwright-testing` | references/imported-projects/Another Project4 | browser/canvas testing, flake reduction | Global Playwright/browser test skills | Do not copy | Extract ideas into testing workflow |
| `threejs-builder` | references/imported-projects/Another Project4 | Three.js scene graph, GLTF, calibration | Global Three.js skills | Do not copy | Use global Three.js skills if needed |
| `threejs-capacitor-ios` | references/imported-projects/Another Project4 | iOS wrapper workflow | Not needed now | Do not copy | Revisit only if iOS native shell is required |
| `tinyswords-tilemap` | references/imported-projects/Another Project4 | Tiny Swords tilemap rules | Asset-pack-specific | Do not copy | Ignore unless using exact asset pack |
| `retro-diffusion` | references/imported-projects/Another Project4 | pixel-art provider workflow, animation modes | Generic image/sprite skills overlap | Do not copy | Revisit only if choosing Retro Diffusion |
| `fal-ai-image` | references/imported-projects/Another Project3 and references/imported-projects/Another Project4 | provider workflow, queue, model comparison, cost tracking | Generic image generation overlap | Do not copy yet | First provider skill candidate if using fal.ai |
| `project-game-agent-router` | `.codex/skills` | non-technical request routing and skill choice | New project-specific | Created | Use at the start of ambiguous project tasks |
| `asset-generation-pipeline` | `.codex/skills` | anchors, props, backgrounds, UI cleanup | Partial overlap with image/sprite skills | Created | Use for project asset tasks |
| `animated-spritesheet-pipeline` | `.codex/skills` | frame recovery, curation, normalization, testing | Partial overlap with sprite skills | Created | Use for animation/spritesheet tasks |

## Practical Decision

Three project-local Codex skills now exist. They do not replace global skills; they add project-specific decision rules learned from the transcripts and reference audits.

Do not copy provider-specific or engine-specific reference skills unless a later project decision proves a gap.
