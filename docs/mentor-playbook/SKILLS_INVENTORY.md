# Skills Inventory

## Purpose

This file tracks which skills and workflows should be used automatically for future game-development tasks. The user is not technical and should not need to name skills, engines, asset workflows, or testing strategies.

## Installed Skills To Prefer

Use these installed Codex skills when their trigger matches the task:

* `phaser-gamedev`: Use for Phaser 3 2D browser games, scenes, sprites, animation, Arcade/Matter physics, tilemaps, and input.
* `phaser4-gamedev`: Use for Phaser 4 2D browser games, WebGL-first rendering, Phaser 4 migration issues, filters, lighting, and modern Phaser 4 APIs.
* `game-studio:phaser-2d-game`: Use for broader Phaser game implementation with TypeScript/Vite project structure.
* `game-studio:web-game-foundations`: Use before substantial game architecture work.
* `game-studio:game-playtest`: Use for browser-game smoke tests, screenshot QA, and visual verification.
* `playwright`: Use when a real browser must be automated from the terminal.
* `game`: Use for autonomous browser-game implementation and playtesting when the task is broad.
* `game-character-sprites`: Use for fixed-cell pixel-art character spritesheets.
* `generate2dsprite`: Use for 2D game assets and animation sheets.
* `generate2dmap`: Use for production-oriented 2D maps.
* `imagegen`: Use when AI-generated bitmap visuals are needed.
* `threejs`: Use for 3D web scenes.
* `threejs-game`: Use for 3D game mechanics, camera, controls, and WebGL game loops.
* `game-studio:three-webgl-game`: Use for imperative Three.js browser games.
* `game-studio:react-three-fiber-game`: Use for React Three Fiber 3D games.
* `build-web-apps:frontend-testing-debugging`: Use when testing rendered frontend/game shells.

## Local Project Skills

Local skills currently visible in this repository:

* `.agents/skills/phaser-gamedev/SKILL.md`
* `.agents/skills/phaser4-gamedev/SKILL.md`

These should be checked when Phaser work begins. Prefer the local skill if it contains project-specific Phaser guidance that is more relevant than the global skill. Prefer the global skill if it is more current and the local skill is generic.

## Transcript-Referenced Skills Not Currently Installed As Named

The mentor transcripts mention several workflows that may exist in the mentor's private setup but are not necessarily installed here under the same names:

* GPT image 1.5 skill
* Sora 2 skill
* Fal.ai image generator skill
* Nano Banana / Nano Banana Pro workflow
* Game Dev Asset Tools / Game Dev Asset Skill
* Skill Creator Plus
* Playwright MCP game testing skill

Do not duplicate these automatically. First check whether an installed Codex skill already covers the same workflow.

## Conversion Guidance For Non-Codex Skills

If a future task requires a transcript workflow that is not installed:

1. Identify the actual need, such as image prompt generation, video-to-spritesheet extraction, frame normalization, or screenshot QA.
2. Check installed skills first.
3. If no installed skill covers it, document a project-local workflow.
4. Convert only the minimum needed behavior into a Codex-compatible `SKILL.md`.
5. Include triggers, inputs, outputs, failure checks, and when not to use it.

## Automatic Skill Selection Rules

For 2D browser gameplay, select Phaser skills automatically.

For Phaser 4 projects, select `phaser4-gamedev` before generic Phaser guidance.

For visual game bugs, select browser/playtest skills automatically.

For generated spritesheets, select sprite/asset-generation skills automatically.

For walk cycles or complex body motion, prefer a video-generation-to-spritesheet workflow when available.

For still poses, character anchors, icons, props, and simple non-locomotion frames, prefer image generation.

For 3D games, select Three.js or React Three Fiber skills based on the project stack.

For skill creation, select a skill-creation workflow only after confirming no installed skill already solves the problem.

## Additional Workflow Capabilities From Final Transcripts

The remaining transcripts add these skill-selection lessons:

* Use built-in image generation for concept candidates, backgrounds, anchors, props, and visual references when it is available.
* Use parallel agents for independent creative candidates, such as multiple background options.
* Use asset/sprite skills for pixel snapping, frame recovery, background removal, frame curation, alignment, and normalization.
* Use video-to-spritesheet workflows for walk cycles and other body-motion animations.
* Use audio/music skills only after the core game loop works.
* Use browser testing after restart, game-over, audio, and scene transition changes.

Transcript-referenced capabilities that may need conversion only if not already covered:

* GPT Images 2.0 workflow
* Pixel Snapper / pixel-art cleanup skill
* Animated spritesheet skill
* Background removal skill
* ElevenLabs music and sound-effects skills
* Parallel sub-agent background generation workflow

Do not create these as local skills unless the project needs them and no installed Codex skill covers the same workflow.

Secret-handling rule:

* If an audio or asset provider requires an API key, store it outside committed files or in an ignored `.env` file.
* Never print, document, or commit API keys.
