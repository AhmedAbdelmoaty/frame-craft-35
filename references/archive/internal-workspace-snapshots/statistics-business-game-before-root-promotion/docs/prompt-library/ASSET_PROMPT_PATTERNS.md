# Asset Prompt Patterns

## Rule

These are reusable prompt shapes. Replace bracketed text with the actual game need.

Do not use pirate, wizard, fantasy, combat, or tactics examples as final direction. Those are reference-project styles and should not be copied.

## Character Anchor

```text
Create a clean neutral character anchor for a 2D educational/business game.

Role: [ROLE]
Personality: [CALM / CURIOUS / CONFIDENT / HELPFUL]
Use: future animation and spritesheet generation.

Requirements:
- full body visible
- neutral standing pose
- readable silhouette
- no temporary effects
- no weapons
- no motion blur
- simple clean background or chroma background
- consistent proportions
- suitable for later animation
```

## Full Body Business Character

```text
Create a full-body business/office character for a statistics/business learning game.

Character role: [ANALYST / MANAGER / CUSTOMER / OWNER / COACH]
Visual tone: approachable, readable, professional, not generic.
Pose: neutral standing pose.

Avoid fantasy, combat, pirate, wizard, enemy, or adventure-game styling.
Use a clean chroma background for later removal.
```

## Isometric Character

```text
Using this character anchor as the identity reference, create an isometric game-ready version.

Facing: [NORTH / EAST / SOUTH / WEST]
Preserve identity, clothing, proportions, silhouette, and readable face.
Use a consistent isometric camera angle.
Keep feet clearly visible and aligned.
Use a flat chroma background.
```

## Sprite-Ready Character

```text
Create a sprite-ready character image from this anchor.

Keep the character centered, full body visible, readable at small size, and on a clean removable background.
Preserve identity exactly.
Do not add props, effects, labels, text, or scene background.
```

## Background

```text
Create a background candidate for a statistics/business learning game.

Setting: [OFFICE / SHOP / CLASSROOM / DATA LAB / WAREHOUSE / BOARDROOM]
Purpose: [GAMEPLAY AREA / MENU / DIALOG SCENE / DECISION SCREEN]

Requirements:
- leave clear space for characters and UI
- not too visually busy
- no copied reference-project style
- cohesive lighting and perspective
- suitable for a browser game
```

## Prop

```text
Create a single game prop for a statistics/business learning game.

Prop: [PROP NAME]
Purpose: [WHY IT EXISTS IN GAME]

Requirements:
- isolated object
- readable silhouette
- no text unless explicitly required
- clean chroma or transparent background
- consistent perspective with the target scene
```

## UI Element

```text
Create a clean UI asset for a business/statistics learning game.

Element: [BUTTON / CARD / BADGE / ICON / PANEL / PROGRESS MARKER]
Mood: clear, practical, friendly.

Requirements:
- simple shape
- readable at small sizes
- no embedded text unless required
- transparent or clean background
- consistent with a modern educational game interface
```

## Animation Pose Sheet

```text
Using this neutral character anchor, create an animation pose sheet for [ANIMATION].

Animation purpose: [IDLE / TALK / THINKING / POINT / INTERACT / SUCCESS / FAILURE]
Frame count target: [NUMBER]

Requirements:
- preserve identity across all frames
- keep body scale consistent
- use a clean chroma background
- leave enough padding for gestures
- no unrelated props or effects
- readable game animation poses
```

## Video-To-Walk-Cycle Prompt

```text
Animate this single character into an in-place walk cycle.

Preserve the exact identity, proportions, clothing, palette, and silhouette.
Keep the character centered.
Keep the camera fixed.
The character must not translate across the frame.
The character must remain fully inside the frame.
Use small readable steps with alternating legs.
No scene, no extra props, no text, no effects, no camera movement.

This video will be used only to extract frames for a spritesheet.
```

## Forbidden Example Reminder

Do not prompt for pirate, wizard, skeleton, fantasy, combat, or tactics-style content unless the user explicitly asks for that style. The reference projects teach workflow only.
