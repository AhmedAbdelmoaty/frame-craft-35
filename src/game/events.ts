import type { HotspotId, PlayerDecision, RoomId, StationId } from "./types";

type GameEventMap = {
  stationchange: CustomEvent<{ station: StationId }>;
  movetostation: CustomEvent<{ station: StationId }>;
  hotspotinteract: CustomEvent<{ hotspot: HotspotId; station: StationId }>;
  decisionsubmitted: CustomEvent<{ decisions: PlayerDecision }>;
  resetdecision: CustomEvent<undefined>;
  enterRoom: CustomEvent<{ roomId: RoomId }>;
  exitRoom: CustomEvent<{ roomId: RoomId }>;
};

class TypedEventBus extends EventTarget {
  emit<K extends keyof GameEventMap>(type: K, detail: GameEventMap[K]["detail"]) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }

  on<K extends keyof GameEventMap>(type: K, handler: (event: GameEventMap[K]) => void) {
    this.addEventListener(type, handler as EventListener);
    return () => this.removeEventListener(type, handler as EventListener);
  }
}

export const gameEvents = new TypedEventBus();
