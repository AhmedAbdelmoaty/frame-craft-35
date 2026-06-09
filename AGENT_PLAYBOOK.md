# MADAR Agent Playbook

This is the compact execution memory for Codex and Lovable. Use it with `PROJECT_BRIEF.md`.

## How The Agent Should Work

The user is non-technical. The agent must lead the technical workflow.

Do:

- infer the real task from plain-language prompts;
- choose the right workflow or skill automatically;
- explain decisions simply;
- keep steps small and reversible;
- verify before saying work is done;
- challenge weak prompts when they would hurt the game;
- preserve compact useful project memory.

Do not:

- ask the user to choose engines, tools, frame sizes, or asset pipelines;
- build large systems in one shot;
- copy old reference-project style, story, genre, characters, combat, or identity;
- scan irrelevant files when the brief gives enough context;
- create more docs unless the knowledge cannot fit here or in `PROJECT_BRIEF.md`.

## Automatic Workflow Choice

Choose automatically:

- Phaser/gameplay: use the existing Vite + Phaser structure in `src/`.
- UI/HUD: use DOM HUD patterns in `src/ui/hud.ts` and CSS in `src/styles.css`.
- Visual behavior: verify with browser/build checks when visual behavior matters.
- Still assets: generate a neutral anchor first, then cleanup and index.
- Spritesheets: start from an approved anchor, recover frames, normalize, then preview.
- 3D: only use Three/R3F if the product direction explicitly moves there.
- Skills: keep `.codex/skills` small; do not duplicate global skills.

## Task Readiness Checklist

Before starting, classify the task:

- gameplay;
- UI/HUD;
- asset;
- animated spritesheet;
- testing/debugging;
- documentation;
- project organization.

Then decide:

- What is the smallest useful step?
- Which files are actually relevant?
- Does this need a plan?
- Does this affect runtime behavior?
- Does this need visual/browser verification?
- Does `assets/ASSET_INDEX.md` need updating?

Done means:

- requested scope is handled;
- unrelated files were not touched;
- verification ran, or the limitation is stated;
- next step is clear.

## Game Design Rules

MADAR must feel like a game first.

Preserve:

- Arabic-first player-facing text;
- movement, rooms, evidence, decisions, feedback, consequences;
- mature business realism for analysts, managers, HR, finance, and decision makers;
- short feedback that teaches through consequences;
- discovery before terminology.

Avoid:

- quiz-first loops;
- lecture-first explanations;
- dashboard-only or Excel-like screens;
- early spoilers about averages;
- long dialogues before the player acts;
- more assets before the current game logic is clear.

## Current Case Logic

The first case is `Misunderstanding Statistics`.

Player journey:

1. Receive task at reception.
2. Open the summary report at the analyst desk.
3. Learn the 85% HR threshold.
4. Inspect sales representative cards.
5. Notice Team A is carried by three extreme performers.
6. Notice Team B is consistently above threshold.
7. Recommend training/coaching Team A and rewarding Team B.
8. See consequence feedback.

Strong decision:

- Team A: training/coaching/process review.
- Team B: reward/recognition.

Surface decision:

- Reward Team A only because average performance is higher.

## Asset Generation Rules

Generated assets are raw material until cleaned, normalized, indexed, and tested.

For character anchors:

- use a neutral full-body pose;
- keep hands and feet visible;
- avoid text, logos, props, and baked shadows;
- use clean background or removable chroma;
- preserve mature professional business style;
- avoid childish cartoon tone unless explicitly approved.

For spritesheets:

- do not generate every frame independently if identity consistency matters;
- do not trust naive grid slicing;
- recover frames/components first;
- check exact frame width, height, count, row/column bleed, cropped limbs, and baseline drift;
- create a preview before accepting;
- keep candidate status until the user visually approves.

Common asset failures to avoid:

- fake transparency checkerboard;
- halos/fringes after background removal;
- cropped feet or hands;
- inconsistent face/outfit between frames;
- sliding feet;
- duplicated or warped limbs;
- wrong accessory side;
- unreadable silhouettes.

## Reference Lessons Without Reference Files

Old references taught process only. The project must not copy their identity.

Extracted lessons:

- start from a tiny playable loop;
- keep game rules separate from rendering;
- keep dense HUD text in DOM;
- make prompts short, constrained, and purpose-specific;
- generate anchors before turnarounds and animations;
- test visuals in-game, not only as image files;
- keep asset metadata current;
- document only decisions future agents need.

Forbidden copying:

- visual style;
- genre;
- story;
- characters;
- enemies;
- combat systems;
- pirate/fantasy/tactics/pixel-art identity.

## Lovable/Codex Handoff

Lovable should read:

1. `README.md`
2. `PROJECT_BRIEF.md`
3. `AGENT_PLAYBOOK.md`
4. `package.json`
5. relevant `src/` files

Codex should also use `.codex/skills` when helpful.

Keep context small. If a future agent needs old history, inspect Git history intentionally instead of restoring bulky references.
