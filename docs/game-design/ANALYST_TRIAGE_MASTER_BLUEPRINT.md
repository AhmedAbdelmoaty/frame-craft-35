# Analyst Triage — Master Game Design Blueprint

## 1. Project Identity

**Working title:** Analyst Triage  
**Arabic working title:** المحلل: فرز الأداء  
**Company context:** Retail company  
**Player role:** Data Analyst / Business Performance Analyst  
**Learning domain:** Descriptive Statistics for Data Analysts  
**Primary audience:** senior professionals, managers, analysts, decision makers, HR, sales, finance, operations.

## 2. One-Sentence Game Description

Analyst Triage is a professional game-first decision game where the player, acting as a business performance analyst inside a retail company, must detect when surface performance indicators are useful or misleading and make fair, defensible recommendations under pressure.

## 3. Non-Negotiable Game Direction

This is a **real game first**.

It must not feel like:

- quiz
- course
- lecture
- Excel exercise
- dashboard simulator
- case-study worksheet
- report simulator
- NPC dialogue game
- walking simulator with documents

The player must win by doing analytical actions, not by answering a direct question.

The learning must be hidden inside the gameplay loop. The player should feel:

> “I caught the misleading number before it became a bad business decision.”

## 4. Core Player Fantasy

The player fantasy is:

> I am the sharp analyst inside the company who sees beyond the headline number and saves the business from unfair or weak decisions.

This fantasy is strong for senior professionals because it reflects real workplace pressure: executives want a quick answer, departments push biased interpretations, HR worries about fairness, and the analyst must make a recommendation that survives scrutiny.

## 5. The Company

**Company name:** Madar Retail / مدار ريتيل  
**Business:** consumer electronics and home-tech retail chain.  
**Products:** phones, accessories, screens, small home electronics, seasonal tech bundles.  
**Scale in prototype:** two sales teams / branch teams.  
**Scale in future versions:** multiple branches, teams, product categories, campaigns, regions.

### Current Crisis

The monthly performance meeting is starting soon. A reward/training decision must be made before the meeting. Sales wants to reward the team with the highest surface indicator. HR requires fairness. Operations wants the intervention to improve performance, not just look good on paper.

## 6. Player Role and Authority

The player is a Business Performance Analyst.

### The player can:

- move through a small company space;
- interact briefly with Sales and HR;
- collect short decision constraints;
- enter the analyst office;
- scan teams;
- sort performance units;
- reveal threshold alignment;
- identify spread and distribution shape;
- mark possible outliers;
- run impact tests;
- make recommendations;
- see consequences.

### The player cannot:

- change raw data;
- reward everyone;
- train everyone;
- remove time pressure;
- rely on unlimited analysis;
- bypass fairness consequences;
- ask NPCs for the correct answer.

## 7. Genre

Analyst Triage is an **interactive analytical decision game**.

It combines:

- light movement/exploration inside a company;
- business-pressure decision gameplay;
- tactile data manipulation;
- consequence feedback.

It is not a management sim. It is not a full RPG. It is not a large open office game. Movement and rooms exist to create context and pressure, but the core gameplay is analytical triage.

## 8. Core Game Loop

1. **Receive pressure:** a business decision is about to be made.
2. **Collect constraints:** Sales gives a recommendation pressure; HR gives fairness threshold.
3. **Enter analysis space:** teams appear as living performance units, not tables.
4. **Scan:** reveal the data units gradually.
5. **Sort:** arrange units along performance axis.
6. **Set threshold:** place the accepted-performance line.
7. **Read distribution:** observe spread, center, gaps, and outliers.
8. **Test impact:** inspect how surface indicators respond to exceptional values.
9. **Recommend:** assign reward/training/review.
10. **Watch consequences:** teams respond, HR reacts, company trust changes.
11. **Progress:** next mission adds one new complexity.

## 9. Physical Player Actions Every 10-20 Seconds

The player must regularly do tangible actions:

- click/tap a room door or hotspot;
- receive a short game card;
- move avatar to analyst office;
- drag Scan over a team;
- trigger Sort and watch units arrange;
- drag threshold line onto the performance field;
- hover/select units to inspect values;
- mark potential outliers;
- trigger impact pulse;
- drag recommendation card to a team;
- confirm or revise before the meeting timer ends;
- observe team movement and consequences.

No action should be only “read paragraph then click next”.

## 10. First Playable Mission

### Scenario

Two sales teams are being evaluated. Sales recommends Team A because the general indicator is higher. HR requires that a fair decision consider whether employees meet the 85% performance threshold.

### Hidden truth

Team A has a higher mean because three standout performers pull the average up. Most Team A employees are below the threshold. Team B has a lower mean but a more stable distribution, with most or all employees above threshold.

### Correct recommendation

- Reward Team B.
- Train Team A.

### Wrong recommendation

- Reward Team A just because its surface indicator is higher.
- Train Team B despite its stable threshold performance.

## 11. Statistics Concepts as Gameplay

### Mean

Appears as the surface indicator. It is not always wrong. It is useful when the team distribution is stable and representative.

### Median

Appears as a center/body marker after sorting. It helps the player see whether the mean is aligned with the team body.

### Spread

Appears as visible distance between units. Wide spread means unstable performance; narrow spread means consistency.

### Distribution

Appears as the shape after sorting: clustered, skewed, split, gapped, or stable.

### Outliers

Appear as unusually distant units. They may be real performers, but they may not represent the team.

### Threshold

Appears as a draggable 85% line. It turns business rules into spatial game pressure.

## 12. No Magic Statistics Rule

Tools never reveal the answer.

- Scan reveals units, not interpretation.
- Sort reveals shape, not recommendation.
- Threshold shows who is above/below, not who wins.
- Outlier marking highlights separation, not truth.
- Impact test shows indicator sensitivity, not final decision.

The player must interpret.

## 13. Places in the Prototype

### Lobby / Company Entry

Short opening, timer starts, office atmosphere established.

### Sales Office

Gives sales pressure and the initial recommendation card.

### HR Office

Gives threshold/fairness rule card.

### Analyst Office / Decision Room

Main gameplay space. All analytical actions happen here.

### Outcome Area

Shows team reaction, HR objections, trust/fairness shifts, and decision result.

## 14. Characters in the Prototype

### Player Analyst

Visible avatar controlled by player. Quiet, professional, observant.

### Sales Manager

Pushes for fast reward decision based on the surface indicator.

### HR Manager

Pushes for fairness and threshold-based defensibility.

### Team Units

Represent employees as living data points. They are not full narrative characters in V1.

### Optional Data Coach

Appears only after actions or after outcome. Gives short reflection without solving the task.

## 15. Win Condition

Player wins mission 1 when the final recommendation is:

- reward the team whose performance is stable and threshold-aligned;
- train the team whose headline metric is misleading and whose body needs improvement;
- decision passes HR fairness check;
- trust rises.

## 16. Lose Condition

Player fails when they rely on surface indicator only and make a recommendation that causes:

- unfair reward;
- HR objection;
- lower trust;
- poor resource allocation;
- visible morale drop in the more deserving team.

Do not show “Wrong Answer”. Show world consequences.

## 17. Feedback Principles

Every meaningful player action must create at least one feedback type:

- visual change;
- movement;
- sound cue;
- NPC reaction;
- metric change;
- team behavior;
- unlocked tool;
- new pressure.

No silent button clicks.

## 18. Progression Philosophy

The game should add one new analytical challenge at a time:

1. Mean can mislead when outliers distort it.
2. Mean can be useful when distribution is stable.
3. Spread matters even when means are similar.
4. Median matters when distribution is skewed.
5. Threshold matters for fair decisions.
6. Missing or partial data increases risk.
7. Recommendations become more nuanced: reward, train, review, investigate, wait.

## 19. Design Guardrails

- Do not overbuild the office before the core analytical moment works.
- Do not add many NPC dialogues.
- Do not add large maps.
- Do not add complex economy systems.
- Do not teach formulas directly in gameplay.
- Do not leak the solution before player acts.
- Do not always make the mean wrong.
- Do not make statistics tools reveal the answer.

## 20. Final Design Test

The design is working if a player says:

> “I almost trusted the headline number, then I saw the team shape and changed the decision.”

The design is failing if a player says:

> “I read the case and picked the correct answer.”

