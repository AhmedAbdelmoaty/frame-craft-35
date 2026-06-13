# Analyst Triage — Mission Progression

## Mission Design Rule

Each mission teaches one analytical distinction through gameplay. Never introduce multiple new statistical ideas at once.

## Mission 1 — The Misleading Mean

### Concept

Mean can be misleading when outliers pull it away from the body of the data.

### Setup

Sales wants Team A rewarded because its general indicator is higher.

### Data

Team A: 60, 65, 70, 75, 80, 82, 84, 150, 150, 150  
Team B: 85, 86, 87, 88, 89, 90, 91, 92, 93, 94  
Threshold: 85

### Correct recommendation

Reward Team B, train Team A.

### Gameplay focus

Scan, Sort, Threshold, Outlier Mark, Impact Test.

## Mission 2 — When Mean Works

### Concept

Mean is useful when distribution is stable and representative.

### Setup

The player may distrust mean after Mission 1, but this time mean is reliable.

### Example data

Team A: 88, 89, 90, 91, 92, 93, 94, 95, 96, 97  
Team B: 70, 72, 74, 80, 85, 90, 96, 105, 110, 115  
Team C: 82, 83, 84, 85, 86, 87, 88, 89, 90, 91

### Correct recommendation

Reward the team whose mean is high and distribution is stable.

### Gameplay focus

Compare mean to spread and threshold.

## Mission 3 — Same Mean, Different Spread

### Concept

Two teams can have similar means but very different risk/stability.

### Setup

Operations asks which team can handle a new retail campaign.

### Correct logic

Choose the team with stable distribution if the decision requires reliability.

### Gameplay focus

Spread View and distribution shape.

## Mission 4 — Median Matters

### Concept

Median helps when distribution is skewed.

### Setup

A team appears acceptable by mean, but most members cluster lower.

### Gameplay focus

Sort, body marker, median marker.

## Mission 5 — Threshold Fairness

### Concept

Decision rules matter. Averages do not replace business thresholds.

### Setup

HR reviews a reward proposal.

### Gameplay focus

Threshold line, proportion above/below threshold, fairness consequences.

## Mission 6 — Choosing the Right Intervention

### Concept

Analysis should guide action type.

### New recommendation cards

- Reward
- Training
- Review
- Investigate
- Hold Decision

### Gameplay focus

Match pattern to intervention.

## Mission 7 — Incomplete Data

### Concept

A clean-looking statistic can be unsafe if the data is incomplete or biased.

### Gameplay focus

Data completeness indicators, risk of premature decision.

## Mission Template for Future Use

Each mission must define:

- business pressure;
- statistical concept;
- data pattern;
- visible gameplay action;
- correct recommendation;
- wrong recommendation;
- world consequence;
- one-sentence learning reflection after action.

