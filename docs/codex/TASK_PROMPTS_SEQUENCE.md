# Analyst Triage — Task Prompts Sequence

Use these prompts one at a time. Do not skip ahead.

## Task 0 — Confirm Package Installed

```text
Read AGENTS.md and docs/PROJECT_KNOWLEDGE_INDEX.md only.
Confirm the Analyst Triage package files exist:
- docs/game-design/ANALYST_TRIAGE_MASTER_BLUEPRINT.md
- docs/game-design/PROTOTYPE_V1_PLAYABLE_SPEC.md
- docs/game-design/FEEDBACK_ANIMATION_RULEBOOK.md
- docs/game-design/DEVELOPMENT_ROADMAP_V1_TO_FULL.md
- docs/game-design/MISSIONS_PROGRESSION.md
- docs/codex/CODEX_EXECUTION_MANUAL.md
- docs/codex/TASK_PROMPTS_SEQUENCE.md
- docs/codex/NO_GO_AND_ACCEPTANCE_CRITERIA.md
- docs/codex/CREDIT_SAVER_RULES.md
Do not edit anything.
Report missing files only.
```

## Task 1 — Prototype Foundation Shell

```text
Use .codex/skills/analyst-triage-prototype-task.
Read only:
- AGENTS.md
- docs/game-design/PROTOTYPE_V1_PLAYABLE_SPEC.md
- docs/game-design/FEEDBACK_ANIMATION_RULEBOOK.md
- docs/codex/NO_GO_AND_ACCEPTANCE_CRITERIA.md
- relevant existing src files

Goal:
Build only the V1 foundation shell: simple company context with Lobby/Entry, Sales Office hotspot, HR Office hotspot, Analyst Office hotspot, visible meeting timer, and placeholder player movement or navigation.

Do not implement analysis tools yet.
Do not create assets.
Use simple placeholders.
Do not touch references or assets.

Done when:
- player can reach or select the three places;
- meeting timer is visible;
- screen feels like a company context, not dashboard;
- no gameplay analysis tools yet.

Validation:
Run only the minimum app check needed for runtime changes.
```

## Task 2 — Sales and HR Interactions

```text
Use .codex/skills/analyst-triage-prototype-task.
Read only the V1 spec and relevant src files.

Goal:
Add short Sales and HR interactions.

Sales gives:
- Sales Pressure Card
- initial recommendation: Team A
- reason: Team A leads general performance indicator

HR gives:
- HR Fairness Card
- threshold rule: 85% of target
- unlocks threshold tool later

Do not add long dialogue.
Do not reveal the statistical solution.
Do not implement analysis board yet.

Done when:
- player receives both cards;
- cards are short and game-object-like;
- Sales creates pressure;
- HR creates fairness constraint.
```

## Task 3 — Analyst Office Board

```text
Use .codex/skills/analyst-triage-prototype-task.

Goal:
Add Analyst Office analysis board with Team A and Team B placeholders, card panel, tools panel, trust/fairness indicators, and meeting timer continuity.

Data must be hardcoded for V1:
Team A: 60,65,70,75,80,82,84,150,150,150
Team B: 85,86,87,88,89,90,91,92,93,94
Threshold: 85

At this stage, show teams as hidden/dimmed units. Do not implement full tools yet.

Done when:
- both teams exist as units, not a table;
- indicators can be revealed from the Sales card;
- no answer is revealed.
```

## Task 4 — Scan and Sort

```text
Use .codex/skills/analyst-triage-prototype-task and .codex/skills/gameplay-feedback-review.

Goal:
Implement Scan and Sort actions.

Scan:
- reveals units gradually.

Sort:
- arranges units by performance value.

Feedback required:
- reveal animation/pulse;
- movement to distribution positions;
- Team A spread visibly wide;
- Team B visibly compact.

Do not add threshold/outlier/impact yet.

Done when:
- player can scan both teams;
- player can sort both teams;
- distribution is legible without a table.
```

## Task 5 — Threshold Line

```text
Use .codex/skills/analyst-triage-prototype-task.

Goal:
Add HR threshold line tool at 85%.

Behavior:
- unlocked only after HR card is collected;
- line appears in Analyst Office;
- units above/below threshold get different visual states.

Do not reveal final answer.

Done when:
- Team A visibly has many units below threshold;
- Team B visibly aligns above threshold;
- feedback is visual, not explanatory lecture.
```

## Task 6 — Outlier Mark and Impact Test

```text
Use .codex/skills/analyst-triage-prototype-task and .codex/skills/gameplay-feedback-review.

Goal:
Add outlier marking and impact test.

Player can mark unusually high Team A units.
Impact Test shows metric sensitivity by pulsing/shifting the mean indicator and showing a team body/center marker.

Do not say “these are outliers, choose Team B”.
Do not auto-solve.

Done when:
- player can mark the three high Team A units;
- impact test creates visible feedback;
- tool reveals sensitivity, not final recommendation.
```

## Task 7 — Recommendations and Consequences

```text
Use .codex/skills/analyst-triage-prototype-task and .codex/skills/gameplay-feedback-review.

Goal:
Add Reward and Training recommendation cards and outcome evaluation.

Correct:
- Reward Team B
- Train Team A

Correct feedback:
- Team B group celebration
- Team A training improvement motion
- HR fairness rises
- trust rises

Wrong feedback:
- only Team A high units celebrate
- Team A body objects
- Team B morale drops
- HR objection opens
- trust/fairness fall

Do not show “Correct/Wrong”.

Done when:
- recommendation changes world state;
- outcomes are visually different;
- player can understand consequence without long explanation.
```

## Task 8 — V1 Polish Pass

```text
Use .codex/skills/gameplay-feedback-review.

Goal:
Improve feel without adding new systems.

Focus only on:
- clearer animation timing;
- stronger action feedback;
- less text;
- better pressure from timer;
- clearer win/fail consequence.

Do not add Mission 2.
Do not add final assets.
Do not expand map.

Done when:
- every core action has feedback;
- no screen feels like a dashboard;
- player action occurs every 10-20 seconds.
```

## Task 9 — Mission 2 Only After V1 Approval

```text
Do not run this task until user explicitly approves V1.

Goal:
Add Mission 2: Mean is sometimes useful.

Read:
- docs/game-design/MISSIONS_PROGRESSION.md

Add only one new mission.
Do not add all future missions.
```

