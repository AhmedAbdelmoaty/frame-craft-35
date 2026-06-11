# Final Mentor Workflow Summary

## 1. Complete AI Game Development Workflow

Start small. Choose the engine from the task, inspect the project, then build the smallest playable baseline before adding larger systems.

Recommended flow:

1. Clarify the learning or gameplay goal.
2. Choose the right installed skill automatically.
3. Inspect the existing project and assets.
4. Create or update a canonical asset index.
5. Build a tiny playable baseline with debug overlays.
6. Test visually in the browser.
7. Add the core interaction loop.
8. Close the loop with challenge, win/fail, game over, and restart.
9. Add sound and music.
10. Add polish such as hit stop, screen shake, flashes, and particles.
11. Save important prompts, plans, assets, and decisions.

For generated assets:

1. Create a neutral anchor.
2. Generate directions, poses, or motion sources from the anchor.
3. Use image generation for stills and simple pose sheets.
4. Use video generation for walk/run/body-motion cycles.
5. Recover frames from generated sheets or videos.
6. Curate the useful frames.
7. Remove/chroma-key backgrounds.
8. Pixel-snap if true pixel art matters.
9. Normalize frame size, body scale, and foot alignment.
10. Pack final spritesheets and update the asset index.
11. Test in-game with screenshots.

## 2. Working With A Non-Technical User

The user should describe goals in plain language. Codex should choose the technical path.

Do:

* explain decisions simply
* choose skills automatically
* avoid asking the user to pick engines, tooling, or asset pipelines
* show progress in practical terms
* keep work scoped and reversible
* preserve prompts and plans for continuity

Do not:

* expect the user to understand spritesheet math
* ask the user to choose between technical tools unless it affects the creative goal
* overwhelm them with implementation details
* build large systems in one shot

## 3. Automatic Skill Choice

Use Phaser skills for 2D browser games.

Use Phaser 4 skills when the project uses Phaser 4 or modern Phaser APIs.

Use Three.js or React Three Fiber skills for 3D games depending on the stack.

Use browser/playtest skills whenever the result is visual or interactive.

Use image generation for backgrounds, anchors, props, icons, and pose references.

Use sprite/asset skills for spritesheets, normalization, frame alignment, and pixel cleanup.

Use video-to-spritesheet workflows for walk, run, crouch, collapse, or other difficult body motion.

Use audio skills only after the core loop exists.

Do not duplicate private transcript skills if an installed Codex skill already covers the workflow.

## 4. Avoiding Asset And Spritesheet Mistakes

Always verify:

* frame width and height
* rows and columns
* empty frames
* frame ranges
* anchor/origin
* foot baseline
* body scale
* background transparency
* row bleed
* frame drift

Common fixes:

* use a neutral anchor
* avoid generating each animation frame independently
* recover frames before slicing a generated sheet
* curate only useful frames
* normalize around body height, not total weapon/effect height
* use chroma backgrounds instead of fake transparency
* pixel-snap when crisp pixel art matters
* test animations in-game, not only as image previews

## 5. Using Reference Projects Safely

The transcripts teach workflow only.

Extract:

* project structure
* planning habits
* skill-selection logic
* asset-generation pipelines
* testing methods
* failure recovery
* prompt patterns

Do not copy:

* visual style
* genre
* theme
* characters
* enemies
* story
* combat systems
* pirate, fantasy, tactics, or pixel-art identity

For this repository, any future statistics/business game should have its own learning goal, visual identity, core loop, and feedback model.

## 6. Next Safe Step Before Designing The Statistics/Business Game

Do not build the game yet.

The next safe step is to create a short design discovery document that defines:

* target learner
* statistics or business concept to teach
* what the player decides
* what feedback teaches the concept
* what success and failure mean
* what the smallest playable prototype should prove
* what visual style fits the topic without copying the references

After that, create a small prototype plan with one playable loop and a testing checklist. Only then should implementation begin.
