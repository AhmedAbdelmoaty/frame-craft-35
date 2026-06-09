# Misunderstanding Statistics Case Brief

Source reviewed: `Why Analysis Fails - HR.pdf`, especially pages 17-23.

This is the first learning case for the MADAR analyst slice. It should teach descriptive statistics through business consequences, not through a lecture or quiz.

## Business Situation

The player is asked to help Sales and HR evaluate two sales team leaders.

- There are 2 sales teams.
- Each team has 10 sales representatives.
- Each representative has a monthly target of 100K.
- The company defines a good performer as someone who achieves at least 85% of target.
- The business question is: which team is healthier, and which one needs intervention?

## Case Data

Team A detailed representative achievement:

```text
60, 65, 70, 75, 80, 82, 84, 150, 150, 150
```

Team B detailed representative achievement:

```text
85, 86, 87, 88, 89, 90, 91, 92, 93, 94
```

Presentation note: the summary slide shows Team A as 960K / 96%, while the detailed representative values sum to 966K / 96.6%. The detailed representative table is the stronger source for gameplay because it is the evidence the player should inspect.

## Statistical Insight

The apparent answer changes depending on what evidence the player uses.

From the summary view, Team A appears better because its average is higher. From the detailed distribution, Team B is the stronger operational team because all representatives meet the 85% threshold.

Key comparison from the presentation:

| Indicator | Team A | Team B | Gameplay meaning |
| --- | ---: | ---: | --- |
| Mean | 96.6% | 89.5% | Team A looks better if the player only checks the surface number. |
| Median | 81.0% | 89.5% | The typical Team A representative is below the good-performer threshold. |
| Range | 90 | 9 | Team A is highly uneven; Team B is stable. |
| Standard deviation | 37.6 | 3.0 | Team A performance is volatile; Team B performance is consistent. |
| IQR | 80 | 5 | Team A's middle spread is much wider. |
| Good performers | 30% | 100% | Team B satisfies the HR/business rule; Team A needs improvement. |

## Correct Business Interpretation

Team B should be recognized as the healthier team because it consistently meets the business rule.

Team A should not be treated as a simple success just because its mean is high. It has three excellent performers, but seven people are below the 85% threshold. The fair intervention is to separate individual recognition for the top performers from team-level coaching, process review, or support for the majority of the team.

## What The Player Should Learn

The player should learn that:

- Averages can hide distribution problems.
- A business threshold changes how a statistic should be interpreted.
- Median, spread, outliers, and success rate can matter more than the mean.
- A good analyst starts from the decision problem, then chooses the right evidence.
- Statistics are not only calculations; they affect people, incentives, and fairness.

## What The Game Must Avoid

Do not tell the player at the start that the mean is misleading.

Do not frame the slice as a formula lesson.

Do not turn the case into a multiple-choice quiz where the player simply picks Team A or Team B.

Do not make a static dashboard the main experience.

The learning should happen because the player moves, inspects, marks evidence, recommends an action, and then sees the consequences.
