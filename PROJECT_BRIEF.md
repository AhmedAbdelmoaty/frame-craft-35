# MADAR Analyst Slice - Project Brief

This is the compact product source of truth for Lovable and Codex.

For execution style, workflow rules, asset pitfalls, and agent behavior, also read `AGENT_PLAYBOOK.md`.

## Product Goal

MADAR Analyst Slice is an Arabic-first browser game that teaches descriptive statistics through a business decision. It must feel like a game before it feels like a lesson.

The audience is non-technical learners, data analysts, business analysts, HR, finance, managers, and decision makers.

The player should move through a company, collect evidence, inspect reports, talk to stakeholders, make a recommendation, and see consequences.

Do not make the experience quiz-first, lecture-first, dashboard-first, or Excel-like.

## Current Stack

- Vite
- TypeScript
- Phaser
- DOM-based HUD
- Runtime assets under `public/assets`

Run locally:

```bash
npm install
npm run dev
```

Build/check:

```bash
npm run check
```

## Current Playable Slice

The player is a data analyst inside `Madar Distribution`, a fictional B2B distribution company.

The current case is based on the `Misunderstanding Statistics` section from the presentation `Why Analysis Fails - HR.pdf`.

The business problem:

- Sales and HR must evaluate two sales team leaders.
- Each team has 10 sales representatives.
- Each representative has a monthly target of 100K.
- HR defines good performance as at least 85% of target.
- The player must recommend what to do with each team.

## Case Data

Team A representative achievement:

```text
60, 65, 70, 75, 80, 82, 84, 150, 150, 150
```

Team B representative achievement:

```text
85, 86, 87, 88, 89, 90, 91, 92, 93, 94
```

Presentation note: one summary slide says Team A is 960K / 96%, while the detailed representative values sum to 966K / 96.6%. The game should use the detailed representative values because they are the evidence the player inspects.

## Statistical Lesson

Team A looks better if the player only checks the average. Team A has a higher mean because three representatives achieved 150%.

The deeper evidence shows Team B is the healthier team:

- Team A: 3 out of 10 representatives meet the 85% threshold.
- Team B: 10 out of 10 representatives meet the 85% threshold.
- Team A is volatile and unfair to reward as a whole team.
- Team B is stable and should be recognized.

Correct recommendation:

- Team A: training, coaching, or process review.
- Team B: reward or recognition.

Surface/wrong recommendation:

- Reward Team A only because its average is higher.

## Game Flow

1. Start at reception and receive the business task.
2. Go to the analyst desk and open the summary report.
3. Go to HR and learn the 85% rule.
4. Go to Sales and inspect representative cards.
5. Mark or notice who is below threshold, meeting threshold, or exceptional.
6. Go to the decision room.
7. Submit one action for Team A and one action for Team B.
8. See consequence feedback.

The game should not reveal early that the mean is misleading. The player should discover the issue by inspecting evidence.

## Current Implementation State

The prototype already has:

- a Phaser office map;
- a visible player avatar;
- rooms/stations: reception, analyst desk, sales, HR, decision room;
- runtime SVG placeholder assets;
- a DOM HUD;
- an evidence notebook;
- mission flow guidance;
- decision evaluation with strong, surface, and mixed outcomes.

The next priority is not more art. The next priority is clearer game logic and player guidance.

## Design Rules

- Arabic-first player-facing text.
- Game-first interaction before explanation.
- No early spoiler about averages.
- No direct copying from old reference projects.
- Keep UI clear enough for a non-technical learner.
- Prefer short business feedback over long statistical lectures.
- Use consequences instead of only correct/incorrect.

## Agent Instructions

Lovable should read only this file, `AGENT_PLAYBOOK.md`, `README.md`, `package.json`, and the relevant `src/` files before working.

Codex can also use `.codex/skills` for project-specific workflow routing.

When working on assets later, generated images are raw material until cleaned, normalized, indexed, and tested.

## Lovable Starter Prompt

```text
You are continuing the MADAR Analyst Slice project.

Read only these first:
1. README.md
2. PROJECT_BRIEF.md
3. AGENT_PLAYBOOK.md
4. package.json
5. src/data/salesCase.ts
6. src/game/simulation.ts
7. src/ui/hud.ts
8. src/scenes/OfficeScene.ts

This is a Vite + Phaser Arabic-first browser game, not a quiz or dashboard.

The game teaches the “Misunderstanding Statistics” case from the presentation I will upload:
Why Analysis Fails - HR.pdf

The player is a data analyst inside Madar Distribution. The first case is evaluating Team A vs Team B sales performance.

Important:
- Do not reveal early that the mean is misleading.
- The player should collect evidence, inspect reports, learn HR policy, inspect representative cards, then submit a recommendation.
- Correct recommendation: Team B reward, Team A training/coaching.
- Wrong/surface recommendation: reward Team A just because its average is higher.
- The next priority is improving game logic and player clarity, not generating more assets.
- Keep the experience game-first: movement, evidence, decisions, consequences.
- Avoid quiz-first, lecture-first, dashboard-first, or Excel-like gameplay.

To run:
npm install
npm run dev
```
