# Analyst Triage

This is the root workspace for the new IMP educational game.

The project is no longer a generic `Statistics Business Game` placeholder. The current approved working direction is:

`Analyst Triage`

It is a game-first learning experience about `Descriptive Statistics for Data Analysts`.

The player is a `Data Analyst` / `Business Performance Analyst` inside a retail company. The game focuses on using descriptive statistics to make fair, defensible business recommendations.

Core statistics and analysis ideas:

* mean
* median
* spread
* distribution
* outliers
* threshold
* fair defensible recommendations

## Current Game Direction

Working title: `Analyst Triage`

Core experience:

A data analyst inside a retail company must prevent misleading performance indicators from becoming unfair or weak business decisions.

The experience should teach through player actions, constraints, tradeoffs, feedback, and consequences.

## Not The Game

This project must not become:

* quiz
* course
* case-study worksheet
* static dashboard
* Excel exercise
* report simulator
* walking simulator with files

Files, reports, dashboards, and dialogue can appear only as short game elements that unlock constraints, tools, pressure, or decisions. They are not the core game.

## Reference Material Rule

`references/imported-projects/` contains workflow references only.

Do not copy style, genre, characters, story, mechanics, identity, combat systems, or visual direction from reference projects.

Do not recursively inspect `references/` unless the task explicitly asks for a named workflow lookup.

## Source of Truth Rule

The future source of truth will be Analyst Triage design files under `docs/`.

Until those files are added, `AGENTS.md` and `docs/PROJECT_KNOWLEDGE_INDEX.md` define the current direction. Any older file that conflicts with Analyst Triage is legacy/reference-only.

## Current Structure

```text
src/          game source code when implementation is approved
public/       runtime public files
assets/       asset workspace
docs/         project knowledge, workflows, plans, prompts, and decisions
.codex/skills project-local agent skills
references/   imported workflow references and archived setup snapshots
```

## Commands

```bash
npm run check
npm test
```
