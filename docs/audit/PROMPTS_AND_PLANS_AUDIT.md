# Prompts And Plans Audit

## Purpose

This audit identifies which reference prompts and plans are useful for future work.

## Highest-Value Prompt Sources

### references/imported-projects/Another Project1

Best for:

* south anchor
* pixel snap
* directional anchors
* action spritesheets
* frame recovery
* walk cycle image-to-video
* per-frame snap
* runtime normalization and alignment

Main lesson:

* generated pose boards should not be naively grid-cropped
* recover foreground components first, then normalize

### references/imported-projects/Another Project2

Best for:

* box art exploration
* south anchor
* neutral anchor cleanup
* directional anchors
* walk cycle via image-to-video
* attack and idle sheets
* normalization

Main lesson:

* character asset generation should be a staged pipeline, not a single prompt

### references/imported-projects/Another Project3

Best for:

* isometric full-body anchor
* cardinal directions first
* diagonals second
* normalization of 8-way turntable frames
* reproducible experiment records

Main lesson:

* isometric consistency improves when generated in stages with plan/prompt/learning records

### references/imported-projects/Another Project4

Best for:

* starter-pack workflow
* choosing 2D vs 3D lanes
* asset index prompts
* Phaser implementation plans
* Playwright/browser testing ideas
* broad skill ecosystem

Main lesson:

* open the workspace where shared skills are visible, build small, and use asset indexes early

## Prompts Already Converted Into Project Patterns

The following patterns have already been turned into project docs:

* character anchor
* business character
* isometric character
* sprite-ready character
* background
* prop
* UI element
* animation pose sheet
* video-to-walk-cycle
* frame recovery
* frame curation
* close the loop
* restart bug
* audio generation
* polish

## Remaining Prompt Work Later

After the game concept is known, create project-specific prompt templates for:

* the chosen statistics/business topic
* chosen art direction
* recurring characters
* recurring UI assets
* learning feedback moments
* asset index update prompts

Do not create those yet because the game identity is not defined.
