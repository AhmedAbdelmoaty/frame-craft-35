# Skill Consolidation Recommendation

## Local Skills In Current Repository

Current root Codex skills:

* `.codex/skills/project-game-agent-router`
* `.codex/skills/asset-generation-pipeline`
* `.codex/skills/animated-spritesheet-pipeline`

Old `.agents` and `.claude` skills are preserved under `references/imported-projects/` only. They are not active project skills.

## Skills Found In Reference Projects

Reference project skills include:

* `fal-ai-image`
* `phaser-gamedev`
* `phaser4-gamedev`
* `playwright-testing`
* `retro-diffusion`
* `threejs-builder`
* `threejs-capacitor-ios`
* `tinyswords-tilemap`

Some appear in `.agents`, `.claude`, and in one case `.codex`.

## Global Skills To Prefer

Prefer installed/global skills before copying reference skills:

* Phaser game development
* Phaser 4 game development
* Game Studio Phaser workflows
* Browser game playtesting
* Playwright
* Image generation
* 2D sprite generation
* 2D map generation
* Three.js
* Three.js game development
* React Three Fiber game development
* Skill creation guidance

## Workflows Worth Considering As Future Codex Skills

Only create more skills if the project repeatedly needs them and global skills do not cover them:

* statistics/business-game learning scenario authoring
* asset index generation and validation
* pixel snapping pipeline
* video-to-spritesheet extraction and frame curation
* chroma/background removal and despeckle cleanup
* provider-specific image generation, if the project commits to a provider such as fal.ai

## What Should Not Be Converted Now

Do not convert now:

* Phaser skills
* Phaser 4 skills
* Playwright/browser testing skills
* generic image generation
* generic Three.js skills
* reference-project-specific tilemap or art-pack skills
* provider-specific skills before the project chooses providers

## First New Skill Candidate If Needed Later

The first new skill worth considering later is:

`asset-index-maintainer`

Reason:

The next repeated need will likely be tracking generated files, approved files, frame sizes, animation names, licenses, and visual QA status.

Do not create it yet. First wait until the actual asset folder structure and game engine are chosen.
