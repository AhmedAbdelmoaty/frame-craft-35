# Animated Spritesheet Workflow

## Core Rule

Do not assume generated animation sheets are game-ready. Recover, curate, normalize, index, and test them.

## Target Animations For This Game

Likely non-combat animations:

* idle
* walk
* talk
* thinking
* point/explain
* interact
* success
* failure
* confusion
* submit/report
* compare/inspect

## Idle

Use simple, subtle motion.

Workflow:

1. Start from the neutral anchor.
2. Prefer deterministic pixel/image editing for tiny breathing or blinking if possible.
3. If generated, use a pose sheet with fixed intended cells.
4. Recover frames.
5. Normalize and test loop.

## Walk

Use video-to-spritesheet when natural leg motion matters.

Workflow:

1. Use one directional anchor only.
2. Prompt for in-place walking.
3. Keep camera fixed and character fully inside frame.
4. Do not provide pixel-grid guides to video models.
5. Extract frames.
6. Pick one clean loop.
7. Reduce to about 8-12 frames.
8. Normalize foot/body anchor.
9. Test in-game.

## Talk

Talk animation can be simple.

Workflow:

1. Use neutral anchor.
2. Generate or edit small mouth/head/hand changes.
3. Keep body stable.
4. Avoid large frame-to-frame pose changes.
5. Normalize and preview beside dialog UI.

## Thinking

Thinking animations should communicate reflection without clutter.

Workflow:

1. Use a neutral or slight hand-to-chin pose.
2. Avoid permanent thought bubbles in the sprite if UI will handle feedback.
3. Keep loop short and readable.
4. Normalize body and feet.

## Point / Explain

Use for tutorials, feedback, or data explanations.

Workflow:

1. Generate a clear pointing pose or short gesture.
2. Avoid including actual chart text in the sprite.
3. Keep arm/tool extension inside padded frame.
4. Normalize around body height, not total arm extension.

## Interact

Use for clicking, inspecting, picking up reports, or operating terminals.

Workflow:

1. Define the object interaction.
2. Generate a short pose sheet.
3. Curate frames so the action reads quickly.
4. Align body and feet.
5. Test with the target prop or UI.

## Success / Failure

Use for feedback moments.

Workflow:

1. Keep expressions readable.
2. Avoid excessive effects baked into the character.
3. Let UI/particles handle external feedback when possible.
4. Normalize and test in context.

## Required Processing

For every spritesheet:

1. Frame recovery: do not rely on naive grid crops from generated pose boards.
2. Frame curation: remove redundant, broken, or sluggish frames.
3. Normalization: fixed cell size, stable scale, stable foot/body alignment.
4. Transparency: true alpha or cleaned chroma key.
5. Metadata: exact frame width, height, count, frame rate, and animation name.
6. Asset index update.
7. Visual test in browser or preview scene.

## Quality Risks

Watch for:

* frame bleeding
* frame drift
* wrong frame width
* wrong frame height
* fake transparency
* character identity changes
* body scale changes
* feet sliding
* row or column miscounts
