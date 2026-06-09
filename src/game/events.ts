import type { GamePhase, NPCId, Recommendation } from "./types";

type GameEventMap = {
  phasechange: CustomEvent<{ phase: GamePhase }>;
  enterphase: CustomEvent<{ phase: GamePhase }>;
  npcinteract: CustomEvent<{ npc: NPCId }>;
  opendesk: CustomEvent<undefined>;
  submitrecommendation: CustomEvent<{ recommendation: Recommendation }>;
  replay: CustomEvent<undefined>;
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
