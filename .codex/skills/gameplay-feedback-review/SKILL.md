# Gameplay Feedback Review Skill

## When to use

Use this skill when reviewing or improving Analyst Triage feel, animation, action feedback, outcome feedback, or game-likeness.

## Review question

For each player action, ask:

> What does the player do, and how does the world visibly respond?

## Required checklist

Check every relevant action:

- entering company;
- receiving Sales card;
- receiving HR card;
- entering Analyst Office;
- scan;
- sort;
- threshold;
- outlier mark;
- impact test;
- recommendation;
- correct outcome;
- wrong outcome.

## Feedback types

At least one must exist per action:

- visual change;
- movement;
- meter change;
- card state change;
- NPC reaction;
- team behavior;
- sound cue;
- unlocked tool.

## Failure signs

Flag if:

- action has only text feedback;
- player waits too long;
- screen looks like dashboard;
- outcome is only a toast/message;
- tools reveal the answer;
- NPC explains the solution;
- there is no visible consequence.

## Output format

Return:

```text
Strong feedback:
Weak feedback:
Missing feedback:
Recommended fixes:
Do not change:
```

Keep fixes scoped and actionable.

