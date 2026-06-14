import { createRoomShell } from "./RoomShell";

export function createMeetingRoomScreen() {
  return createRoomShell({
    roomId: "meeting",
    title: "غرفة الاجتماع",
    subtitle: "اعتماد مكافأة الفرع · نادر، عماد، ليلى",
    renderBody: (body) => {
      body.innerHTML = `
        <div class="room-stub">
          <p class="room-stub__eyebrow">قيد البناء — Phase 1</p>
          <h3>هنا سيُعقد اجتماع اعتماد مكافآت الفروع.</h3>
          <p>سيظهر في هذه الشاشة:</p>
          <ul>
            <li>نادر يفتح الاجتماع ويطلب توصية قابلة للدفاع.</li>
            <li>اختيار فرع: الكورنيش أو الميدان.</li>
            <li>اختيار دليلين من ملف المهمة.</li>
            <li>ردود الشخصيات الثلاث وبطاقة تعلّم بعد القرار.</li>
          </ul>
        </div>
      `;
    },
  });
}
