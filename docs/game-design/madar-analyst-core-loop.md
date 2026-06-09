# MADAR Analyst Core Loop

This is the approved design direction to use before building more gameplay or assets.

## Design Target

MADAR is a game-first business investigation experience for learning descriptive statistics in a data analyst context.

The player is not taking an exam. The player is acting as a visible data analyst inside a company, moving through spaces, collecting evidence, talking to stakeholders, making a recommendation, and seeing what that recommendation does to the business.

## Player Fantasy

The player should feel:

- I am inside a real business problem.
- I can walk, inspect, compare, and decide.
- My recommendation affects people and trust.
- Statistics help me see what the surface report hides.

## First Slice

The first slice is the `Misunderstanding Statistics` sales-team case from `Why Analysis Fails - HR.pdf`.

The player is asked to evaluate Team A and Team B. The surface report tempts the player toward Team A because Team A has the higher mean. The deeper evidence shows Team B is healthier because every representative reaches the 85% threshold, while Team A is carried by three extreme top performers.

## Core Loop

1. Receive a business request.
2. Move to a place or stakeholder connected to the request.
3. Collect a piece of evidence.
4. Mark or organize the evidence in a simple game action.
5. Unlock a clearer interpretation.
6. Make a recommendation.
7. See consequences, feedback, and the next lead.

This loop should repeat across future statistics cases.

## First Case Flow

### 1. Briefing

The Sales Manager and HR Manager need a recommendation about two sales team leaders.

The briefing must describe the business decision, not the statistical trick. It should mention the 85% performance threshold because that is a business rule, but it should not say that the average is misleading.

### 2. Surface Report

The player sees a summary report:

- Team A has the higher total / average.
- Team B has a lower average.

This should be enough for an impatient player to make a weak recommendation.

### 3. Policy Evidence

The player finds or receives the HR rule:

- A good performer achieves at least 85% of target.

This turns the case from "who has the bigger average?" into "which team actually meets the business standard?"

### 4. Representative Cards

The player inspects individual representative cards or badges.

The game action should be physical and clear: mark each rep as below target threshold, meeting threshold, or exceptional. This makes the distribution visible without opening an Excel-like table as the main experience.

### 5. Pattern Reveal

The player sees the practical pattern:

- Team A has three standout reps and seven below-threshold reps.
- Team B has ten reps meeting the threshold.

Only after this discovery should the game introduce terms such as median, spread, standard deviation, IQR, or outliers.

### 6. Decision

The player recommends an action for each team.

The strong recommendation is:

- Team B: reward / recognize the stable team performance.
- Team A: training, coaching, and process review, while separately recognizing the exceptional individuals.

### 7. Consequence Feedback

The result should not be only "correct" or "wrong."

Feedback should show business consequences such as:

- employee trust;
- fairness;
- manager confidence;
- operational stability;
- quality of analysis.

## Current Prototype Gap

The current prototype already has the right ingredients: stations, evidence, representative cards, a notebook, and a decision submission.

The next design improvement is to make the learning arc stronger:

- gate evidence so the player can experience the tempting surface answer first;
- make threshold marking feel like a game action;
- add consequence scoring;
- make feedback short, specific, and tied to player behavior;
- avoid explaining the lesson before the player acts.

## Reusable Pattern For Future Lessons

Each statistics lesson should follow this structure:

1. A business decision with pressure.
2. A surface metric that feels convincing.
3. Missing context hidden in the environment.
4. A hands-on evidence action.
5. A recommendation.
6. Consequences.
7. A short concept name after discovery.

This keeps the product game-first while still teaching serious data analysis.
