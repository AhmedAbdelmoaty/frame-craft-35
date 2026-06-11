# Asset Pipeline

## Core Rule

AI-generated assets are raw material. They must be inspected, cleaned, normalized, indexed, and tested before they are treated as game-ready.

## Standard Asset Flow

1. Define the asset purpose.
2. Gather or generate references.
3. Pick one strong anchor image.
4. Generate required poses, directions, or motion sources.
5. Remove or key out the background.
6. Normalize frame size, spacing, scale, and foot/body alignment.
7. Export final spritesheets or images.
8. Update the asset index.
9. Test in-game with screenshots.

## Asset Index

Create or maintain a canonical asset index, commonly:

* `public/assets/index.json`
* `public/assets/assets.json`
* another project-specific equivalent

The index should include:

* file path
* image width and height
* frame width and height
* rows and columns
* animation names
* frame ranges
* frame rate
* anchor point or origin
* collision bounds if known
* notes about empty frames or padding

The purpose is to stop the AI agent from repeatedly guessing asset dimensions.

## Character Anchor Workflow

The anchor is the stable identity frame for a character.

Good anchors are:

* readable at target size
* front/side/isometric as needed by the game
* free of temporary effects
* consistent with the desired final art direction
* suitable for generating other poses

Use the anchor for all future character frames. If the anchor changes, regenerate or re-normalize dependent animation assets.

## Image Generation Uses

Use image generation for:

* character anchor frames
* still poses
* props
* icons
* simple idle frames
* pose references
* isometric facing sheets
* environmental mockups

Avoid image generation alone for difficult locomotion unless the motion is very simple.

## Video Generation Uses

Use video generation for:

* walk cycles
* run cycles
* crouch motion
* death/collapse motion
* complex body motion
* animations where limbs must change consistently over time

Video outputs must be converted into game assets:

1. Generate motion from the anchor.
2. Review the video.
3. Extract useful frames.
4. Choose a clean loop or sequence.
5. Normalize frames.
6. Export a spritesheet.
7. Test the animation in-game.

Never embed raw video as gameplay animation.

## Simple Animation Without Image Generation

For very simple animations, prefer deterministic image processing:

* idle breathing
* hover/bob motion
* small squash/stretch
* blinking if source pixels are clear

These can often be created by scripts that shift, scale, or edit pixels from the anchor. This can preserve identity better than generating every frame independently.

## Spritesheet Normalization

Normalize before integration:

* equal frame cell size
* equal frame spacing
* consistent character scale
* stable foot baseline
* stable body center
* enough padding for weapons or gestures
* no row bleed
* no hidden fake transparency
* correct exported row/column count

For motions with weapons, hands, tools, or effects, normalize around the character body rather than total pixel height. A raised object should not shrink the body.

## Isometric Asset Workflow

For isometric characters:

1. Start with a source reference or portrait.
2. Generate a full-body anchor.
3. Generate an isometric anchor.
4. Generate cardinal directions first.
5. Generate diagonals second using the anchor plus cardinals.
6. Stitch directions into a sheet.
7. Normalize heights and foot alignment.
8. Key out background.
9. Test direction changes in-game.

Avoid one-shot eight-direction generation when consistency matters.

## Chroma Key Backgrounds

Use solid chroma colors when the generator does not provide true transparency.

Good defaults:

* bright green if the character has little or no green
* bright magenta if green conflicts with the character

Avoid fake checkerboard transparency. It is pixels, not transparency.

## Project Organization

Recommended structure for asset-heavy work:

* `public/assets/` for runtime assets
* `docs/prompts/` for saved prompts
* `docs/plans/` for saved implementation plans
* `docs/mentor-playbook/` for workflow notes
* `tools/` or `scripts/` for reusable asset processing utilities, if needed

Do not add tooling until a repeated asset problem justifies it.

## Final Transcript Additions

### Pixel Snapping

AI-generated pixel-art-like images often contain mixels: blurry clusters that look like pixels from a distance but do not align to a clean pixel grid.

Use pixel snapping when the final game needs crisp pixel art:

1. Generate a large source image, commonly around 1024x1024 for an anchor.
2. Run pixel snapping to collapse blurry color and edge clusters into cleaner pixels.
3. Scale back up with nearest-neighbor scaling.
4. Use the snapped result as the next anchor or animation source.

Do not over-invest in perfect pixel cleanup while the core game idea is still unproven unless crisp pixel art is a requirement.

### Neutral Directional Anchors

Create neutral anchors for every needed facing. Avoid temporary objects, spell effects, weapons, motion blur, or one-off props in the base anchor because they tend to leak into later animations.

For directional characters:

1. Create the main neutral anchor.
2. Generate side/back/facing anchors from it.
3. Clean or pixel-snap each anchor if required.
4. Use each facing anchor as the source for animations in that direction.

### Pixel Grid Guides

A black/white pixel-grid reference can help image generation preserve a blocky pixel-art discipline.

Use it for:

* anchor generation
* directional facing generation
* image-generated pose sheets

Do not use pixel-grid guides for video generation. Video models may blend the guide into the character or motion source.

### Frame Recovery

Generated pose sheets often look organized but are not actually aligned to equal cells.

Frame recovery means:

1. Key out the chroma background.
2. Detect each pose or frame by visible bounds.
3. Crop the character or object from the generated sheet.
4. Clean small background fragments.
5. Re-layout recovered frames into fixed cells.

This prevents frame bleeding and bad Phaser cropping.

### Frame Curation

Do not keep every generated frame automatically.

Drop frames when:

* the first frame duplicates idle and makes the action sluggish
* a frame contains an unwanted effect
* a frame breaks identity or scale
* video output repeats the same motion many times
* the motion loop is already complete with fewer frames

For video-based walk cycles, choose one full clean step loop and distribute about 8-12 frames across it.

### Audio Asset Flow

Add audio after the core game loop works.

Recommended flow:

1. Identify needed music and sound events.
2. Generate multiple music candidates if possible.
3. Generate short sound effects for concrete events.
4. Store music under `public/assets/bgm/` or equivalent.
5. Store sound effects under `public/assets/sfx/` or equivalent.
6. Update the asset index.
7. Add debug controls for mute and variant selection.
8. Test that sounds do not overlap or continue incorrectly after restart/game over.
