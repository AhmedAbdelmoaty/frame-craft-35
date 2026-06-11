# Character Bible - MADAR Analyst Slice

## Purpose

This bible locks the character direction before generating any final character assets. It is the source of truth for prompts, review, turnarounds, expressions, and future spritesheets.

No generated character image is game-ready until it passes the asset workflow: anchor approval, cleanup, indexing, turnaround, expression review, spritesheet planning, normalization, and in-game preview.

## Approved Visual Direction

- Style: mature 3D stylized professional.
- Audience fit: senior professionals, managers, analysts, HR, finance, and business decision makers.
- Game feel: readable, expressive, and characterful without becoming childish or mascot-like.
- Proportions: slightly larger head and expressive eyes, but less exaggerated than children's cartoon characters.
- Rendering feel: polished 3D game character, soft studio lighting, clean silhouettes, realistic fabric cues, and clear facial identity.
- Camera compatibility: full-body anchors must work for 2.5D/isometric-lite gameplay and for dialogue portraits.
- Reference use: supplied images are mood and workflow references only. Do not copy faces, exact outfits, poses, compositions, labels, or sheets.

## Global Character Rules

- Every main character must have a distinct silhouette, age range, clothing palette, posture, and facial identity.
- The player avatars must feel like capable data analysts, not generic office mascots.
- Business clothing should be professional but animation-friendly: no tiny dangling details, oversized accessories, or complex patterns that will break in spritesheets.
- Avoid embedded text, logos, charts, badges with readable words, props, motion blur, heavy shadows, cropped feet, cropped hands, fake transparency, and busy backgrounds.
- First anchor prompt should request a neutral full-body pose on a clean chroma green or plain removable background.
- Turnaround comes after anchor approval: front, 3/4 front, side, back, and head closeups.
- Expressions come after turnaround: neutral, slight smile, focused, thinking/analytical, concerned, confident.
- Spritesheets come last, after character identity is stable.

## Character Roster

### Male Analyst

Role: player avatar option and visible controllable analyst.

Age: 30-35.

Core personality: smart, observant, slightly pressured by responsibility, careful before deciding.

Visual identity:
- MENA/Egyptian business feel.
- Different face shape from managers and coach.
- Slightly tired but focused eyes, not anxious or comic.
- Optional thin black glasses; use only if they remain readable in small gameplay size.
- Hair: dark brown or black, neat modern style, not overly flashy.

Clothing:
- Navy or deep blue shirt, possibly with a lightweight blazer.
- Dark trousers and polished shoes.
- Business casual, not full executive suit.

Silhouette:
- Medium build, upright but slightly leaning forward as if engaged with data.
- Clear shoulders, clean legs, simple readable shoes.

Primary expressions:
- neutral professional
- slight smile
- analytical thinking
- concern under pressure
- confident recommendation

Prompt notes:
- Emphasize "data analyst", "professional but approachable", "mature stylized 3D game character".
- Avoid making him look like a CEO, professor, child, or comic sidekick.

### Female Analyst

Role: player avatar option and visible controllable analyst.

Age: 30-35.

Core personality: calm, precise, confident, attentive to details.

Visual identity:
- Arab/MENA professional woman.
- Hijab is approved as the default.
- Distinct face, posture, and silhouette from the male analyst.
- Clear confident eyes; not overly cute or childlike.

Clothing:
- Formal professional outfit.
- Tailored black, charcoal, navy, or deep neutral modest blazer/suit.
- Blazer length should be medium: slightly longer than a short suit jacket, just covering the rear/seat, but not longline, not coat-length, and not reaching mid-thigh.
- Beige, taupe, or muted rose hijab.
- Low professional shoes suitable for walking animations.

Silhouette:
- Hijab creates a strong readable head shape.
- Medium-length blazer and trousers create a formal modest silhouette without making the outfit look like a coat.
- Arms can be relaxed at sides for anchor; avoid crossed arms in the main full-body anchor because it complicates animation.

Primary expressions:
- neutral professional
- slight smile
- focused listening
- analytical thinking
- confident recommendation

Prompt notes:
- Emphasize "modest formal business attire", "medium-length blazer just covering the rear, not longline or coat-length", "mature 3D stylized professional", and "animation-friendly neutral pose".
- Avoid fashion-photo posing, excessive makeup, glamorous styling, or stiff corporate stock-photo energy.

### Sales Manager

Role: main NPC who provides business pressure and sales context.

Age: 45-52.

Core personality: confident, practical, commercially driven, protective of his team, wants a decision that can survive objections.

Visual identity:
- Strong presence and wider stance.
- Slightly older than analysts.
- Warm but assertive face.
- Should feel like someone who understands sales floor reality.

Clothing:
- Warm-toned blazer or business jacket: brown, tan, deep olive, or navy.
- Open collar or subtle tie depending on final tone.
- Quality shoes and watch, but not flashy.

Silhouette:
- Broader shoulders than analysts.
- Confident posture, hands relaxed or one hand gesturing.

Primary expressions:
- confident
- skeptical
- explaining
- concerned about team morale
- satisfied when decision is defendable

Prompt notes:
- Avoid making him villainous, cartoonishly aggressive, or too similar to the Data Coach.
- He should look like a business stakeholder, not a teacher.

### HR Manager

Role: main NPC who provides policy, fairness constraints, and decision accountability.

Age: 38-48.

Core personality: organized, fair, calm authority, precise with rules, protective of trust.

Visual identity:
- Calm, composed, and professional.
- More structured and restrained than the Sales Manager.
- Hijabi by default.
- Distinct from the female analyst in age, posture, face shape, hijab styling, and outfit.
- Older managerial presence: sharper/oval face, steadier eyes, firmer calm expression, and straighter posture.
- Must not look like the female analyst with different clothes; she should read as a separate person and a senior HR authority.

Clothing:
- Coordinated formal or semi-formal HR suit, with a restrained two-color palette.
- Medium-length structured blazer: just covers the seat/rear, but must not become a long coat or tunic.
- Hijab color: charcoal, slate grey, or deep muted teal; avoid the female analyst's beige/taupe hijab.
- Outfit colors: charcoal, slate grey, deep muted teal, or soft grey; avoid mixing many colors and avoid copying the female analyst's black suit and beige hijab combination.
- Minimal accessories.

Silhouette:
- Straight posture, neat shape, low visual noise.
- Can hold a folder in portrait art later, but main anchor should be prop-free.

Primary expressions:
- neutral authority
- careful listening
- firm but fair
- concern about fairness
- approving a well-supported decision

Prompt notes:
- Avoid making her cold, villainous, or generic receptionist-like.
- She should feel like a decision partner with authority.

### Data Coach

Role: senior guide who provides short post-action feedback without giving away the answer early.

Age: 50-60.

Core personality: experienced, warm, quietly sharp, mentor-like, never mascot-like.

Visual identity:
- Older expert with calm eyes and a distinctive silhouette.
- Grey or salt-and-pepper hair.
- Round or distinctive glasses are acceptable.
- Should feel like a trusted expert, not the player's boss.

Clothing:
- Smart blazer, cardigan, or textured jacket over simple shirt/turtleneck.
- Colors: grey, charcoal, navy, muted brown.
- Slightly softer than Sales/HR, more mentor-like.

Silhouette:
- Relaxed confidence, hands possibly clasped or one hand in pocket for portrait.
- Main full-body anchor should stay neutral and animation-friendly.

Primary expressions:
- calm neutral
- warm smile
- thinking
- "look again" concern
- concise approval

Prompt notes:
- Avoid magical, mascot, professor-caricature, or overly comic styling.
- He appears after the player acts; visual design should not scream "hint machine".

### Ambient NPCs

Role: background employees who make the office feel alive.

Count for first slice: 4-6 variants.

Types:
- operations employee
- sales coordinator
- HR associate
- junior analyst
- office admin
- finance reviewer

Visual identity:
- Lower detail than main characters.
- Muted clothing colors.
- Distinct silhouettes but no strong narrative identity.

Animation needs:
- idle
- short walk loop
- talk/gesture loop optional

Prompt notes:
- Avoid making ambient NPCs more visually interesting than main characters.
- No branded logos or readable text.

## Prompt-Ready Anchor Spec

Use this structure when we begin anchor generation. Do not run these prompts until the next approved asset task.

```text
Create a mature 3D stylized professional game character, full body, neutral standing pose, clean chroma green background, no props, no text, no logos, no motion blur, feet fully visible, hands fully visible, animation-friendly silhouette.

Character role:
[role]

Age and personality:
[age range + personality]

Face and identity:
[facial identity, hair/hijab/glasses, expression]

Clothing:
[business outfit and colors]

Style constraints:
professional business learning game, readable at small size, slightly stylized proportions, expressive but not childish, polished 3D render, clean studio lighting.

Negative constraints:
do not copy any reference image, no childish mascot look, no exaggerated giant eyes, no stock photo realism, no cropped limbs, no embedded background, no fake transparency, no text.
```

## Production Sequence

1. Generate and review Male Analyst anchor.
2. Generate and review Female Analyst anchor.
3. Generate and review Sales Manager anchor.
4. Generate and review HR Manager anchor.
5. Generate and review Data Coach anchor.
6. Generate and review Ambient NPC variants.
7. Create turnaround sheets only for approved anchors.
8. Create expression sheets only after turnarounds are consistent.
9. Create spritesheets only after expressions and silhouettes are locked.

## Acceptance Checklist

- Each character is recognizable from silhouette alone.
- The two player avatars feel equal in importance and quality.
- Female analyst is clearly hijabi and formal, without fashion-photo posing.
- Data Coach reads as a senior expert, not a mascot or direct boss.
- Sales Manager and HR Manager communicate different forms of authority.
- Main characters are not visually interchangeable.
- Full body anchors have complete feet and hands.
- Background is removable.
- No reference image is copied directly.
- The character can plausibly be animated in idle, walk, talk, thinking, and interact poses.

## Deferred Decisions

These are intentionally left for the next asset task, not for this bible:

- Exact generated image model/tool.
- Final prompt wording per character.
- Whether glasses stay on the player avatars after small-size readability testing.
- Final spritesheet frame size and frame count.
- Whether the game uses four-direction or eight-direction walk cycles.
