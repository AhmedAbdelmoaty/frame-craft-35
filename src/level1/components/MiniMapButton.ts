import { gameEvents } from "../../game/events";
import type { RoomId } from "../../game/types";
import { getState, isGameOver, subscribe, type Level1State, type RoomLocation } from "../state/store";

type MiniRoom = {
  roomId: RoomId;
  label: string;
  className: string;
};

const MINI_ROOMS: MiniRoom[] = [
  { roomId: "sales", label: "المبيعات", className: "sales" },
  { roomId: "office", label: "التحليل", className: "office" },
  { roomId: "decision", label: "القرار", className: "decision" },
  { roomId: "hr", label: "HR", className: "hr" },
  { roomId: "meeting", label: "الاجتماع", className: "meeting" },
];

const activeRoom = (location: RoomLocation): RoomId | null => {
  if (location === "map") return null;
  return location;
};

const completed = (roomId: RoomId, state: Level1State): boolean => {
  if (roomId === "sales") return state.hasSavedSalesSummary || state.hasReceivedIndividualPerformanceFile;
  if (roomId === "hr") return state.hasSavedHRPolicy;
  if (roomId === "office") return state.hasOpenedPerformanceCards;
  if (roomId === "decision") return state.hasPreparedDecision;
  if (roomId === "meeting") return state.finalOutcome !== null;
  return false;
};

function renderMiniMap(state: Level1State) {
  const current = activeRoom(state.currentLocation);
  return `
    <span class="l1-minimap__label">الخريطة</span>
    <span class="l1-minimap__canvas" aria-hidden="true">
      <span class="l1-minimap__corridor l1-minimap__corridor--h"></span>
      <span class="l1-minimap__corridor l1-minimap__corridor--v1"></span>
      <span class="l1-minimap__corridor l1-minimap__corridor--v2"></span>
      ${MINI_ROOMS.map((room) => `
        <span class="l1-minimap__room l1-minimap__room--${room.className} ${current === room.roomId ? "is-current" : ""} ${completed(room.roomId, state) ? "is-complete" : ""}">
          <span>${room.label}</span>
        </span>
      `).join("")}
      <span class="l1-minimap__plant l1-minimap__plant--tl"></span>
      <span class="l1-minimap__plant l1-minimap__plant--br"></span>
    </span>
  `;
}

export function createMiniMapButton(roomId: RoomId) {
  const button = document.createElement("button");
  button.className = "l1-minimap";
  button.type = "button";
  button.dir = "rtl";
  button.setAttribute("aria-label", "العودة إلى خريطة الشركة");

  const handleClick = () => {
    if (isGameOver()) return;
    gameEvents.emit("exitRoom", { roomId });
  };

  button.addEventListener("click", handleClick);

  const render = (state: Level1State) => {
    button.hidden = state.currentLocation === "map" || isGameOver(state);
    button.innerHTML = renderMiniMap(state);
  };

  const unsub = subscribe(render);
  render(getState());

  return {
    root: button,
    destroy: () => {
      button.removeEventListener("click", handleClick);
      unsub();
      button.remove();
    },
  };
}
