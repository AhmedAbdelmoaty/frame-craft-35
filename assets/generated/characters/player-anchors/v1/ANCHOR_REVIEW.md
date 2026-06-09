# Player Analyst Anchor Review - V1

## Scope

This folder contains raw generated anchor candidates for the two playable analyst avatars. They are not runtime-ready and must not replace the current in-game placeholders until approval, cleanup, and manifest updates are complete.

## Files

| Character | File | Dimensions | Status |
| --- | --- | --- | --- |
| Male Analyst | `male-analyst-anchor-candidate-v1.png` | 1024x1536 | candidate-review |

## Male Analyst Review

Passes:
- Mature 3D stylized professional direction.
- Reads clearly as a data analyst rather than a manager or professor.
- Full body, hands, and feet are visible.
- Chroma green background is removable.
- Distinct silhouette from the female analyst.
- Glasses are readable and support the analytical identity.

Watch:
- The character is front-facing only; do not use for movement until turnaround is created.
- The glasses should be tested at small gameplay size before locking them permanently.
- The face is friendly; keep future expressions more focused to avoid overly soft mascot energy.

Recommended next step:
- Approve as the male analyst style candidate, then generate a controlled turnaround sheet from this anchor.

## Female Analyst Note

The female V1 candidate was removed after revision. Use `../v3/female-analyst-anchor-candidate-v3-medium-blazer.png`.

## Quality Gate Before Runtime Use

- Background removal or true alpha export.
- Trim and normalize character scale.
- Small-size readability test.
- Update `assets/ASSET_INDEX.md`.
- Update runtime manifest only after final approved assets are ready.
- Browser preview before replacing current placeholders.
