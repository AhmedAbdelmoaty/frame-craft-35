# Game Logic Next Steps

This plan should be used after the user approves moving from concept alignment into gameplay implementation.

## Goal

Turn the current Phaser prototype into a clearer playable learning loop for the `Misunderstanding Statistics` case before investing more time in environments, spritesheets, or final art.

## Phase 1 - Lock The Case Model

Create a clean case model for the sales-team scenario.

The model should include:

- team names;
- representative achievement values;
- business threshold;
- summary metrics;
- detailed distribution metrics;
- recommended business action;
- consequence text.

Derived metrics needed:

- mean;
- median;
- range;
- standard deviation;
- IQR;
- number and percentage of good performers;
- high-outlier count.

Acceptance:

- Team A uses detailed values `60,65,70,75,80,82,84,150,150,150`.
- Team B uses detailed values `85,86,87,88,89,90,91,92,93,94`.
- Team A is marked as a surface-metric trap, not as the healthier team.
- Team B is marked as the stable healthy team.

## Phase 2 - Improve Evidence Gating

The player should not receive all insight at once.

Recommended evidence order:

1. Mission brief.
2. Summary report.
3. HR threshold policy.
4. Representative cards.
5. Distribution / pattern reveal.
6. Decision board.

Acceptance:

- The player can submit a weak early recommendation if they rely only on summary evidence.
- The game does not reveal the statistical lesson in the opening text.
- Representative-level evidence materially changes the player's understanding.

## Phase 3 - Add Player Actions

Add simple game actions that make the statistics tangible.

Recommended actions:

- inspect a report;
- talk to Sales and HR stakeholders;
- flip representative cards;
- mark each representative as below threshold, meeting threshold, or exceptional;
- submit one recommendation per team.

Acceptance:

- The player learns by doing, not by reading a long explanation.
- The threshold marking action makes Team A's weakness visible.
- The game remains understandable for a non-technical learner.

## Phase 4 - Add Consequence Scoring

Replace simple correct/incorrect feedback with business consequences.

Suggested consequence dimensions:

- analysis quality;
- fairness;
- employee trust;
- stakeholder confidence;
- operational stability.

Acceptance:

- Rewarding Team A based only on the mean produces negative feedback around fairness and analysis quality.
- Rewarding Team B and coaching Team A produces strong feedback.
- Mixed decisions produce nuanced feedback, not a hard fail screen.

## Phase 5 - Test The Slice

Add focused tests for the case logic and run browser QA after runtime changes.

Checks:

- metric calculations are correct;
- decision evaluation returns the intended outcome;
- Arabic UI text displays correctly;
- the player can complete the case;
- the playfield and HUD do not overlap on desktop or mobile.

## What Not To Do Yet

Do not continue final environment generation before this logic is stable.

Do not build the whole curriculum at once.

Do not turn the game into a dashboard.

Do not add long formula lessons before the player's first decision.
