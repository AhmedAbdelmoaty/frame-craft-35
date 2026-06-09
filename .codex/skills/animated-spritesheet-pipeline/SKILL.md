---
name: animated-spritesheet-pipeline
description: Create, recover, curate, normalize, and validate animated 2D spritesheets for non-combat browser-game characters. Use when the user asks for idle, walk, talk, thinking, pointing, explaining, interacting, success, failure, pose sheets, frame cleanup, frame recovery, animation alignment, or spritesheet QA.
---

# Animated Spritesheet Pipeline

Use this skill for animation sheets. Keep it focused on frame quality, consistency, and in-game usability.

## Workflow

1. Identify the animation: idle, walk, talk, thinking, point/explain, interact, success, failure, or another non-combat action.
2. Start from an approved character anchor when possible.
3. Read `PROJECT_BRIEF.md` and `assets/ASSET_INDEX.md` only as needed.
4. Decide the safest generation route:
   - pose sheet from image generation
   - video-to-frames followed by recovery
   - manual frame curation from candidate images
   - runtime test with temporary placeholders if art is not approved
5. Curate frames before packing.
6. Normalize every frame:
   - same canvas size
   - same pivot/anchor
   - stable feet or body base
   - no frame bleeding
   - no fake transparency
   - no cropped extremities
7. Pack into a fixed-cell spritesheet only after curation.
8. Update `assets/ASSET_INDEX.md` only for current useful candidates.
9. Run a visual/in-game preview before marking ready.

## Common Failure Checks

- Wrong frame size or inconsistent cell dimensions.
- Character drift between frames.
- Feet sliding unintentionally.
- Background color leaking around edges.
- Extra duplicated limbs or warped faces.
- Direction changes mid-animation.
- Sheet looks correct as an image but fails when sliced by code.

## Output Contract

For each spritesheet task, report:

- animation name and purpose
- frame count and frame size
- anchor/pivot rule used
- cleanup steps completed
- preview/test status
