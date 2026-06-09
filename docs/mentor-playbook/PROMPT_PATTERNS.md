# Prompt Patterns

## Purpose

This file captures reusable prompt shapes from the mentor transcripts. Adapt the workflow, not the game content.

## Asset Index Prompt

Use when assets have been added but are not yet indexed.

```text
Study the assets in public/assets and create a canonical asset index for the game.

Include relevant spritesheets, image dimensions, frame sizes, rows, columns, animation frame ranges, tile sets, props, and notes about empty frames or padding.

The goal is to make future Phaser integration use this index instead of guessing asset structure from the filesystem.
```

## Verify Spritesheet Metadata Prompt

Use when frame ranges or dimensions look suspicious.

```text
Inspect the spritesheet metadata and verify the frame width, frame height, row count, column count, empty frames, and animation frame ranges.

Do not change gameplay. Fix the asset index if the metadata is wrong.
```

## Small Playable Baseline Prompt

Use before building a larger game.

```text
Build the smallest playable baseline first.

Use the relevant Phaser skill. Add one controllable character, idle/move/jump or interact animation as appropriate, basic collision, and debug overlays. Test it in the browser with screenshots before adding more systems.
```

## Visual Replication From Mockup Prompt

Use only for layout/composition learning, not copying reference game identity.

```text
Use the mockup only as a composition reference.

Plan first. Add the background layers, then the ground or interaction surface, then the character, then controls and animation. Reference the asset index for all assets. Verify each stage with a screenshot.
```

## Character Anchor Prompt

Use when creating a first stable character frame.

```text
Create a clean first-frame character anchor for a 2D game.

Preserve the intended identity and readable features. Keep the pose neutral and reusable for future animation. Make it suitable for downscaling to the target frame size. Avoid temporary effects, weapons, or motion blur unless explicitly required.
```

## Pose Sheet Prompt

Use for image-generation pose sheets where motion is not too complex.

```text
Using the provided anchor image, create a fixed-cell pose sheet for the requested animation.

Preserve character identity across every frame. Leave enough padding for the full pose. Keep the character centered consistently. Use a background that can be removed cleanly.
```

## Video Motion Source Prompt

Use for walk, run, crouch, collapse, or other motion-heavy animation.

```text
Using the anchor image as the character identity reference, generate a short motion source for [animation].

The character should perform the motion in place, stay fully inside the frame, preserve identity and proportions, and avoid camera movement. The output will be used only to extract frames for a spritesheet.
```

## Frame Extraction Prompt

Use after receiving a video animation source.

```text
Extract frames from the motion source, select the cleanest continuous sequence, reduce it to a useful frame count, normalize frame size and foot/body alignment, and export a game-ready spritesheet.

Do not embed the video in the game.
```

## Normalization Prompt

Use when generated frames are uneven or scaled incorrectly.

```text
Normalize these frames into a strict spritesheet.

Use fixed-size cells, consistent body scale, stable foot baseline, stable body center, and transparent padding. If a tool, hand, weapon, or effect extends beyond the body, do not shrink the body to fit it; preserve body scale and allow padded space.
```

## Isometric Cardinal Prompt

Use before diagonal direction generation.

```text
Using the anchor as the identity reference, create a four-way isometric facing sheet with north, east, south, and west directions.

Preserve clothing, proportions, lighting, and silhouette. Use a clean removable background. Keep each direction in a fixed cell.
```

## Isometric Diagonal Prompt

Use after cardinal directions exist.

```text
Using the anchor and the four cardinal directions as references, create the four diagonal isometric directions.

Preserve identity and asymmetrical details. Keep the same camera angle, proportions, lighting, and foot position. Use fixed cells and a removable background.
```

## Browser Visual Test Prompt

Use after visual/gameplay changes.

```text
Run the game in a browser and verify visually.

Check that the game loads, there are no console errors, the character is visible, controls work, collisions align, animations play correctly, and the screenshot matches the intended state.
```

## Failure Improvement Prompt

Use after a repeated workflow mistake.

```text
Explain why this mistake happened in the workflow.

Identify whether the issue belongs in asset metadata, normalization, prompting, testing, or a skill checklist. Update the relevant documentation so this mistake is less likely to happen again.
```

## Prompt Logging Prompt

Use before implementation when a plan or asset workflow should be preserved.

```text
Save the important prompts, plan, chosen skills, assumptions, and expected outputs before implementing. Then wait for the next instruction.
```

## Pixel Anchor Prompt

Use when creating pixel-art-like anchors.

```text
Create a large, readable, neutral character anchor for a 2D game.

Use a clean silhouette, simple readable shapes, and a flat chroma background. Avoid temporary effects, weapons, spell effects, motion blur, or action poses. The result will be cleaned, pixel-snapped, and reused as the identity anchor for later animations.
```

## Directional Anchor Prompt

Use after a neutral anchor exists.

```text
Using this neutral anchor as the identity reference, create the same character facing [direction].

Preserve proportions, readable details, clothing, colors, and silhouette. Keep the pose neutral and reusable for future animation. Use a flat chroma background.
```

## Frame Recovery Prompt

Use when a generated pose sheet is not truly aligned.

```text
Recover the individual animation frames from this generated sheet.

Key out the chroma background, detect each visible pose by its bounds, crop the frames cleanly, remove small background fragments, and re-layout the selected frames into a strict fixed-cell spritesheet.
```

## Frame Curation Prompt

Use before final spritesheet export.

```text
Review these generated frames and select only the useful frames for a responsive game animation.

Drop redundant frames, sluggish idle-like startup frames, frames with unwanted effects, and frames that break character identity or scale. Keep the shortest sequence that communicates the motion clearly.
```

## Close The Loop Prompt

Use after baseline movement/interactions work.

```text
Close the playable loop.

Add a simple objective, challenge progression, clear success or failure state, game over or completion feedback, and a reliable restart/back-to-menu flow. Keep the implementation configurable and test a complete round from start to restart.
```

## Restart Bug Prompt

Use when restart leaves stale state.

```text
There is a restart bug. Restart does not reset the full game state.

Clear all spawned entities, reset player state, health, timers, counters, input flags, animations, and progression state. Then test game over followed by restart to verify the scene starts cleanly.
```

## Audio Generation Prompt

Use only after the core loop works.

```text
Add music and sound effects for the existing game loop.

Generate or select a few background music candidates and short sound effects for key events. Store them under public assets, update the asset index, add mute/debug controls, and test that audio behaves correctly across restart and scene transitions.
```

## Polish Prompt

Use after the game loop, restart, and basic audio work.

```text
Add restrained game-feel polish.

Use small screen shake, brief hit stop, flashes, particles, and clear feedback only where they support player understanding. Keep debug toggles where useful and verify the game still reads clearly.
```
