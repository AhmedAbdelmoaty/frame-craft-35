# Asset Generation Workflow

## Core Rule

Generated assets are raw material. They are not game-ready until cleaned, normalized, indexed, and visually checked.

## Character Anchors

Use anchors as the stable identity source for future assets.

Workflow:

1. Define the character role in plain terms.
2. Generate a neutral full-body anchor.
3. Use a chroma background or true transparency if available.
4. Avoid temporary props, motion blur, effects, or action poses.
5. Check readability at target game size.
6. Clean background.
7. Pixel-snap only if crisp pixel art is required.
8. Store as a reference or generated asset.

For this project, likely roles include:

* analyst
* manager
* customer
* business owner
* data coach
* stakeholder
* operations worker
* student learner

## Business And Office Characters

Business characters should be readable, grounded, and non-generic.

Prompt for:

* clear silhouette
* simple professional clothing
* expressive but neutral pose
* no weapons or fantasy props
* clean background
* consistent proportions
* enough detail for role recognition

Avoid:

* copying reference-project characters
* over-stylized fantasy cues
* baked-in charts, effects, or props unless they are permanent identity features

## Props

Props may include:

* notebooks
* charts
* dashboards
* report folders
* calculators
* shop shelves
* product boxes
* office furniture
* data terminals

Workflow:

1. Define the prop's gameplay or teaching purpose.
2. Generate on chroma or transparent background.
3. Keep the silhouette readable.
4. Remove background.
5. Normalize size.
6. Add to asset index when used.

## Backgrounds

Generate multiple background candidates when exploring.

Possible settings for this project:

* office
* classroom
* shop floor
* small business
* dashboard room
* warehouse
* consulting boardroom
* data lab

Rules:

* Do not copy reference-project environments.
* Keep enough clear gameplay/UI space.
* Avoid overly busy scenes behind important text or interactions.
* Save rejected candidates if they teach useful art-direction lessons.

## UI Assets

UI assets should support learning and decision-making.

Useful assets:

* buttons
* cards
* icons
* badges
* chart frames
* dialog panels
* feedback markers
* progress indicators

Rules:

* Prioritize clarity over decoration.
* Keep text out of generated bitmap UI where possible.
* Use consistent dimensions.
* Test readability in the game/browser.

## Isometric References

Use isometric references only if the chosen game design benefits from spatial planning, movement on a grid, or business simulation layouts.

Workflow:

1. Generate a clean anchor.
2. Generate cardinal directions first.
3. Generate diagonals second.
4. Normalize scale and foot alignment.
5. Test direction consistency.

## 2D With 3D-Like Feel

For a 2D game with depth:

* use layered backgrounds
* use shadows under characters
* use consistent perspective
* use parallax lightly
* use UI depth sparingly

Do not jump to 3D unless the learning/gameplay need justifies it.

## Cleanup Rules

Always consider:

* chroma background
* background removal
* neutral anchor
* character consistency
* correct scale
* transparent output
* asset index update
* visual preview
