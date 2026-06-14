import { createRoomShell } from "./RoomShell";

export function createSalesOfficeScreen() {
  return createRoomShell({
    roomId: "sales",
    title: "مكتب المبيعات",
    subtitle: "عماد · مدير المبيعات",
    renderBody: (body) => {
      body.innerHTML = `
        <div class="room-stub">
          <p class="room-stub__eyebrow">قيد البناء — Phase 1</p>
          <h3>هنا ستقابل عماد وتفحص لوحة الأداء الشهرية للفرعين.</h3>
          <p>سيظهر في هذه الشاشة:</p>
          <ul>
            <li>حوار قصير مع عماد.</li>
            <li>لوحة عرض إجمالي المبيعات ومتوسط الأداء لكل فرع.</li>
            <li>زر حفظ ملخص المبيعات في ملف المهمة.</li>
          </ul>
        </div>
      `;
    },
  });
}
