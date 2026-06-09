import Phaser from "phaser";
import { OfficeScene } from "../scenes/OfficeScene";
import type { PlayerProfile } from "./types";

export function createGame(profile: PlayerProfile) {
  const container = document.querySelector<HTMLElement>("#game-root");

  if (!container) {
    throw new Error("Missing game root");
  }

  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: container,
    backgroundColor: "#e9edf2",
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: container.clientWidth,
      height: container.clientHeight,
    },
    render: {
      antialias: true,
      pixelArt: false,
    },
    scene: [new OfficeScene(profile)],
  });
}
