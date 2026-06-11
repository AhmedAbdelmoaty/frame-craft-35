# Agent Operating System

## Purpose

This document defines how Codex should work with a non-technical user on the statistics/business game workspace.

The user should not need to know which engine, skill, asset pipeline, test method, or file structure is correct. Codex should infer the technical workflow from the user's plain-language goal.

## Working With A Non-Technical User

Use simple language. Explain what is being done and why, but do not overwhelm the user with implementation details.

When the user gives a weak or broad request:

1. Identify the real task type.
2. Identify the smallest safe next step.
3. Choose the relevant skill or workflow automatically.
4. Make a short plan if the task is multi-step.
5. Execute only the requested scope.
6. Verify the result before calling it done.

Examples:

* "Make a character" means choose an asset workflow, not immediately build gameplay.
* "Make it move" may mean animation asset generation, in-game controls, or both. Inspect context before acting.
* "It looks wrong" means use visual testing and asset diagnostics before changing game code.

## When To Ask Versus Decide

Decide automatically when the choice is technical:

* Phaser versus Phaser 4 for an existing Phaser project.
* Image generation versus video generation for a specific animation type.
* Whether to use frame recovery, normalization, or browser testing.
* Whether an asset index needs updating.
* Whether global skills are enough.

Ask the user when the choice is creative or educational:

* What concept should the game teach?
* Who is the target learner?
* What tone should the game have?
* What kind of feedback should the player receive?
* What counts as success or failure?

If a request is risky or ambiguous, ask one concise question. Otherwise make a practical assumption and continue.

## Automatic Skill Selection

Use installed/global skills first. Do not copy or create local skills unless the project needs something missing.

Default choices:

* 2D browser game: Phaser / Phaser 4 game development skills.
* 3D browser game: Three.js or React Three Fiber skills.
* Visual bug or interactive verification: browser/playtest/Playwright workflow.
* Character, prop, background, UI image: image generation workflow.
* Spritesheet or animation cleanup: sprite/asset workflow.
* Walk/run/body-motion animation: video-to-spritesheet workflow.
* Pixel-art cleanup: pixel snapping workflow if crisp pixel art matters.
* Audio/music: audio generation only after the core loop exists.
* New reusable workflow: skill planning first, skill creation only if it adds real value.

## Step-By-Step Work

Do not build large systems in one shot.

Preferred sequence:

1. Understand the goal.
2. Inspect local context.
3. Choose workflow and skills.
4. Plan the smallest useful step.
5. Implement or document that step.
6. Verify with tests, browser screenshots, or file checks as appropriate.
7. Record prompts, decisions, and risks when useful.

## Verification Before Completion

A task is not done until the relevant verification has happened:

* Documentation task: files exist and contain the requested scope.
* Asset task: files exist, transparency is correct, dimensions are known, and quality checklist passes.
* Spritesheet task: frame dimensions, frame count, baseline, drift, bleeding, and asset index are checked.
* Gameplay task: browser test or screenshot verification when visual behavior matters.
* Skill task: existing global/local skills have been checked before proposing a new one.

## Reference Project Safety

The reference projects teach workflow only.

Extract:

* project structure
* planning habits
* prompt patterns
* skill selection
* asset pipelines
* testing methods
* failure recovery

Do not copy:

* visual style
* genre
* story
* characters
* enemies
* combat systems
* pirate, fantasy, tactics, or pixel-art identity

The statistics/business game must have its own visual identity and learning design.

## Operating Rule

When in doubt, preserve the project, document the decision, and choose the smallest reversible step.
