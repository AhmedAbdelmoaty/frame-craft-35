# Spritesheet Execution Notes

Use this note before every character animation task.

## Speed And Credit Rules

- Do one animation and one direction at a time.
- Do not generate all directions in one sheet.
- Do not generate idle and walk together.
- Do not run a dev server or full build for asset-only work.
- Use local image previews/GIFs before browser/runtime checks.
- Stop after one failed generation, diagnose the visible failure, then regenerate with a narrower prompt.

## Walk Cycle Rules

- Start with the side direction first because leg motion is easiest to judge.
- Use 8 frames for the first pilot loop.
- Require real walking poses: contact, passing, opposite contact, passing, then loop completion.
- The character should walk calmly like an office professional, not run.
- Arms must swing naturally opposite the legs.
- Identity, clothes, hair, glasses, shoes, and side-specific details must stay stable.
- For the Male Analyst, the watch belongs to the left wrist. Never let a flip place it on the right wrist.

## Processing Rules

- Never accept a generated strip as game-ready.
- Never rely on naive equal-grid cropping from generated strips.
- First recover each visible character frame/component.
- Then normalize every frame into a fixed cell with the same width, height, scale, and foot baseline.
- Create a frame review sheet and a GIF preview before indexing.
- Mark the result as `candidate-review` until the user visually approves it.
- Use `scripts/recover_spritesheet_strip.py` for repeated strip recovery instead of rewriting one-off Python.

## Current Pilot Learning

- The first accepted direction is `walk-left`.
- The raw generated strip needed recovery because its width was not exactly divisible into 8 cells.
- The recovery step prevented cropped feet and should be reused for `walk-right`, `walk-down`, `walk-up`, and later idle frames.
