# Skills Audit

## Purpose

This audit identifies local, reference, and global skill coverage so the new project can avoid duplicate skills while preserving valuable workflows.

## Skills In Current Repo Root

### `.agents/skills/phaser-gamedev`

Status: useful but mostly covered globally.

Value:

* Phaser 3 scene lifecycle
* spritesheet measurement discipline
* Arcade physics
* tilemaps
* performance and pooling

Decision:

* do not copy
* keep as local reference for now
* prefer global Phaser skills unless this local version has project-specific details needed later

### `.agents/skills/phaser4-gamedev`

Status: useful but mostly covered globally.

Value:

* Phaser 4 WebGL-first renderer
* migration hotspots
* spritesheet/texture exactness
* rendering/performance decisions

Decision:

* do not copy
* keep as local reference for now
* prefer global Phaser 4 skill for new implementation

### `.claude/skills/phaser-gamedev` and `.claude/skills/phaser4-gamedev`

Status: duplicates of agent-compatible Phaser skills.

Decision:

* do not convert now
* keep until cleanup phase
* no immediate value to duplicate into the new project

## Skills In references/imported-projects/Another Project3

### `fal-ai-image`

Locations:

* `.codex/skills/fal-ai-image`
* `.agents/skills/fal-ai-image`
* `.claude/skills/fal-ai-image`

Status: strongest candidate for future project-local skill adoption.

Value:

* Codex-ready version exists
* fal.ai queue-based image workflow
* model comparison
* request/result tracking
* cost-aware experiment logging
* chroma/transparency guidance
* reproducibility discipline

Overlap with global skills:

* overlaps with generic image generation
* adds provider-specific experiment tracking and model comparison not fully covered by generic image generation

Decision:

* do not copy yet
* first candidate to copy later if we decide to use fal.ai
* do not use unless provider/API key choice is intentional

## Skills In references/imported-projects/Another Project4

### `phaser-gamedev`

Status: duplicate/variant of current and global Phaser skill.

Decision:

* do not copy
* extract only any missing reference notes if needed

### `phaser4-gamedev`

Status: duplicate/variant of current and global Phaser 4 skill.

Decision:

* do not copy

### `playwright-testing`

Status: useful but largely covered by global browser/playtest/Playwright skills.

Value:

* deterministic test mindset
* canvas/WebGL game testing
* ready signals
* screenshot/state assertions
* flake reduction

Decision:

* do not copy now
* use global Playwright/browser testing skills
* preserve specific canvas-game testing ideas in workflow docs

### `threejs-builder`

Status: useful but covered globally by Three.js skills.

Value:

* reference-frame contract
* GLTF loading
* calibration helpers
* scene intent workflow

Decision:

* do not copy now
* use global Three.js skills if the game becomes 3D

### `threejs-capacitor-ios`

Status: not needed now.

Value:

* Three.js + Capacitor iOS publishing workflow

Decision:

* do not copy
* ignore unless the game later targets iOS native shell

### `retro-diffusion`

Status: potentially valuable if we choose Retro Diffusion for pixel-art/spritesheet generation.

Value:

* provider-specific pixel-art generation
* animation spritesheet modes
* short-prompt constraints
* artifact verification
* sprite-native outputs

Overlap with global skills:

* overlaps with generic image/sprite generation
* adds provider-specific details

Decision:

* do not copy now
* possible future candidate only if we choose Retro Diffusion as a provider

### `tinyswords-tilemap`

Status: asset-pack-specific.

Value:

* Tiny Swords tile layering
* terrain elevation
* water foam animation

Decision:

* do not copy
* not relevant unless using Tiny Swords asset pack, which we should not assume

### `fal-ai-image`

Status: same class as references/imported-projects/Another Project3 version.

Decision:

* prefer references/imported-projects/Another Project3 `.codex` version if adopting later
* do not copy now

## Missing Project-Specific Skills

The new statistics/business game does not yet have project-specific skills for:

* learning-game design
* business/statistics asset generation
* non-combat educational animation spritesheets
* asset index validation

These may become useful after game concept discovery.

## Current Recommendation

Do not create or copy skills yet.

Prepare for two possible future project-local skills:

1. `business-game-agent`
2. `animated-spritesheet-pipeline`

Adopt `fal-ai-image` only if external provider-based image generation becomes part of the workflow.
