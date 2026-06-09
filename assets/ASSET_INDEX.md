# Asset Index

Generated and drawn assets are raw material until cleaned, indexed, and tested in-game.

## Generated Anchor Candidates

| ID | Type | File | Status | Purpose |
| --- | --- | --- | --- | --- |
| `character.player.male.anchor.candidate.v1` | generated character anchor | `assets/generated/characters/player-anchors/v1/male-analyst-anchor-candidate-v1.png` | candidate-review | Candidate anchor for the playable male data analyst |
| `character.player.female.anchor.candidate.v3` | generated character anchor | `assets/generated/characters/player-anchors/v3/female-analyst-anchor-candidate-v3-medium-blazer.png` | current-candidate | Medium blazer length: longer than v1, shorter than v2, still reads as a blazer |
| `character.player.male.turnaround.candidate.v2` | generated character directional turnaround | `assets/generated/characters/player-turnarounds/v2-male/male-analyst-directional-turnaround-v2.png` | current-candidate | Rebuilt male analyst turnaround with front, 3/4, left side, right side, back, and closeups |
| `character.player.female.turnaround.candidate.v3` | generated character turnaround | `assets/generated/characters/player-turnarounds/v2/female-analyst-turnaround-candidate-v3-medium-blazer.png` | current-candidate | Current female turnaround with medium blazer length confirmed in side/back views |
| `character.sales-manager.anchor.candidate.v1` | generated character anchor | `assets/generated/characters/sales-manager/v1/sales-manager-anchor-candidate-v1.png` | current-candidate | Distinct older Sales Manager NPC anchor with warm blazer and commercial presence |
| `character.sales-manager.turnaround.candidate.v1` | generated character turnaround | `assets/generated/characters/sales-manager/v1/sales-manager-turnaround-candidate-v1.png` | current-candidate | Sales Manager turnaround candidate with front, 3/4, side, back, and head closeups |
| `character.hr-manager.anchor.candidate.v3` | generated character anchor | `assets/generated/characters/hr-manager/v3/hr-manager-anchor-candidate-v3-hijabi-cohesive-suit.png` | current-candidate | Hijabi HR Manager with older age, cohesive charcoal suit, and medium blazer length |
| `character.hr-manager.turnaround.candidate.v3` | generated character turnaround | `assets/generated/characters/hr-manager/v3/hr-manager-turnaround-candidate-v3-hijabi-cohesive-suit.png` | current-candidate | HR Manager turnaround candidate with consistent hijab, suit, and medium blazer length |

## Runtime V1 Assets

| ID | Type | File | Status | Purpose |
| --- | --- | --- | --- | --- |
| `character.player.female.anchor` | character anchor | `public/assets/characters/player-female.svg` | runtime-v1 | Female analyst avatar and in-game character |
| `character.player.male.anchor` | character anchor | `public/assets/characters/player-male.svg` | runtime-v1 | Male analyst avatar and in-game character |
| `character.hr.anchor` | character anchor | `public/assets/characters/hr-manager.svg` | runtime-v1 | HR manager NPC |
| `character.sales.anchor` | character anchor | `public/assets/characters/sales-manager.svg` | runtime-v1 | Sales manager NPC |
| `character.coach.anchor` | character anchor | `public/assets/characters/data-coach.svg` | runtime-v1 | Data coach NPC |
| `character.employee.anchor` | character anchor | `public/assets/characters/employee.svg` | runtime-v1 | Ambient office employee |
| `prop.summary-report` | prop | `public/assets/props/summary-report.svg` | runtime-v1 | Report file at analyst desk |
| `prop.hr-folder` | prop | `public/assets/props/hr-folder.svg` | runtime-v1 | HR policy folder |
| `prop.sales-board` | prop | `public/assets/props/sales-board.svg` | runtime-v1 | Sales performance board |
| `prop.decision-board` | prop | `public/assets/props/decision-board.svg` | runtime-v1 | Decision room board |
| `ui.notebook` | UI prop | `public/assets/props/notebook.svg` | runtime-v1 | Evidence notebook icon |

## Planned Spritesheets

| ID | Character | Animations | Status |
| --- | --- | --- | --- |
| `spritesheet.player.female.core` | Female analyst | idle, walk | planned-after-anchor-approval |
| `spritesheet.player.male.core` | Male analyst | idle, walk | planned-after-anchor-approval |
| `spritesheet.hr.talk` | HR manager | idle, talk | planned |
| `spritesheet.sales.talk` | Sales manager | idle, talk | planned |
| `spritesheet.coach.talk` | Data coach | appear, talk | planned |

## Generated Spritesheet Candidates

| ID | Character | Animation | File | Cell | Frames | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `spritesheet.player.male.walk-left.v1` | Male Analyst | `walk-left` | `assets/generated/characters/player-spritesheets/male/v1/walk-left/male-analyst-walk-left-strip-v1-recovered-fixedcells.png` | `338x604` | 8 | candidate-review |
| `spritesheet.player.male.walk-right.v1` | Male Analyst | `walk-right` | `assets/generated/characters/player-spritesheets/male/v1/walk-right/male-analyst-walk-right-strip-v1-recovered-fixedcells.png` | `318x608` | 8 | candidate-review |
| `spritesheet.player.male.walk-down.v1` | Male Analyst | `walk-down` | `assets/generated/characters/player-spritesheets/male/v1/walk-down/male-analyst-walk-down-strip-v1-recovered-fixedcells.png` | `261x668` | 8 | candidate-review |

## Notes

- These SVGs are clean runtime anchors for the first playable slice. They are not final polished art.
- Future generated bitmap or spritesheet assets must be added here with dimensions, frame counts, cleanup status, and preview status.
