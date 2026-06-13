# Handoff Current State - MADAR Analyst Slice

Last updated: 2026-06-06.

This document is the starting brief for a fresh Codex chat. Read it before doing any new work.

## Fast Startup Rules

Use the minimum context needed for the task.

- Do not recursively scan `references/`, `node_modules/`, `dist/`, or `tmp`.
- Read `docs/WORKSPACE_CLEANUP_AUDIT.md` to understand which folders are active, source-of-truth, reference-only, or archive candidates.
- Read `assets/ASSET_INDEX.md` before touching generated assets.
- Use the project-local skill that matches the task before any broad workflow.
- For character walk cycles, use `.codex/skills/project-walk-cycle-pipeline/SKILL.md` and `scripts/recover_spritesheet_strip.py`.
- Keep asset-task reviews short and do not run build/server for asset-only work.

## Project Identity

This repository is the clean root workspace for a new statistics/business learning game.

The game is for IMP, a data analysis training company. The target product is a mature, professional, game-first learning experience about:

`Descriptive Statistics for Data Analysts`

The first playable slice is based on the `Misunderstanding Statistics` case from the presentation `Why Data Analysis Fails: The Human Factor`, focused on reviewing two sales teams' performance.

The current game concept is:

- A 2D / 2.5D business investigation game inside a fictional B2B distribution company.
- Company name: `Madar Distribution` / `شركة مدار للتوزيع`.
- Player role: visible Data Analyst avatar.
- Gameplay should feel like a real game: movement, rooms, characters, interactions, evidence collection, feedback, consequences.
- It must not feel like a quiz, lecture, static dashboard, or Excel sheet.
- The player should discover the statistical issue through actions and consequences.
- Do not tell the player early that the mean is misleading.
- Do not leak the solution in the scenario framing.

## User Context

The user is non-technical.

Do not ask the user technical implementation questions such as engine details, sprite frame counts, cleanup commands, or workflow names.

The agent is responsible for:

- choosing the right skill/workflow automatically;
- explaining decisions simply;
- challenging the user's examples when they are not the best design choice;
- breaking work into small tasks;
- not doing too many tasks in parallel;
- keeping the user oriented on what is done, what is next, and why.

The user values quality, but recent feedback is that tasks have been too slow. Prefer smaller, faster, complete tasks.

## Critical Rules

Read first:

- `AGENTS.md`
- `docs/PROJECT_KNOWLEDGE_INDEX.md`
- `docs/agent-system/AGENT_OPERATING_SYSTEM.md`
- `docs/agent-system/READY_STATE.md`
- `docs/checklists/TASK_READINESS_CHECKLIST.md`
- `docs/mentor-playbook/FINAL_MENTOR_WORKFLOW_SUMMARY.md`

For assets, also read as needed:

- `docs/workflows/ASSET_GENERATION_WORKFLOW.md`
- `docs/workflows/ANIMATED_SPRITESHEET_WORKFLOW.md`
- `docs/workflows/ISOMETRIC_WORKFLOW.md`
- `docs/prompt-library/ASSET_PROMPT_PATTERNS.md`
- `docs/checklists/ASSET_QUALITY_CHECKLIST.md`

Use references only as workflow references:

- `references/`
- `references/imported-projects/`
- `references/imported-projects/root-phaser-starter/`

Do not copy reference projects' style, genre, characters, story, enemies, themes, gameplay systems, or identity.

Do not delete references.

Do not build gameplay unless specifically requested.

Do not run dev server or builds for asset-only tasks unless there is a clear need.

Treat generated assets as raw material until cleaned, indexed, normalized, and tested.

## Suggested Skills

Use these local skills when relevant:

- `.codex/skills/project-game-agent-router` for vague/non-technical project requests.
- `.codex/skills/asset-generation-pipeline` for still assets, characters, rooms, props, visual direction, indexing, and review.
- `.codex/skills/animated-spritesheet-pipeline` only after anchors/turnarounds are approved and animation is the current task.
- `.codex/skills/project-walk-cycle-pipeline` for one-direction character walk cycles; use it before generating `walk-left`, `walk-right`, `walk-down`, or `walk-up`.

Use global/plugin skills as needed:

- `game-studio:game-studio` and `game-studio:web-game-foundations` for game planning and architecture.
- `game-studio:phaser-2d-game` for future Phaser runtime work.
- `game-studio:game-ui-frontend` for game HUD, menus, notebook, dialogue, and UI.
- `game-studio:game-playtest` and Browser testing after runtime/gameplay changes.
- `imagegen` / `image_gen` for bitmap asset generation.

## Current Source Of Truth Files

- `docs/WORKSPACE_CLEANUP_AUDIT.md`
- `docs/reference-strategy/REFERENCE_EXTRACTION_STATUS.md`
- `docs/CHARACTER_BIBLE.md`
- `assets/ASSET_INDEX.md`
- `assets/generated/characters/PLAYER_CHARACTER_APPROVAL.md`
- `assets/generated/characters/sales-manager/v1/SALES_MANAGER_REVIEW.md`
- `assets/generated/characters/hr-manager/v3/HR_MANAGER_REVIEW.md`

## Approved Character Direction

Visual style:

- mature 3D stylized professional;
- business-game friendly, expressive but not childish;
- slightly larger heads/eyes, but not a children's cartoon;
- clean professional clothing and readable silhouettes;
- compatible with 2.5D/isometric-lite gameplay and dialogue portraits.

Reference images supplied by the user are mood references only. Do not copy them.

## Current Character Asset State

### Player Male Analyst

Status: current candidate.

Files:

- `assets/generated/characters/player-anchors/v1/male-analyst-anchor-candidate-v1.png`
- `assets/generated/characters/player-turnarounds/v2-male/male-analyst-directional-turnaround-v2.png`

Character notes:

- male data analyst, age 30-35;
- MENA/Egyptian feel;
- business casual;
- should not look like Sales Manager, Data Coach, CEO, or professor.
- walk-left, walk-right, and walk-down currently exist as `candidate-review` assets under `assets/generated/characters/player-spritesheets/male/v1/`.
- use `.codex/skills/project-walk-cycle-pipeline/SKILL.md` for remaining walk directions.

### Player Female Analyst

Status: current candidate after blazer-length correction.

Files:

- `assets/generated/characters/player-anchors/v3/female-analyst-anchor-candidate-v3-medium-blazer.png`
- `assets/generated/characters/player-turnarounds/v2/female-analyst-turnaround-candidate-v3-medium-blazer.png`

Important user preference:

- hijabi;
- formal professional;
- blazer should be medium length: slightly longer than the first short version, shorter than the rejected longline version;
- it should just cover the rear/seat without looking like a long coat.

Old female v1/v2 files were removed to keep the workspace clean.

### Sales Manager

Status: current candidate.

Files:

- `assets/generated/characters/sales-manager/v1/sales-manager-anchor-candidate-v1.png`
- `assets/generated/characters/sales-manager/v1/sales-manager-turnaround-candidate-v1.png`
- `assets/generated/characters/sales-manager/v1/SALES_MANAGER_REVIEW.md`

Character notes:

- male business stakeholder, age 45-52;
- confident sales-floor authority;
- different face, hair, outfit, age, and silhouette from analysts;
- warm/camel blazer direction accepted.

### HR Manager

Status: current candidate after correction.

Files:

- `assets/generated/characters/hr-manager/v3/hr-manager-anchor-candidate-v3-hijabi-cohesive-suit.png`
- `assets/generated/characters/hr-manager/v3/hr-manager-turnaround-candidate-v3-hijabi-cohesive-suit.png`
- `assets/generated/characters/hr-manager/v3/HR_MANAGER_REVIEW.md`

Important user preference:

- hijabi;
- older than female analyst;
- completely different face, features, and outfit from female analyst;
- cohesive formal or semi-formal suit, not many colors;
- blazer should cover the rear/seat, but not be very long.

Rejected directions:

- HR v1: rejected because not hijabi.
- HR v2: rejected because outfit/color mix felt inconsistent and too busy.

The project folder now keeps only HR v3 for this character.

### Data Coach

Status: not generated yet.

This is the next correct character task.

Character notes from `docs/CHARACTER_BIBLE.md`:

- senior expert, age 50-60;
- warm, calm, quietly sharp;
- not a mascot;
- not the player's boss;
- appears after player action and gives short feedback without spoiling the solution;
- grey/salt-and-pepper hair, distinctive glasses acceptable;
- smart blazer/cardigan/textured jacket, softer mentor palette.

### Ambient NPCs

Status: not generated yet.

Generate after Data Coach.

Need 4-6 lower-detail office employees for background life.

## Recommended Next Step

Next task should be:

`Data Coach anchor + turnaround`

Recommended execution:

1. Read `docs/CHARACTER_BIBLE.md` Data Coach section.
2. Use `asset-generation-pipeline`.
3. Generate only Data Coach anchor first.
4. Visually inspect it.
5. If acceptable, generate turnaround.
6. Copy final candidate files into `assets/generated/characters/data-coach/v1/`.
7. Add `DATA_COACH_REVIEW.md`.
8. Update `assets/ASSET_INDEX.md`.
9. Do not run build/server.

If the user wants speed, avoid writing a long plan unless needed. Use short updates.

## Speed Rules For Next Agent

To reduce time per task:

- Keep one asset task at a time.
- Do not generate every character at once.
- Do not start spritesheets before all main anchors and turnarounds are accepted.
- Do not run browser/server/build for asset-only tasks.
- Use visual checks, but keep review notes short.
- When the user rejects an asset direction, adjust the prompt and regenerate quickly.
- Keep only current useful versions when the user explicitly asks to clean old rejected versions.
- Record current candidates in `assets/ASSET_INDEX.md`.

## Future Order After Characters

After Data Coach and Ambient NPCs:

1. Environment Bible / office visual direction.
2. Room list and camera model:
   - Lobby / Reception.
   - Analyst Desk.
   - Sales Office.
   - HR Office.
   - Decision Room.
3. Generate room/environment candidates.
4. Create map/collision/walkable-area plan.
5. Only then start runtime gameplay integration.
6. Later: spritesheets for approved characters.

## Design Principles To Preserve

The game must be:

- Arabic-first in UI and player-facing text.
- Business/statistics themed, but still game-first.
- Mature and professional for managers, senior professionals, analysts, HR, finance, and decision makers.
- Interactive: movement, talking, inspecting, collecting evidence, marking cards, submitting recommendations.
- Feedback through consequences, not only "correct/incorrect".

Avoid:

- quizzes as the main mechanic;
- long dialogues;
- static dashboards;
- Excel-like screens as the main experience;
- childish or overly cartoonish tone;
- leaking the statistical insight at the beginning;
- overbuilding the whole game at once.

## Current Git/Workspace Notes

Several files are untracked/modified because this is an early asset setup workspace. Do not assume a clean git state.

Expected current important additions/modifications include:

- `docs/CHARACTER_BIBLE.md`
- `assets/ASSET_INDEX.md`
- `assets/generated/characters/...`
- this handoff file

Do not revert user or previous-agent work.

## Prompt For The Next Chat

The user can paste the Arabic prompt below into a new chat.

```text
اقرأ الملفات التالية أولًا قبل أي تنفيذ:

1. AGENTS.md
2. docs/HANDOFF_CURRENT_STATE.md
3. docs/CHARACTER_BIBLE.md
4. assets/ASSET_INDEX.md
5. docs/PROJECT_KNOWLEDGE_INDEX.md
6. docs/agent-system/AGENT_OPERATING_SYSTEM.md
7. docs/agent-system/READY_STATE.md
8. docs/checklists/TASK_READINESS_CHECKLIST.md
9. docs/mentor-playbook/FINAL_MENTOR_WORKFLOW_SUMMARY.md

أنا مستخدم غير تقني، فلا تسألني عن أسماء skills أو workflows أو تفاصيل تقنية لا أعرفها. أنت مسؤول عن اختيار المهارة الصحيحة تلقائيًا، وتشرح لي ببساطة ماذا تفعل ولماذا.

هذا الريبو هو مشروع لعبة تعليمية احترافية لشركة IMP عن:
Descriptive Statistics for Data Analysts

اللعبة يجب أن تكون Game-first وليست Quiz-first أو Narrative-first. نبدأ بـ playable slice من case study:
Why Data Analysis Fails: The Human Factor
وتحديدًا جزء Misunderstanding Statistics الخاص بتقييم أداء فريقي مبيعات.

المهم:
- لا تبني gameplay الآن إلا إذا طلبت منك صراحة.
- لا تنسخ من references أي ستايل أو قصة أو شخصيات أو أنظمة لعب.
- references/ هي Workflow References فقط.
- لا تحذف references.
- اللعبة عربية في النصوص الأساسية.
- الجمهور المستهدف محترفون: managers, senior professionals, data analysts, business analysts, HR, finance, decision makers.
- لا أريد dashboard أو Excel أو quiz فقط.
- أريد لعبة فيها شخصيات، أماكن، حركة، تفاعل، feedback، consequences، وإحساس سيطرة.
- لا تسرب الحل للاعب من البداية.
- لا تقل إن المتوسط مضلل من البداية.

الحالة الحالية:
- Character Bible موجود في docs/CHARACTER_BIBLE.md.
- Asset Index موجود في assets/ASSET_INDEX.md.
- تم توليد واعتماد candidates للشخصيات:
  - Male Analyst
  - Female Analyst
  - Sales Manager
  - HR Manager v3
- HR Manager لازم تظل محجبة، أكبر سنًا من المحللة، ببدلة/سيمي فورمال متناسقة، وبليزر متوسط يغطي المؤخرة بدون طول مبالغ.
- الخطوة الصحيحة التالية هي Data Coach anchor + turnaround، إلا إذا طلبت منك شيء آخر.

قبل تنفيذ أي asset task:
- استخدم .codex/skills/asset-generation-pipeline.
- اقرأ docs/workflows/ASSET_GENERATION_WORKFLOW.md و docs/checklists/ASSET_QUALITY_CHECKLIST.md عند الحاجة.
- لا تبدأ spritesheets قبل اعتماد anchors وturnarounds.
- لا تشغل سيرفر أو build في asset-only tasks.
- خليك سريع: task واحد صغير في كل مرة، generate → visual check → save/index → review مختصر.

ابدأ فقط بفهم الحالة وتجهيز نفسك، ثم قل لي باختصار:
1. فهمت إيه؟
2. إحنا وصلنا لإيه؟
3. الخطوة التالية الصح إيه؟
4. ما الملفات والمهارات التي ستستخدمها تلقائيًا؟
ولا تبدأ تنفيذ أي شيء قبل أن أطلب منك.
```
