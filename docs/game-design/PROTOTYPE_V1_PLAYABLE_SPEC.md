# Analyst Triage — Prototype V1 Playable Spec

## 1. Purpose of V1

V1 exists to prove one question:

> Can the player feel like a data analyst inside a company, perform tactile analytical actions, detect a misleading performance indicator, and make a recommendation with visible consequences?

V1 must not attempt to build the whole game.

## 2. V1 Duration

Target playtime: 6-8 minutes.

## 3. V1 Scope

### Must include

- small company entry/lobby or simple office hub;
- Sales interaction;
- HR interaction;
- Analyst Office;
- two sales teams;
- meeting timer;
- surface indicator card;
- HR threshold card;
- Scan action;
- Sort action;
- Threshold line;
- Outlier marking;
- Impact test;
- Reward card;
- Training card;
- win consequence;
- fail consequence;
- trust/fairness feedback.

### Must not include

- full company map;
- more than two teams;
- more than one mission;
- long dialogue trees;
- final art assets;
- AI-generated final characters;
- complex inventory;
- save system;
- analytics backend;
- random data generation;
- dashboards;
- tables as main UI;
- formula teaching.

## 4. V1 Opening Flow

### Scene 1: Company Entry

The player appears in a simple professional retail-company office.

On screen:

- meeting timer starts at 07:00;
- message: “Performance decision meeting starts soon.”
- two interactive doors/hotspots: Sales Office and HR Office;
- Analyst Office locked or highlighted as final destination.

### Player action

Move or click to interact with Sales and HR.

### Feedback

- timer begins;
- subtle office motion: ambient NPCs, blinking meeting alert;
- short notification pulse.

## 5. Sales Interaction

Sales Manager gives a short card:

```text
Sales Pressure Card
Initial recommendation: Reward Team A.
Reason: Team A leads the general performance indicator.
Meeting pressure: decision needed soon.
```

Do not reveal yet that the indicator is mean unless the player opens the card in Analyst Office.

### Feedback

- Sales pressure meter appears or pulses;
- Team A recommendation badge appears;
- timer remains active.

## 6. HR Interaction

HR Manager gives a short card:

```text
HR Fairness Card
Fair performance threshold: 85% of target.
A team reward must be defensible against this threshold.
```

This unlocks the threshold line tool.

### Feedback

- threshold tool unlocks;
- fairness meter appears;
- HR icon becomes active.

## 7. Analyst Office Entry

The player enters Analyst Office.

The analysis board shows:

- Team A area;
- Team B area;
- cards panel;
- tools panel;
- meeting timer;
- trust and fairness indicators.

When the player opens Sales Pressure Card, reveal:

```text
General performance indicator = team mean.
Team A: 96%
Team B: 89.5%
```

But do not say this means Team A is wrong or misleading.

## 8. Fixed V1 Data

### Team A

```text
60, 65, 70, 75, 80, 82, 84, 150, 150, 150
```

### Team B

```text
85, 86, 87, 88, 89, 90, 91, 92, 93, 94
```

### Threshold

```text
85%
```

## 9. Team Unit Representation

Each employee is represented by a unit/card/avatar/dot.

V1 may use simple shapes:

- circles for employees;
- short labels only on hover;
- colors or glow for above/below threshold;
- distance as performance position.

Final art is not required.

## 10. Tools

### Scan

Player drags or clicks Scan over a team. Units reveal gradually.

Acceptance:

- data not all visible before scan;
- scan has animation/feedback;
- team units appear one by one or pulse in.

### Sort

Player activates Sort. Units arrange on a horizontal/vertical performance axis.

Acceptance:

- Team A clearly shows wide spread and three far-right/high units;
- Team B clearly shows compact cluster;
- animation makes distribution legible.

### Threshold Line

Player places or toggles 85% threshold line.

Acceptance:

- units above and below threshold become visually distinct;
- Team A visibly has many units below line;
- Team B visibly aligns above line.

### Outlier Mark

Player marks far separated Team A units.

Acceptance:

- marked units get special outline;
- no tool text says “these are the answer”;
- player can mark at least the three high units.

### Impact Test

Player runs test after marking units.

Acceptance:

- mean indicator visually reacts or shifts;
- team body/median marker becomes easier to see;
- no final recommendation is given.

## 11. Recommendation System

Cards available:

- Reward
- Training

Player must assign one card to each team.

Correct V1 outcome:

- Reward Team B.
- Training Team A.

Wrong V1 outcome:

- Reward Team A.
- Training Team B.

V1 does not need review/investigate cards yet.

## 12. Win Feedback

When player makes correct recommendation:

- Team B celebrates as a whole group;
- Team A training starts;
- weak Team A units move slightly toward threshold;
- HR fairness indicator rises;
- management trust rises;
- Sales Manager reacts with surprise but accepts;
- short after-action message:

```text
The recommendation held because it considered the team body, not only the headline number.
```

Do not say “Correct”.

## 13. Fail Feedback

When player rewards Team A because of mean only:

- three Team A high units celebrate;
- seven Team A low units show objection/confusion;
- Team B morale drops;
- HR opens objection;
- fairness drops;
- trust drops;
- short after-action message:

```text
The decision did not hold under the performance distribution.
```

Do not say “Wrong”.

## 14. Minimum UI

V1 UI can be simple but must be game-like.

Allowed:

- timer;
- compact cards;
- simple meters;
- tool buttons with animation;
- draggable line/card interactions.

Avoid:

- large tables;
- dense dashboard panels;
- long text blocks;
- formula panels;
- static report pages.

## 15. V1 Success Criteria

V1 is successful if:

- player performs multiple actions before decision;
- distribution is visible without a table;
- relying on mean alone creates visible failure;
- correct recommendation creates visible improvement;
- player feels pressure from meeting timer;
- the experience feels like gameplay, not reading a case.

## 16. V1 Failure Criteria

V1 fails if:

- player simply reads numbers and chooses A/B;
- tools reveal the answer directly;
- all important information is in text;
- feedback is only a message;
- there is no movement or world reaction;
- the office movement is longer than the analysis gameplay;
- the timer is decorative and irrelevant.

