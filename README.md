# MADAR Analyst Slice

Arabic-first Vite + Phaser prototype for a statistics/business learning game.

Read first:

1. `PROJECT_BRIEF.md`
2. `package.json`
3. `src/data/salesCase.ts`
4. `src/game/simulation.ts`
5. `src/ui/hud.ts`
6. `src/scenes/OfficeScene.ts`

## What This Is

The player is a data analyst inside Madar Distribution. The first playable slice teaches the `Misunderstanding Statistics` case from `Why Analysis Fails - HR.pdf`.

The player collects evidence, learns the HR performance rule, inspects two sales teams, submits a recommendation, and sees consequences.

Correct case interpretation:

- Team A has the higher average but only 3/10 reps meet the 85% threshold.
- Team B has the lower average but 10/10 reps meet the 85% threshold.
- Strong recommendation: train/coach Team A and reward Team B.

## Rules

- Game-first, not quiz-first.
- Arabic-first player-facing text.
- Do not reveal early that the mean is misleading.
- Do not copy old reference projects.
- Next priority: improve game logic and player clarity before more assets.

## Run

```bash
npm install
npm run dev
```

## Check

```bash
npm run check
```

## Notes For Lovable

This is a Vite app. Preview route is `/`.

If Lovable preview does not show the game, switch to the latest version/commit and run:

```bash
npm install
npm run dev
```
