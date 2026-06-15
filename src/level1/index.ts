// Level 1 bridge: listens for Phaser hotspot interactions and mounts
// matching DOM interior screens. Phaser map stays alive underneath.

import "./styles/level1.css";
import { gameEvents } from "../game/events";
import type { RoomId } from "../game/types";
import { getState, openEndScreen, resetLevel, setState, subscribe } from "./state/store";
import { createAnalystOfficeScreen } from "./screens/AnalystOfficeScreen";
import { createSalesOfficeScreen } from "./screens/SalesOfficeScreen";
import { createHROfficeScreen } from "./screens/HROfficeScreen";
import { createDecisionRoomScreen } from "./screens/DecisionRoomScreen";
import { createMeetingRoomScreen } from "./screens/MeetingRoomScreen";
import { mountTopBar } from "./components/TopBar";
import { mountMissionFileOverlay } from "./components/MissionFileOverlay";
import { mountBriefingModal } from "./components/BriefingModal";
import { mountEndGameScreen, type EndScreenHandle } from "./components/EndGameScreen";
import { startTimerLoop } from "./logic/timer";

type ScreenInstance = { root: HTMLElement; destroy: () => void };
type ScreenFactory = () => ScreenInstance;
type Destroyable = { destroy: () => void };

const SCREEN_FACTORIES: Record<RoomId, ScreenFactory> = {
  office: createAnalystOfficeScreen,
  sales: createSalesOfficeScreen,
  hr: createHROfficeScreen,
  decision: createDecisionRoomScreen,
  meeting: createMeetingRoomScreen,
};

let active: { roomId: RoomId; instance: ScreenInstance } | null = null;
let booted = false;
let endHandle: EndScreenHandle | null = null;
let cleanupFns: Array<() => void> = [];

function openRoom(roomId: RoomId) {
  if (getState().endScreenKind || getState().timeoutTriggered) return;
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

function ensureBriefing() {
  if (!getState().hasReadBrief) {
    mountBriefingModal(document.body);
  }
}

function restartLevel() {
  if (active) closeRoom();
  if (endHandle) {
    const handle = endHandle;
    endHandle = null;
    handle.unmount();
  }
  resetLevel();
  gameEvents.emit("levelreset", undefined);
  ensureBriefing();
}

export function initLevel1() {
  const previousCleanup = (window as Window & { __level1Cleanup?: () => void }).__level1Cleanup;
  previousCleanup?.();

  if (booted) return;
  booted = true;

  const topBar = mountTopBar(document.body) as Destroyable;
  const missionFile = mountMissionFileOverlay(document.body) as Destroyable;
  cleanupFns.push(() => topBar.destroy());
  cleanupFns.push(() => missionFile.destroy());
  startTimerLoop();

  ensureBriefing();

  cleanupFns.push(gameEvents.on("enterRoom", (e) => openRoom(e.detail.roomId)));
  cleanupFns.push(gameEvents.on("exitRoom", () => closeRoom()));

  // Timeout: close any open room immediately so player sees the
  // Deadline pounce on the map. EndGameScreen opens after the
  // short cartoon catch animation.
  cleanupFns.push(gameEvents.on("timeout", () => {
    if (active) closeRoom();
    window.setTimeout(() => {
      if (!getState().endScreenKind) openEndScreen("timeout");
    }, 1050);
  }));

  // EndGameScreen sync: open/close DOM overlay when endScreenKind changes.
  cleanupFns.push(subscribe((s) => {
    if (s.endScreenKind && !endHandle) {
      if (active) closeRoom();
      endHandle = mountEndGameScreen(s.endScreenKind, () => {
        restartLevel();
      });
    } else if (!s.endScreenKind && endHandle) {
      endHandle.unmount();
      endHandle = null;
    }
  }));

  (window as Window & { __level1Cleanup?: () => void }).__level1Cleanup = () => {
    if (active) closeRoom();
    if (endHandle) {
      endHandle.unmount();
      endHandle = null;
    }
    cleanupFns.forEach((fn) => fn());
    cleanupFns = [];
    booted = false;
  };
}
