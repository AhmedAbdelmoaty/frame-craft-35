# Task Readiness Checklist

Use this before starting any task.

## 1. Classify The Request

What type of task is it?

* gameplay
* asset
* animated spritesheet
* UI
* testing/debugging
* documentation
* skill/workflow
* project organization

## 2. Choose The Skill Or Workflow

Choose automatically:

* Phaser / Phaser 4 for 2D gameplay.
* Three.js / React Three Fiber for 3D.
* Image generation for still assets.
* Video-to-spritesheet for walk/run/body motion.
* Sprite/asset workflow for cleanup and normalization.
* Browser/playtest workflow for visual behavior.
* Skill planning before creating new skills.

## 3. Decide If A Plan Is Needed

Plan first if:

* more than one file may change
* gameplay behavior will change
* assets need generation and cleanup
* testing is visual or interactive
* a new workflow may be needed

For tiny documentation/file tasks, execute directly.

## 4. Asset Index Need

Ask:

* Are new runtime assets being added?
* Are spritesheets being added or changed?
* Do frame dimensions or animation names need tracking?
* Will gameplay load these assets?

If yes, create or update an asset index.

## 5. Visual Test Need

Use visual testing if:

* the task affects rendering
* animation quality matters
* collision/positioning matters
* UI layout matters
* restart/game-over behavior matters

## 6. Risk Check

Watch for:

* modifying unrelated files
* copying reference styles
* guessing spritesheet dimensions
* skipping background cleanup
* skipping browser verification
* creating duplicate skills
* building too much in one step

## 7. Done Criteria

Before saying done:

* scope matches request
* no forbidden files were touched
* verification ran or limitation is stated
* documentation/prompt/plan is saved when useful
* next step is clear
