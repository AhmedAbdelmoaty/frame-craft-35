// Level 1 bridge: listens for Phaser hotspot interactions and mounts
// matching DOM interior screens. Phaser map stays alive underneath.

import "./styles/level1.css";
import { gameEvents } from "../game/events";
import type { RoomId } from "../game/types";
import { getState, openEndScreen, setState, subscribe } from "./state/store";
import { createAnalystOfficeScreen } from "./screens/AnalystOfficeScreen";
import { createSalesOfficeScreen } from "./screens/SalesOfficeScreen";
import { createHROfficeScreen } from "./screens/HROfficeScreen";
import { createDecisionRoomScreen } from "./screens/DecisionRoomScreen";
import { createMeetingRoomScreen } from "./screens/MeetingRoomScreen";
import { mountTopBar } from "./components/TopBar";
import { mountMissionFileOverlay } from "./components/MissionFileOverlay";
import { createMiniMapButton } from "./components/MiniMapButton";
import { mountMobileEntryOverlay } from "./components/MobileEntryOverlay";
import { mountBriefingModal } from "./components/BriefingModal";
import { mountEndGameScreen, type EndScreenHandle } from "./components/EndGameScreen";
import { startTimerLoop } from "./logic/timer";

type ScreenInstance = { root: HTMLElement; destroy: () => void };
type ScreenFactory = () => ScreenInstance;
type Destroyable = { destroy: () => void };
type PlayableRoomId = Extract<RoomId, "office" | "sales" | "hr" | "decision" | "meeting">;

const SCREEN_FACTORIES: Record<RoomId, ScreenFactory> = {
  office: createAnalystOfficeScreen,
  sales: createSalesOfficeScreen,
  hr: createHROfficeScreen,
  decision: createDecisionRoomScreen,
  meeting: createMeetingRoomScreen,
};

let active: { roomId: RoomId; instance: ScreenInstance } | null = null;
let activePlayable: { roomId: PlayableRoomId; miniMap: Destroyable } | null = null;
let booted = false;
let endHandle: EndScreenHandle | null = null;
let cleanupFns: Array<() => void> = [];

const PLAYABLE_ROOMS: ReadonlySet<RoomId> = new Set(["office", "sales", "hr", "decision", "meeting"]);

function isPlayableRoom(roomId: RoomId): roomId is PlayableRoomId {
  return PLAYABLE_ROOMS.has(roomId);
}

function openRoom(roomId: RoomId) {
  if (getState().endScreenKind || getState().timeoutTriggered) return;
  openPlayableRoom(roomId as PlayableRoomId);
}

function closeRoom() {
  if (!active) return;
  const playableRoomId = activePlayable?.roomId;
  const shouldReturnToPlayable = playableRoomId === active.roomId;
  active.instance.destroy();
  document.body.classList.remove("l1-room-open");
  document.body.classList.remove("l1-playable-overlay-open");
  active = null;
  setState({ currentLocation: shouldReturnToPlayable && playableRoomId ? playableRoomId : "map" });
}

function openPlayableRoom(roomId: PlayableRoomId) {
  if (activePlayable?.roomId === roomId) return;
  if (active) closeRoom();
  if (activePlayable) closePlayableRoom();

  const miniMap = createMiniMapButton(roomId);
  document.body.appendChild(miniMap.root);
  activePlayable = { roomId, miniMap };
  setState({ currentLocation: roomId });
  gameEvents.emit("openPlayableRoom", { roomId });
}

function closePlayableRoom() {
  if (!activePlayable) return;
  if (active) closeRoom();
  activePlayable.miniMap.destroy();
  activePlayable = null;
  gameEvents.emit("closePlayableRoom", undefined);
  setState({ currentLocation: "map" });
}

function detachPlayableHud() {
  if (!activePlayable) return;
  activePlayable.miniMap.destroy();
  activePlayable = null;
}

function openRoomOverlay(roomId: RoomId) {
  if (getState().endScreenKind || getState().timeoutTriggered) return;
  if (active?.roomId === roomId) return;
  if (active) closeRoom();

  const factory = SCREEN_FACTORIES[roomId];
  if (!factory) return;

  const instance = factory();
  document.body.appendChild(instance.root);
  document.body.classList.add("l1-room-open", "l1-playable-overlay-open");
  active = { roomId, instance };
  setState({ currentLocation: roomId });
}

function ensureBriefing() {
  if (!getState().hasReadBrief) {
    mountBriefingModal(document.body);
  }
}

function restartLevel() {
  window.dispatchEvent(new CustomEvent("madar:restart-level"));
}

export function initLevel1() {
  const previousCleanup = (window as Window & { __level1Cleanup?: () => void }).__level1Cleanup;
  previousCleanup?.();

  if (booted) return;
  booted = true;

  const topBar = mountTopBar(document.body) as Destroyable;
  const missionFile = mountMissionFileOverlay(document.body) as Destroyable;
  const mobileEntry = mountMobileEntryOverlay(document.body) as Destroyable;
  cleanupFns.push(() => topBar.destroy());
  cleanupFns.push(() => missionFile.destroy());
  cleanupFns.push(() => mobileEntry.destroy());
  startTimerLoop();

  ensureBriefing();

  cleanupFns.push(gameEvents.on("enterRoom", (e) => openRoom(e.detail.roomId)));
  cleanupFns.push(gameEvents.on("exitRoom", () => {
    if (active) closeRoom();
    if (activePlayable) closePlayableRoom();
  }));
  cleanupFns.push(gameEvents.on("openRoomOverlay", (e) => openRoomOverlay(e.detail.roomId)));
  cleanupFns.push(gameEvents.on("closeRoomOverlay", () => {
    if (active) closeRoom();
  }));

  // Timeout: close any open room immediately so player sees the
  // Deadline pounce on the map. EndGameScreen opens after the
  // short cartoon catch animation.
  cleanupFns.push(gameEvents.on("timeout", () => {
    if (active) closeRoom();
    detachPlayableHud();
    window.setTimeout(() => {
      if (!getState().endScreenKind) openEndScreen("timeout");
    }, 1050);
  }));

  // EndGameScreen sync: open/close DOM overlay when endScreenKind changes.
  cleanupFns.push(subscribe((s) => {
    if (s.endScreenKind && !endHandle) {
      if (active) closeRoom();
      if (activePlayable) closePlayableRoom();
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
    if (activePlayable) closePlayableRoom();
    if (endHandle) {
      endHandle.unmount();
      endHandle = null;
    }
    cleanupFns.forEach((fn) => fn());
    cleanupFns = [];
    booted = false;
  };
}
