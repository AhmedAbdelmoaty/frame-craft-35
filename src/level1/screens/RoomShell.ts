import type { RoomId } from "../../game/types";
import { gameEvents } from "../../game/events";

export interface RoomShellOptions {
  roomId: RoomId;
  title: string;
  subtitle?: string;
  onClose?: () => void;
  renderBody?: (body: HTMLElement) => void;
}

export function createRoomShell(opts: RoomShellOptions): {
  root: HTMLElement;
  destroy: () => void;
} {
  const root = document.createElement("section");
  root.className = `room-shell room-shell--${opts.roomId}`;
  root.dir = "rtl";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", opts.title);

  root.innerHTML = `
    <div class="room-shell__body">
      <div class="room-shell__hud">
        <button class="room-shell__close" type="button" data-close-overlay>
          <span aria-hidden="true">←</span>
          <span>العودة للغرفة</span>
        </button>
      </div>
      <div class="room-shell__content"></div>
    </div>
  `;

  const body = root.querySelector<HTMLElement>(".room-shell__content")!;
  opts.renderBody?.(body);

  const stopInputLeak = (event: Event) => {
    event.stopPropagation();
  };
  root.addEventListener("pointerdown", stopInputLeak);
  root.addEventListener("click", stopInputLeak);

  const closeOverlay = () => {
    gameEvents.emit("closeRoomOverlay", undefined);
    opts.onClose?.();
  };

  root.querySelector<HTMLButtonElement>("[data-close-overlay]")!.addEventListener("click", closeOverlay);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeOverlay();
  };
  window.addEventListener("keydown", handleKey);

  return {
    root,
    destroy: () => {
      window.removeEventListener("keydown", handleKey);
      root.removeEventListener("pointerdown", stopInputLeak);
      root.removeEventListener("click", stopInputLeak);
      root.remove();
    },
  };
}
