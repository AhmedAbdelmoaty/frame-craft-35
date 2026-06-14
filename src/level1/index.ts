// Level 1 bridge: listens for Phaser hotspot interactions and mounts
// matching DOM interior screens. Phaser map stays alive underneath.

import "./styles/level1.css";
import { gameEvents } from "../game/events";
import type { RoomId } from "../game/types";
import { setState } from "./state/store";
import { createAnalystOfficeScreen } from "./screens/AnalystOfficeScreen";
import { createSalesOfficeScreen } from "./screens/SalesOfficeScreen";
import { createHROfficeScreen } from "./screens/HROfficeScreen";
import { createMeetingRoomScreen } from "./screens/MeetingRoomScreen";

type ScreenInstance = { root: HTMLElement; destroy: () => void };
type ScreenFactory = () => ScreenInstance;

const SCREEN_FACTORIES: Record<RoomId, ScreenFactory> = {
  office: createAnalystOfficeScreen,
  sales: createSalesOfficeScreen,
  hr: createHROfficeScreen,
  meeting: createMeetingRoomScreen,
};

let active: { roomId: RoomId; instance: ScreenInstance } | null = null;

function openRoom(roomId: RoomId) {
  if (active?.roomId === roomId) return;
  if (active) closeRoom();

  const factory = SCREEN_FACTORIES[roomId];
  if (!factory) return;

  const instance = factory();
  document.body.appendChild(instance.root);
  document.body.classList.add("l1-room-open");
  active = { roomId, instance };
  setState({ currentLocation: roomId });
}

function closeRoom() {
  if (!active) return;
  active.instance.destroy();
  document.body.classList.remove("l1-room-open");
  active = null;
  setState({ currentLocation: "map" });
}

export function initLevel1() {
  gameEvents.on("enterRoom", (e) => openRoom(e.detail.roomId));
  gameEvents.on("exitRoom", () => closeRoom());
}
