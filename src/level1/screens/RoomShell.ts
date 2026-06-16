import type { RoomId } from "../../game/types";
import { gameEvents } from "../../game/events";
import { createMiniMapButton } from "../components/MiniMapButton";

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
        <div class="room-shell__map-slot"></div>
      </div>
      <div class="room-shell__content"></div>
    </div>
  `;

  const miniMap = createMiniMapButton(opts.roomId);
  root.querySelector<HTMLElement>(".room-shell__map-slot")!.appendChild(miniMap.root);

  const body = root.querySelector<HTMLElement>(".room-shell__content")!;
  opts.renderBody?.(body);

  const closeOverlay = () => {
    gameEvents.emit("closeRoomOverlay", undefined);
    opts.onClose?.();
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeOverlay();
  };
  window.addEventListener("keydown", handleKey);

  return {
    root,
    destroy: () => {
      miniMap.destroy();
      window.removeEventListener("keydown", handleKey);
      root.remove();
    },
  };
}
