import { createRoomShell } from "./RoomShell";

export function createHROfficeScreen() {
  return createRoomShell({
    roomId: "hr",
    title: "مكتب الموارد البشرية",
    subtitle: "ليلى · مديرة HR",
    renderBody: (body) => {
      body.innerHTML = `
        <div class="room-stub">
          <p class="room-stub__eyebrow">قيد البناء — Phase 1</p>
          <h3>هنا ستقابل ليلى وتفحص سياسة الأداء.</h3>
          <p>سيظهر في هذه الشاشة:</p>
          <ul>
            <li>حوار قصير مع ليلى.</li>
            <li>ملف سياسة الأداء (حد الـ 85%).</li>
            <li>زر حفظ سياسة الأداء في ملف المهمة.</li>
          </ul>
        </div>
      `;
    },
  });
}
