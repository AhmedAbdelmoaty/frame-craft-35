import type { RoomId } from "../../game/types";
import { gameEvents } from "../../game/events";
import { createMiniMapButton } from "../components/MiniMapButton";

export interface RoomShellOptions {
  roomId: RoomId;
  title: string;
  subtitle?: string;
  /** Renders body content into the provided container. Stub-friendly. */
  renderBody?: (body: HTMLElement) => void;
}

/**
 * Creates a full-screen DOM overlay representing an interior screen for a room.
 * Returns the root element and a destroy() cleanup function.
 */
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
    <header class="room-shell__header">
      <div class="room-shell__map-slot"></div>
      <div class="room-shell__title">
        <h2>${opts.title}</h2>
        ${opts.subtitle ? `<p>${opts.subtitle}</p>` : ""}
      </div>
      <span class="room-shell__badge">المستوى الأول</span>
    </header>
    <div class="room-shell__body"></div>
  `;

  const miniMap = createMiniMapButton(opts.roomId);
  root.querySelector<HTMLElement>(".room-shell__map-slot")!.appendChild(miniMap.root);

  const body = root.querySelector<HTMLElement>(".room-shell__body")!;
  opts.renderBody?.(body);

  const handleExit = () => {
    gameEvents.emit("exitRoom", { roomId: opts.roomId });
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") gameEvents.emit("closeRoomOverlay", undefined);
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
