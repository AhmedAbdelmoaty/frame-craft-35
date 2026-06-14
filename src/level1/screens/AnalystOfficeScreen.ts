import { createRoomShell } from "./RoomShell";

export function createAnalystOfficeScreen() {
  return createRoomShell({
    roomId: "office",
    title: "مكتب المحلل",
    subtitle: "طاولة التحليل · ملف المهمة · أدوات الإحصاء",
    renderBody: (body) => {
      body.innerHTML = `
        <div class="room-stub">
          <p class="room-stub__eyebrow">قيد البناء — Phase 1</p>
          <h3>هنا ستفتح رسالة نادر وبطاقات الأداء وأدوات التحليل.</h3>
          <p>سيظهر في هذه الشاشة:</p>
          <ul>
            <li>شاشة الكمبيوتر برسالة المدير المالي.</li>
            <li>طاولة بطاقات أداء فرعي الكورنيش والميدان.</li>
            <li>أدوات تحليل بصرية: المتوسط، خط الحد الأدنى، الأداء المعتاد، استقرار الأداء.</li>
            <li>زر الذهاب إلى اجتماع الاعتماد (مقفل حتى يكتمل التحليل).</li>
          </ul>
        </div>
      `;
    },
  });
}
