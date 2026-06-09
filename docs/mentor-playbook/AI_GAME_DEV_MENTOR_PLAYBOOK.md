# AI Game Dev Mentor Playbook

## Purpose

This repository contains reference projects, transcripts, assets, prompts, plans, and skills from a technical AI game developer.

These materials are NOT the final game style.

They are references for learning:

* how to structure AI-assisted game projects
* how to use Codex skills correctly
* how to generate and prepare game assets
* how to create spritesheets and animations
* how to avoid common asset-generation mistakes
* how to test games visually
* how to work step by step instead of one-shotting large systems

The future game will be different from the reference projects. It may be an educational statistics, business, or data-analysis game. Do not copy pirate, fantasy, combat, or pixel-art style unless explicitly requested.

---

## User Context

The user is not technical.

Do not expect the user to know:

* which skill to use
* which command to run
* which engine is best
* how spritesheets work
* how animation frames should be structured
* how to debug game rendering issues
* how to choose between Phaser, Three.js, or React Three Fiber

You must choose the right installed skills automatically.

When the user describes a goal in normal language, infer the correct workflow and skills.

Always explain decisions simply.

---

## Core Operating Rules

1. Do not build huge systems in one shot.
2. Plan first for complex work.
3. Build iteratively.
4. Test visually whenever possible.
5. Keep a log of important prompts, plans, and decisions.
6. Use existing installed skills when relevant.
7. Do not duplicate skills already installed globally unless project-specific changes are needed.
8. Do not delete reference files until they have been audited and summarized.
9. Do not copy the visual style of reference projects into the final game.
10. Treat reference projects as workflow examples, not as design targets.

---

## Automatic Skill Selection

The user should not need to name skills.

Use skills automatically based on task type:

* For 2D browser games: use Phaser / Phaser game development skills.
* For 3D browser scenes: use Three.js skills.
* For 3D inside React: use React Three Fiber / Drei / Rapier skills.
* For visual browser testing: use Playwright/browser testing skills.
* For sprite or asset generation: use image-generation / game-asset skills.
* For spritesheet cleanup: use asset normalization, pixel snapping, frame alignment, or image-processing workflows.
* For sound effects/music: use audio or ElevenLabs-related skills if configured.
* For creating or improving skills: use skill-creation guidance.

If a needed skill exists in both global Codex skills and this repository, prefer the maintained global version unless the local version has project-specific improvements.

---

## Reference Project Rule

The reference projects may include:

* pirate characters
* skeletons
* fantasy themes
* combat
* platformers
* beat-em-up mechanics
* pixel art
* isometric tactics-style assets

These are not the target identity.

Extract:

* process
* structure
* workflow
* prompts
* asset pipeline
* testing methods
* common mistakes and fixes

Do not extract:

* final art style
* game theme
* characters
* combat mechanics
* pirate/fantasy identity

---

## Standard Game Development Workflow

For any new game task:

1. Understand the goal.
2. Identify the right engine/workflow.
3. Check existing project structure.
4. Check available assets.
5. Create or update an asset index if needed.
6. Build the smallest playable loop first.
7. Add debug tools early.
8. Test in browser.
9. Fix obvious issues before adding more features.
10. Add polish only after the loop works.

Avoid:

* building menus, progression, assets, enemies, UI, sound, and polish all at once
* changing unrelated files
* deleting references too early
* assuming generated art is game-ready

---

## Asset Index Rule

For game assets, create a canonical asset index such as:

* `public/assets/index.json`
* `public/assets/assets.json`
* or a project-specific equivalent

The asset index should describe:

* asset paths
* image dimensions
* spritesheet frame width and height
* rows and columns
* animation names
* frame ranges
* frame rate
* anchor points
* collision metadata if useful

This prevents Codex from repeatedly guessing asset structure.

Always verify spritesheet dimensions before implementing animations.

---

## Asset Generation Workflow

When generating custom game assets:

1. Start with a clear visual direction.
2. Generate mockups first.
3. Pick one strong reference.
4. Create an anchor image.
5. Use the anchor for all future character generations.
6. Generate directions or poses from the anchor.
7. Normalize assets before using them in-game.
8. Update the asset index.
9. Test the asset in the game.

Never assume raw AI images are game-ready.

---

## Character Anchor Workflow

The anchor image is the base identity of the character.

It should be:

* readable
* neutral
* consistent
* not holding temporary effects unless required
* suitable for future animation
* aligned with final game art direction

For business/statistics games, likely character types may include:

* analyst
* manager
* shop owner
* customer
* data assistant
* business stakeholder
* office worker

Do not use pirate/fantasy anchors unless explicitly requested.

---

## Spritesheet Workflow

For spritesheets:

1. Generate or collect frames.
2. Check frame count.
3. Check frame dimensions.
4. Remove background.
5. Recover frames if spacing is uneven.
6. Normalize all frames into a strict grid.
7. Align feet/body consistently.
8. Prevent frame drift.
9. Prevent frame bleeding.
10. Export final spritesheet.
11. Update asset index.
12. Test in-game.

Common animations:

* idle
* walk
* run
* interact
* talk
* thinking
* point/explain
* success
* confusion
* report/submit

For this user’s future game, non-combat animations may be more important than combat animations.

---

## Walk Cycle Workflow

Do not rely on image generation alone for walk cycles unless the result is very simple.

Image models often fail walk cycles by:

* freezing legs
* changing character identity
* swapping body parts
* producing inconsistent frames
* creating unusable motion

Better workflow:

1. Use a strong anchor image.
2. Use video generation when available.
3. Prompt for “walking in place” or “running in place”.
4. Keep character inside frame.
5. Extract frames from the video.
6. Select only one clean loop.
7. Reduce to around 8–12 useful frames.
8. Normalize and align.
9. Export as spritesheet.
10. Test in-game.

Never embed raw video as the game animation. Convert to frames/spritesheet.

---

## Isometric Character Workflow

For isometric characters:

1. Start with a high-quality reference or portrait.
2. Generate a full-body anchor.
3. Convert to an isometric game-ready anchor.
4. Generate cardinal directions first.
5. Generate diagonal directions second.
6. Combine directions into a sheet.
7. Normalize height and foot alignment.
8. Remove background.
9. Test directions in-game.

Avoid generating all 8 directions in one shot if consistency is poor.

If the game becomes isometric, maintain consistent:

* camera angle
* body proportions
* lighting
* foot position
* silhouette
* direction labels

---

## Background and Transparency Rules

Many image generators do not produce true transparency.

Use chroma backgrounds when needed:

* bright green
* bright magenta
* another color not present in the character

Then remove the chroma background later.

Avoid fake transparency checkerboards generated as pixels.

---

## Common Asset Mistakes to Avoid

Watch for:

* frame bleeding
* frame drift
* wrong frame width
* wrong frame height
* wrong row/column count
* empty frames counted as animation frames
* character sinking into ground
* character floating above ground
* inconsistent character scale
* inconsistent anchor point
* animation showing part of previous row
* weapon/effect changing character height incorrectly
* fake transparent backgrounds
* blurry “mixels” when true pixel art is required
* walk cycle legs not alternating
* generated frames not equally spaced

When these happen, fix the asset pipeline, not only the game code.

If a bug reveals weakness in a skill, update the skill or document the failure.

---

## Browser Testing Workflow

For visual game work, use browser/Playwright testing when available.

Test:

* game loads
* no console errors
* controls work
* character visible
* animation plays correctly
* movement works
* collision works
* UI appears
* restart works
* game state resets correctly
* assets are not missing
* screenshots look correct

Take screenshots before/after fixes.

Do not trust code-only success for visual game tasks.

---

## Debug Tools Rule

Add debug tools early.

Useful debug overlays:

* world bounds
* visual bounds
* collision hitboxes
* attack/interaction boxes
* current animation
* current input
* pointer position
* FPS/performance if relevant

For educational games, also consider debug views for:

* current decision state
* current evidence/state
* scoring/evaluation state
* progression flags

Debug tools should be easy to hide.

---

## Prompt and Plan Logging

Keep important prompts and plans.

Recommended structure:

* `docs/prompts/`
* `docs/plans/`
* `docs/mentor-playbook/`
* `docs/decisions/`

For major work, save:

* original user goal
* plan
* chosen skills
* generated assets
* important decisions
* bugs found
* fixes applied

This makes the project easier to continue later.

---

## Skill Handling Rules

When auditing skills:

1. Find all local skill folders.
2. Find all `SKILL.md` files.
3. Identify whether each skill is Codex-ready.
4. Identify whether it is for Claude, Codex, Cursor, or cross-agent use.
5. Do not blindly copy all skills.
6. Compare with globally installed skills.
7. Keep only useful project-specific skills locally.
8. Convert non-Codex skills only when needed.
9. Do not overwrite global skills without approval.
10. Document skill decisions.

If converting a skill to Codex:

* create a clear `SKILL.md`
* include trigger conditions
* include step-by-step workflow
* include common mistakes
* include when not to use the skill

---

## Future Game Direction

The final game is expected to be educational and related to:

* statistics
* business
* data analysis
* decision-making
* possibly business investigations or simulations

The final game should not be assumed yet.

Before building, clarify:

* learning goal
* target player
* core loop
* visual style
* level structure
* player decisions
* feedback system
* win/fail conditions

Potential direction:

* business analyst game
* statistics detective game
* data decision simulator
* shop/company case study
* evidence-based analysis game
* interactive learning scenario

The reference projects teach production methods, not final design.

---

## Communication Style with User

The user is non-technical.

When responding:

* explain simply
* avoid unnecessary jargon
* choose the technical path yourself
* do not ask the user to choose between technical tools unless necessary
* recommend the safest next step
* say what you are doing and why
* avoid overwhelming the user with too many options

When uncertain, make a practical recommendation.

---

## Before Deleting Anything

Never delete files immediately.

Before deletion:

1. Audit the file/folder.
2. Explain what it contains.
3. Decide if knowledge was extracted.
4. Decide if it belongs in archive.
5. Produce a deletion/archive plan.
6. Wait for approval.

Reference materials may be removed only after their workflow value has been captured.

---

## Recommended Repository Cleanup Strategy

Phase 1: Audit
Understand all files, projects, assets, prompts, skills, and transcripts.

Phase 2: Extract Knowledge
Create mentor playbook files.

Phase 3: Skill Inventory
List useful skills, duplicated skills, missing skills, and conversion needs.

Phase 4: Reference Archive
Move raw references into a clear archive structure.

Phase 5: Clean Starter
Create a clean game workspace for the future statistics/business game.

Phase 6: Game Design
Define the actual game concept, learning goals, and visual identity.

Phase 7: Build Prototype
Build a small playable loop first.

---

## First Task for New Codex Sessions

Before major work, read:

`docs/mentor-playbook/AI_GAME_DEV_MENTOR_PLAYBOOK.md`

Then inspect:

* `docs/mentor-playbook/`
* `docs/audit/`
* `docs/plans/`
* available local and global skills

Then plan before coding.

---

## Transcript Extraction Update - 2026-06-04

Four mentor transcripts were processed as workflow references only. They must not be used as references for theme, genre, characters, enemies, combat, story, art direction, or final game identity.

New companion references:

* `docs/mentor-playbook/SKILLS_INVENTORY.md`
* `docs/mentor-playbook/ASSET_PIPELINE.md`
* `docs/mentor-playbook/COMMON_FAILURES_AND_FIXES.md`
* `docs/mentor-playbook/PROMPT_PATTERNS.md`

Key lessons extracted:

* Start with a small playable baseline, not a complete game.
* Use an asset index before integrating art into Phaser.
* Treat AI-generated images and videos as raw material, not game-ready assets.
* Create a stable character anchor before generating animation frames.
* Use image generation for still poses, simple pose sheets, and some non-locomotion animations.
* Use video generation for motion-heavy cycles such as walk, run, crouch, collapse, or other body-motion sequences.
* Convert video outputs into extracted frames and spritesheets; never embed raw video as gameplay animation.
* Normalize every generated spritesheet before game integration.
* Verify frame dimensions, row/column counts, empty frames, foot alignment, and anchor points.
* Use browser testing and screenshots for visual work.
* Improve the workflow after failures by documenting the mistake and strengthening the relevant skill or checklist.
* Save prompts and plans so future sessions can resume without rediscovering decisions.

Important automatic behavior:

* The user should not need to request Phaser, Playwright, sprite, image generation, or asset-pipeline skills.
* For future game work, infer the correct installed skills from the task.
* When a transcript mentions a non-installed or non-Codex skill, document the workflow and convert the idea only if the project needs it.
* Do not duplicate existing global Codex skills; prefer maintained installed skills unless a project-specific workflow must be captured locally.

---

## Final Transcript Extraction Update - 2026-06-04

Three additional mentor transcripts were processed and merged without replacing the earlier playbook. They deepen the workflow in five areas: pixel cleanup, frame recovery, animation curation, full-loop game structure, and sound/polish sequencing.

Additional lessons extracted:

* A neutral anchor is safer than an expressive anchor; temporary effects in the anchor contaminate later animations.
* For pixel-art-like assets, generated images often contain "mixels" rather than true pixels. Pixel snapping can convert blurry pseudo-pixels into cleaner pixel-grid art.
* Use large generated sources, often around 1024x1024 for anchors, because pixel cleanup works better from a high-resolution source.
* A black/white pixel-grid guide can help image models preserve pixel-art-like discipline, but it should not be used for video motion prompts because it can contaminate the video.
* Generated sprite sheets must go through frame recovery: key out the background, crop each pose by bounds, then re-layout frames into a strict grid.
* Animation frames should be curated. Drop redundant frames, sluggish startup frames, or frames with unwanted effects before final packing.
* Walk-cycle videos often produce dozens or hundreds of frames; select one clean loop and reduce it to about 8-12 frames.
* Debug panels can be used for asset variant selection, background/music switching, mute controls, and visual tuning.
* A playable game needs a closed loop: health or scoring, challenge, progression, game over, and a working restart.
* Restart bugs are common in Phaser scenes because state and entities are easy to leave behind. Explicit cleanup/reset behavior must be tested.
* Sound and music are part of game completion, but they should be added after the core loop works.
* Polish should be deliberate: screen shake, hit stop/freeze frames, flashes, particles, and feedback should support game feel without hiding mechanical problems.

Operational update for future sessions:

* Do not start the statistics/business game yet.
* Before design, create a short discovery document that defines the learner, topic, player decision, feedback model, and smallest prototype loop.
* Keep using the reference projects as workflow examples only.
