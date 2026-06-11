# Common Failures And Fixes

## Purpose

This file records workflow failures from the mentor transcripts and how future Codex sessions should respond.

## Wrong Spritesheet Frame Width Or Height

Symptoms:

* character appears duplicated
* part of another row appears in the animation
* animation looks sliced or stretched
* "ghost" artifacts appear beside the character

Fix:

* inspect the source image dimensions
* calculate rows and columns explicitly
* verify empty frames and padding
* update the asset index
* test again with screenshots

Do not keep adjusting game rendering code if the real problem is asset metadata.

## Empty Frames Counted Incorrectly

Symptoms:

* animation starts late
* animation includes blank frames
* attack/run/idle ranges look off

Fix:

* count frames from zero
* identify empty cells
* write exact frame ranges in the asset index
* verify with a preview scene

## Frame Bleeding

Symptoms:

* top or bottom of a neighboring row appears
* animation shows extra pixels from another motion

Fix:

* correct frame height
* add padding or margin if the source supports it
* re-export normalized sheet
* check Phaser loader frame settings

## Character Floats Or Sinks Into Ground

Symptoms:

* feet are above the platform
* character appears embedded in floor
* collision box does not match visible sprite

Fix:

* inspect origin/anchor point
* inspect collision body size and offset
* align foot baseline in normalized frames
* use debug hitboxes
* verify with screenshot after adjustment

## Image Model Changes Character Identity

Symptoms:

* face, clothing, size, or colors change between frames
* character changes gender/body type
* accessories appear/disappear

Fix:

* use a stronger anchor image
* avoid generating each frame independently
* use image generation for pose sheets, not separate calls per frame
* use video generation for motion-heavy animations
* tighten the prompt around preserved identity

## Walk Cycle Legs Do Not Move Correctly

Symptoms:

* legs stay still
* feet slide
* arms move but legs do not
* cycle looks like unrelated poses

Fix:

* prefer video generation for walking/running
* prompt for walking/running in place
* extract frames from one clean loop
* normalize baseline and body center
* test in-game, not only in a static preview

## Generated Frames Are Unevenly Spaced

Symptoms:

* sprite jumps between frames
* Phaser animation crops frames incorrectly
* frames overlap when made into a sheet

Fix:

* split frames into separate images
* normalize into fixed-size cells
* add transparent padding
* export a clean spritesheet

## Raised Object Shrinks The Character

Symptoms:

* character body becomes smaller during attack or gesture
* crouch/death frames scale incorrectly
* weapon or hand changes total frame bounds

Fix:

* normalize around body height, not total object height
* allow weapons/effects to extend into padded space
* align feet/body baseline
* compare against idle anchor

## Fake Transparency

Symptoms:

* checkerboard pattern appears in-game
* background color outlines remain
* sprite has unwanted border pixels

Fix:

* use true alpha if the generator supports it
* otherwise generate against solid chroma green or magenta
* remove chroma background during processing
* inspect edges before integration

## AI Agent Moves Too Fast

Symptoms:

* implements many systems before visual verification
* skips user-visible checkpoints
* fixes one issue while introducing another

Fix:

* force smaller steps
* ask for plan mode for complex work
* verify each stage with screenshot
* add features only after baseline is correct

## Browser Test Gives False Confidence

Symptoms:

* Playwright confirms movement but visual artifact remains
* test checks position but misses animation quality

Fix:

* inspect screenshots directly
* test multiple animation frames
* add visual assertions when possible
* keep manual review of key screenshots for art/animation tasks

## Skill Regression

Symptoms:

* a workflow that used to work starts making a repeated mistake
* asset dimension assumptions become wrong

Fix:

* identify the incorrect assumption
* document it in this file
* update the relevant skill only if needed
* add a checklist item to prevent recurrence

Do not patch only the current output if the root cause is a reusable workflow failure.

## Mixels Instead Of True Pixels

Symptoms:

* art looks blocky from far away but blurry when zoomed in
* scaling creates soft edges
* pixel-art animations look inconsistent

Fix:

* generate from a large source image
* run a pixel-snapping pass
* scale with nearest-neighbor
* use the snapped image as the next anchor

Do not over-optimize this before the game loop is proven unless crisp pixel art is a requirement.

## Polluted Anchor

Symptoms:

* all later animations contain an unwanted weapon, tool, spell, or effect
* walk/idle frames keep a temporary object from the original reference

Fix:

* regenerate a neutral anchor
* remove temporary effects before directional or animation generation
* keep expressive/effect poses for action-specific animations only

## Video Character Leaves Frame

Symptoms:

* jump/run motion exits the video boundary
* extracted frames cut off limbs or body

Fix:

* prompt for in-place motion
* require the character to remain fully inside frame
* avoid passing grid/canvas guides to video generation
* regenerate rather than trying to patch badly cropped motion

## Too Many Redundant Video Frames

Symptoms:

* video export creates dozens or hundreds of frames
* resulting spritesheet is bloated
* animation timing feels slow or muddy

Fix:

* select one clean loop
* reduce to about 8-12 frames for walk/run cycles
* preview the loop before packing the final spritesheet

## Restart Does Not Reset Game State

Symptoms:

* player health remains zero
* enemies from the previous run remain
* no new enemies spawn
* movement or animations stay stopped after restart

Fix:

* clear all spawned entities
* reset player state, health, timers, round counters, and input flags
* stop or restart scene-level timers and tweens
* test game over followed by restart

This is common in Phaser games and should be expected after adding progression or game-over states.

## Game Has Systems But No Closed Loop

Symptoms:

* player can move and interact but there is no win/fail state
* enemies or targets exist but there is no progression
* game never ends or cannot restart cleanly

Fix:

* add a simple objective
* add a clear failure or success condition
* add restart/back-to-menu flow
* test one complete round from start to end

## Audio Leaks Across State Changes

Symptoms:

* music keeps playing after game over or restart
* sound effects overlap excessively
* mute/debug controls do not affect all audio

Fix:

* centralize audio state
* stop or fade music on scene transition when needed
* add mute/debug controls
* test restart and menu transitions
