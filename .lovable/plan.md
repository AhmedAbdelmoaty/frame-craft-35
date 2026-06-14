## ما المتبقي بالظبط لإنهاء المستوى الأول؟

اللعبة دلوقتي شغّالة من البداية للنهاية: الخريطة → المكاتب الثلاثة → بطاقات الأداء والأدوات → غرفة الاجتماع → النتيجة (نجاح/فشل). الـ Core Loop مكتمل ✅.

اللي ناقص فعليًا = **Phase أخيرة واحدة** (Polish + Cleanup + QA). بعدها المستوى الأول يبقى Production-ready ونقفل عليه.

---

## Phase 6 (الأخيرة) — Cleanup + Polish + QA

### 1. Cleanup (حذف الكود القديم اللي مابقاش مستخدم)

ملفات اتفقنا نأجل حذفها لحد ما الـ Meeting يخلص. دلوقتي وقتها:

- `src/game/simulation.ts` — منطق لعبة قديم.
- `src/ui/hud.ts` — HUD قديم اتعوّض بـ `TopBar`.
- `src/data/salesCase.ts` — بيانات قديمة اتعوّضت بـ `src/level1/data/branches.ts`.
- مراجعة `src/level1/components/tabs/PlaceholderTab.ts` — لو مش متستخدم في أي tab يتشال.

قبل الحذف: `rg` للتأكد إن مفيش import شغّال. لو في، ننضف الاستيراد الأول.

### 2. ربط نهاية المستوى بشكل نظيف

دلوقتي زر "إنهاء — العودة للخريطة" بيرجّع للخريطة بس. هنضيف:

- لو `finalOutcome === "success"`: شاشة صغيرة "تم اعتماد القرار ✓ — المستوى الأول مكتمل" مع زر "إعادة اللعب".
- لو `failure`: زر "أعد المحاولة" يـ `resetMeeting()` ويرجع للمكتب يقدر يفتح بطاقات ويغيّر اختياره.
- إعادة اللعب الكاملة: action جديد `resetLevel()` في الـ store يرجّع كل الـ flags للـ initial state.

### 3. Polish (Game feel نهائي خفيف)

- **TopBar Timer**: لو وصل ≤ 02:00 → لون أحمر + pulse خفيف (موجود جزئيًا، نتأكد).
- **Badges على الخريطة**: animation صغير "pop-in" أول مرة تظهر بدل ما تيجي فجأة.
- **Meeting button unlock**: لما يتفعّل لأول مرة → toast صغير "اجتماع نادر جاهز — اضغط للدخول".
- **Result stamp**: نتأكد إن ختم النجاح/الفشل عنده animation سليم (scale + rotate).
- **Mission File**: زر صغير "آخر تحديث: …" يعرض آخر معلومة دخلت (sales summary / HR policy / sorted) — feedback خفيف.

### 4. QA Run كامل (يدوي عبر preview)

- مسار النجاح: Brief → Sales (inspect + save) → HR (inspect + save) → Analyst (open cards + sort both + tools) → Meeting → Midan + 2 strong evidence → success stamp.
- مسار الفشل #1: نفس المسار بس Corniche → failure (مع رسالة فخ المتوسط).
- مسار الفشل #2: Midan لكن دليلين ضعيفين → failure (التوجه صحيح/الدفاع ضعيف).
- اختبار الـ retry: بعد failure يرجع، يعدّل، ينجح.
- اختبار الـ timer: لما يوصل 00:00 ميكسرش اللعب.
- اختبار RTL على viewport 360px.

### 5. ملفات تتعدّل/تتشال

**تتشال:** `src/game/simulation.ts`, `src/ui/hud.ts`, `src/data/salesCase.ts` (+ `PlaceholderTab.ts` لو مش مستخدم).

**تتعدّل:**
- `src/level1/state/store.ts` → `resetLevel()`.
- `src/level1/screens/MeetingRoomScreen.ts` → شاشة "level complete" بعد success، retry نظيف بعد failure.
- `src/level1/components/TopBar.ts` → toast unlock + تحسين pulse للـ timer.
- `src/level1/components/MissionFileOverlay.ts` → "آخر تحديث" indicator خفيف.
- `src/level1/styles/level1.css` → animations الجديدة (pop-in, pulse, toast, stamp).
- `src/scenes/OfficeScene.ts` → pop-in animation للـ badges.

### 6. مفيش حاجة من دول في Phase 6

- مفيش features جديدة.
- مفيش بيانات جديدة.
- مفيش تغيير في منطق التقييم.
- مفيش صوت (متفقين).
- مفيش animations معقدة.

---

## بعد Phase 6؟

المستوى الأول (فخ المتوسط) يبقى **مكتمل وقابل للنشر**. الخطوة الجاية بعدها تكون:
- إما نبدأ تخطيط **المستوى الثاني** (Master Prompt عنده مفهوم جديد — مثلًا الـ Outliers أو Standard Deviation).
- أو نضيف **شاشة Main Menu / Level Select** قبل المستوى.
- أو **publish** للنسخة الحالية كـ MVP.

لكن دي قرارات منفصلة — نتفق عليها بعد ما Phase 6 تخلص وتتراجع.

---

## ملخّص

| Phase | الحالة |
|---|---|
| 1 — Bridge + Stubs | ✅ |
| 2 — TopBar + Mission File + Brief | ✅ |
| 3+4 — Sales/HR + Cards + Tools | ✅ |
| 5 — Meeting + Evaluation + Result | ✅ |
| **6 — Cleanup + Polish + QA** | **التالية** |

Phase 6 صغيرة وآمنة — مفيش فيها مخاطرة لأنها مش بتضيف features، بتنضف وتلمّع وتختبر بس. أوافق؟
