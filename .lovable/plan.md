
# خطة تنفيذ معدّلة — Hybrid Architecture (Phaser Map + DOM Interiors)

## 1. التحول المعماري المعتمد

**نحتفظ بـ Phaser** كطبقة عالم/خريطة، **ونضيف DOM** كطبقة شاشات المكاتب والتفاعل.

| الطبقة | المسؤولية | التقنية |
|---|---|---|
| World Layer | خريطة الشركة، حركة اللاعب، NPCs، hotspots/doors، animation | Phaser 3 (نبقي عليه) |
| Interior Layer | شاشات المكاتب من الداخل، حوارات، ملف المهمة، بطاقات الأداء، الأدوات، الاجتماع، النهايات | DOM/TS modules فوق canvas |
| Bridge | حدث `enterRoom(roomId)` من Phaser → فتح Interior screen DOM | `gameEvents` (موجود بالفعل) |

**القاعدة الذهبية**: عند دخول hotspot، Phaser canvas يُخفى أو يُعتم (overlay)، وشاشة DOM للمكان تظهر **كاملة** فوقه. الخروج يُعيد الخريطة. لا يوجد صندوق صغير مزدحم فوق الخريطة.

**لا حذف الآن**: Phaser، `OfficeScene`، `createGame.ts`، `events.ts`، أصول الشخصيات/الـ props، خريطة المكاتب الحالية، حركة اللاعب — كلها تبقى. أي حذف يحدث فقط بعد مراجعتك الصريحة في مرحلة لاحقة.

## 2. ملخص المشروع والمستوى الأول

(مختصر — التفاصيل الكاملة في Blueprint)

- **اللعبة**: The Analyst — فخ المتوسط، تجربة عربية RTL لمحترفين عن الإحصاء الوصفي عبر اللعب.
- **القصة**: محلل أداء في Riwaj Retail Group، 10 دقائق قبل اجتماع، خلاف على مكافأة فرع.
- **الشخصيات**: نادر (مالي)، عماد (مبيعات)، ليلى (HR).
- **الفخ**: الكورنيش متوسط 96% لكن 7/10 تحت 85%؛ الميدان 89.5% و10/10 فوق 85%.
- **الـ loop**: حركة على الخريطة → دخول مكتب → حوار/جمع دليل → عودة → تحليل بطاقات بأدوات → اجتماع → قرار+دليلين → نهاية.

## 3. مراجعة بنية Phaser الحالية

**ما يصلح ويُعاد استخدامه**:
- `src/scenes/OfficeScene.ts` — يحوي خريطة كاملة (lobby/desk/sales/hr/decision)، حركة لاعب بـ tweens، hotspots قابلة للنقر، NPCs مع animation، prompts. **نقطة بداية ممتازة كـ MapScene**.
- `src/game/events.ts` — `gameEvents` يبث `hotspotinteract`/`stationchange`/`movetostation` — هذا هو الـ Bridge المطلوب بالضبط.
- `src/game/createGame.ts` — مصنع Phaser بسيط ونظيف.
- `public/assets/characters/*.svg` و`public/assets/props/*.svg` — placeholders احترافية للشخصيات والـ props، تكفي للنسخة الأولى.
- `src/data/salesCase.ts` — هيكل بيانات قابل لإعادة الاستخدام بعد تحديث الأسماء/الأرقام لـ Riwaj.

**ما يحتاج تعديل لا حذف**:
- `OfficeScene`: تغيير أسماء المحطات لتطابق Blueprint (مكتب المحلل، مكتب المبيعات، مكتب HR، غرفة الاجتماع — 4 hotspots بدل 5)، وتحويل سلوك "نقرة على hotspot" من "تحريك اللاعب + emit hotspotinteract" إلى "تحريك اللاعب → عند الوصول emit `enterRoom(roomId)` → DOM يفتح شاشة المكتب".
- `hud.ts`: يبقى الآن (لا يُحذف)، لكن نتجاوزه بطبقة DOM جديدة `src/level1/`. حذف `hud.ts` يأتي لاحقًا بعد موافقتك.

**ما يُحذف لاحقًا فقط (ليس الآن)**:
- منطق الأدوات الـ 4 القديم في `src/game/simulation.ts` (لا يطابق التصميم الجديد).
- الـ tabs/UI داخل `hud.ts`.
- `src/data/salesCase.ts` بعد نقل بياناته إلى `level1/data/branches.ts`.

## 4. نموذج الـ Bridge (Phaser ↔ DOM)

```
Player يضغط على باب مكتب HR (Phaser)
   ↓
Phaser يحرّك اللاعب إلى الباب (tween)
   ↓
عند الوصول: gameEvents.emit("enterRoom", { roomId: "hr" })
   ↓
DOM listener في level1/index.ts يستقبل
   ↓
يُخفي/يُعتم canvas (CSS: opacity 0.2 + pointer-events:none)
   ↓
يُركّب HROfficeScreen.ts كـ overlay كامل الشاشة
   ↓
اللاعب يتحاور/يحفظ سياسة 85% → setState
   ↓
زر "خروج إلى الخريطة" → DOM يفك الـ overlay → canvas يعود
   ↓
Phaser قد يضيف badge فوق الـ hotspot ("تم"/checkmark)
```

## 5. مراحل التنفيذ المعدّلة

### Phase 1 — Bridge + Hotspots + Interior Stub (بدون منطق تحليل)
**الهدف**: نسخة موازية playable حيث يتحرك اللاعب على الخريطة، يدخل أي مكتب، تظهر شاشة DOM فارغة للمكتب باسمه وزر خروج. لا منطق إحصاء بعد.

**ملفات جديدة (لا تعديل للقديم إلا بقدر)**:
- `src/level1/index.ts` — يستمع لـ `enterRoom`/`exitRoom` ويركّب/يفكّ شاشات DOM.
- `src/level1/state/store.ts` — store reactive للـ state (Master Prompt §23).
- `src/level1/screens/RoomShell.ts` — قالب شاشة مكتب (header باسم المكان، body فارغ، زر خروج → emit `exitRoom`).
- `src/level1/screens/AnalystOfficeScreen.ts`, `SalesOfficeScreen.ts`, `HROfficeScreen.ts`, `MeetingRoomScreen.ts` — stubs ترث `RoomShell`.
- `src/level1/styles/level1.css` — overlay full-screen RTL، tokens.

**ملفات معدّلة (تعديل محدود)**:
- `src/scenes/OfficeScene.ts`:
  - تغيير المحطات: lobby → "office" (مكتب المحلل)، sales → "sales" (مدير المبيعات)، hr → "hr"، decision → "meeting" (غرفة الاجتماع). إزالة المحطة الزائدة `desk` (المكتب صار نقطة البداية نفسها)، وإزالة `repCabinet` (سيُنقل إلى DOM داخل مكتب المحلل).
  - تحديث الأسماء العربية لتطابق Blueprint (Riwaj Retail Group، نادر/عماد/ليلى).
  - عند النقر على hotspot: `gameEvents.emit("enterRoom", { roomId })` بدل/إضافة إلى `hotspotinteract`.
  - إضافة badges فوق المحطات (تظهر بعد إكمال مهمة المكان).
- `src/main.ts`: استدعاء `level1/index.ts` بعد إنشاء Phaser game (لا حذف لشيء).
- `src/ui/hud.ts`: يُخفى مؤقتًا (display:none) أو يبقى لكن لا يستقبل أحداث جديدة — قرار بسيط: نضيف flag `LEVEL1_ACTIVE=true` يجعل `hud.ts` لا يعرض شيئًا.

**يعمل بعده**: اللاعب يتحرك بين 4 محطات، يدخل أي مكتب فتظهر شاشة DOM فارغة باسم المكتب وزر "خروج إلى الخريطة"، الخروج يعيد الخريطة بسلاسة.

**اختبار**: التنقل 4 مكاتب، الدخول/الخروج 4 مرات لكل، عدم وجود تكدس، Phaser canvas يعود نظيف.

**نتوقف هنا للمراجعة قبل Phase 2.**

### Phase 2 — TopBar (عداد + اسم المكان) + MissionFileOverlay + رسالة نادر
- TopBar ثابت فوق Phaser canvas (عداد 10 دقائق، اسم المحطة الحالية).
- زر "ملف المهمة" يفتح overlay بـ 5 tabs.
- في مكتب المحلل: شاشة كمبيوتر تعرض رسالة نادر، اللاعب يضغط "قرأت" → `hasReadBrief=true`.

### Phase 3 — محتوى مكتب المبيعات + مكتب HR
- `SalesOfficeScreen`: خلفية مكتب + sprite عماد + لوحة الأداء (إجمالي + متوسط فقط) + زر "تحدث مع عماد" + زر "افحص اللوحة" → يحفظ `sales_summary`.
- `HROfficeScreen`: مماثل مع ليلى + ملف سياسة 85% → يحفظ `hr_threshold_policy`.
- ملف المهمة tabs تتعبّى تلقائيًا.

### Phase 4 — بطاقات الأداء + 4 أدوات تحليل (داخل مكتب المحلل DOM)
- `PerformanceCardsBoard`: بطاقات صفّين (كورنيش/ميدان) بأسماء Blueprint.
- زر "رتّب من الأقل إلى الأعلى" لكل صف مع animation.
- `AnalysisToolsPanel`: 4 أزرار (المتوسط، خط الحد الأدنى، الأداء المعتاد، استقرار الأداء).
- كل أداة تعدّل عرض البطاقات بصريًا (تلوين/خط/شارة/شريط مدى).

### Phase 5 — غرفة الاجتماع + Evaluation + 3 نهايات + حذف القديم
- `MeetingRoomScreen` تفتح فقط بعد تحقق شروط Master Prompt §17.
- 3 شخصيات + اختيار فرع + EvidencePicker (2 من 7).
- `evaluate.ts`: strong_success / partial_success / failure.
- `OutroScreen` بحوارات النهاية + بطاقة تعلّم.
- **الآن فقط** نحذف بعد مراجعتك: `src/game/simulation.ts` (القديم)، tabs في `hud.ts`، `salesCase.ts`.

### Phase 6 — UI/RTL polish + mobile responsive
- breakpoints، touch targets ≥44px، اختبار 360/768/1280.
- Phaser canvas يتكيّف مع viewport (يبقى ScaleMode.RESIZE).

### Phase 7 — اختبار قبول
- 16 معيار Master Prompt §28.
- 4 مسارات نهاية مختلفة.

## 6. هيكل الملفات بعد Phase 1

```
src/
├── main.ts                              # يطلق Phaser + level1
├── scenes/
│   └── OfficeScene.ts                   # ← MapScene (معدّل، لم يُحذف)
├── game/
│   ├── createGame.ts                    # يبقى
│   ├── events.ts                        # bridge — يبقى ويُوسّع
│   ├── types.ts                         # يبقى
│   └── simulation.ts                    # يبقى مؤقتًا، يُحذف Phase 5
├── ui/
│   └── hud.ts                           # معطّل مؤقتًا، يُنظَّف Phase 5
├── data/
│   └── salesCase.ts                     # يبقى مؤقتًا
└── level1/                              # ← جديد كليًا
    ├── index.ts                         # bridge listener + mount
    ├── state/store.ts
    ├── screens/
    │   ├── RoomShell.ts
    │   ├── AnalystOfficeScreen.ts
    │   ├── SalesOfficeScreen.ts
    │   ├── HROfficeScreen.ts
    │   └── MeetingRoomScreen.ts
    └── styles/level1.css
```

## 7. State Management (نفس النموذج السابق)

نفس الـ 18 متغيرًا من Master Prompt §23 في `level1/state/store.ts`. الـ store مستقل عن Phaser. Phaser يقرأ منه فقط ليعرف ماذا يعرض كـ badge فوق hotspot (مثلاً "تم" فوق مكتب المبيعات بعد `hasSavedSalesSummary=true`).

## 8. Evaluation Logic

```ts
function evaluate(branch, evidenceIds) {
  if (branch === "corniche") return "failure";
  const strongMidan = evidenceIds
    .map(id => EVIDENCE[id])
    .filter(e => e.type==="strong" && e.supports==="midan").length;
  if (strongMidan >= 2) return "strong_success";
  if (strongMidan === 1) return "partial_success";
  return "failure";
}
```

اختيار الفرع الصحيح بدون أدلة قوية ≠ نجاح قوي → يحقق Blueprint §15.3 (منع الفوز بالحظ).

## 9. UI/UX Plan

- **Phaser canvas**: الخريطة دائمة الخلفية، حركة سلسة، NPCs animated، hotspots بـ pulse خفيف.
- **Interior screens DOM**: overlay full-screen (position:fixed, inset:0, RTL, z-index:1000) يغطي canvas عند الدخول.
- **عند فتح Interior**: canvas يأخذ `pointer-events:none` و`opacity:0.15` كخلفية معتمة (يمكن جعله أسود تمامًا).
- **خروج**: زر واضح "← خروج إلى الخريطة" أعلى Interior screen.
- **TopBar ثابت**: عداد + اسم المحطة + زر ملف المهمة، يظهر فوق Phaser وفوق Interior.
- **لا dashboard، لا case-study page، لا spreadsheet**: البطاقات DOM cards حقيقية بظل وtransitions.

## 10. قائمة الممنوعات (التزام صريح)

لن أبني: Quiz، Dashboard SaaS، Case study page، Data Coach، Branch leaders، أكثر من مستوى، Spritesheets جديدة، 3D، Formulas، شرح أن المتوسط مضلل قبل القرار، صندوق تعليمات دائم، Standard deviation formula، شاشة واحدة بكل شيء.

ولن أحذف: Phaser، OfficeScene، حركة اللاعب، NPCs، الأصول الحالية، main.ts بشكل جذري — قبل مراجعتك الصريحة في Phase 5.

## 11. أسئلة (اختيارية)

1. **خلفية canvas عند فتح Interior**: أعتمه (`opacity:0.15`) أو أخفيه كليًا (`display:none`)؟ ميلي للأول ليبقى إحساس "أنا داخل الشركة".
2. **العداد عند الصفر**: يقف عند 00:00 مع تنبيه فقط، أم خسارة فورية؟ Blueprint §18.3 يفضّل الأول.
3. **Mobile + Phaser**: Phaser canvas يعمل على الموبايل لكن يستهلك أداء؛ هل أبقي الخريطة على الموبايل أيضًا أم أقدّم بديل DOM-map للموبايل فقط؟ ميلي للأبقاء ثم تحسين الأداء في Phase 6.

---

**تقييم القدرة**: نعم — الـ hybrid model أنسب لرؤيتك وأكثر أمانًا لأنه يبني نسخة موازية دون كسر أي شيء. كل مرحلة قابلة للاختبار وحدها، وأي رجوع ممكن. أتوقف بعد كل مرحلة لمراجعتك.

في انتظار موافقتك لبدء **Phase 1** فقط (Bridge + Hotspots + Interior stubs).
