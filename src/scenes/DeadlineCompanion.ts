// Deadline companion — a playful but threatening shadow that follows the
// player around the map. Its visual state mirrors the level timer.
//
// Three phases keyed to the store:
//   calm     ( > 50% time left )
//   alert    ( 50%..20%        )
//   critical ( < 20% time left )
// Plus a one-shot `pounce()` for the timeout moment.

import Phaser from "phaser";
import {
  getState,
  subscribe,
  LEVEL_DURATION_SECONDS,
} from "../level1/state/store";

export type DeadlinePhase = "calm" | "alert" | "critical";

interface PhaseConfig {
  speed: number; // lerp factor towards target each frame
  offset: number; // distance kept behind the player
  eye: number;
  body: number;
  ringColor: number;
  ringAlpha: number;
  bobMs: number;
}

const PHASE_CONFIG: Record<DeadlinePhase, PhaseConfig> = {
  calm:     { speed: 0.05, offset: 78, eye: 0xffffff, body: 0x1a1a22, ringColor: 0xffffff, ringAlpha: 0,   bobMs: 900 },
  alert:    { speed: 0.09, offset: 58, eye: 0xffb84a, body: 0x14141a, ringColor: 0xffb84a, ringAlpha: 0.55, bobMs: 600 },
  critical: { speed: 0.15, offset: 38, eye: 0xff3a3a, body: 0x09090d, ringColor: 0xff3a3a, ringAlpha: 0.85, bobMs: 380 },
};

function phaseFromTime(seconds: number): DeadlinePhase {
  if (seconds <= LEVEL_DURATION_SECONDS * 0.2) return "critical";
  if (seconds <= LEVEL_DURATION_SECONDS * 0.5) return "alert";
  return "calm";
}

export class DeadlineCompanion {
  private container: Phaser.GameObjects.Container;
  private body: Phaser.GameObjects.Graphics;
  private eyeL: Phaser.GameObjects.Arc;
  private eyeR: Phaser.GameObjects.Arc;
  private ring: Phaser.GameObjects.Arc;
  private shadow: Phaser.GameObjects.Ellipse;
  private bobTween?: Phaser.Tweens.Tween;
  private ringTween?: Phaser.Tweens.Tween;
  private phase: DeadlinePhase = "calm";
  private dirSign = -1; // -1 = behind to the left of player, 1 = right
  private prevPlayerX = 0;
  private pouncing = false;
  private unsub: () => void;

  constructor(
    private scene: Phaser.Scene,
    private player: Phaser.GameObjects.Container,
  ) {
    const startX = player.x - 80;
    const startY = player.y;
    this.prevPlayerX = player.x;

    this.container = scene.add.container(startX, startY).setDepth(startY + 18);

    this.shadow = scene.add.ellipse(0, 38, 46, 14, 0x000000, 0.28);
    this.ring = scene.add.circle(0, 4, 30, 0xffffff, 0).setStrokeStyle(3, 0xffffff, 0);
    this.body = scene.add.graphics();
    this.eyeL = scene.add.circle(-8, -6, 4, 0xffffff, 1);
    this.eyeR = scene.add.circle(8, -6, 4, 0xffffff, 1);

    this.container.add([this.shadow, this.ring, this.body, this.eyeL, this.eyeR]);
    this.applyPhase("calm", true);

    this.unsub = subscribe(() => {
      const next = phaseFromTime(getState().meetingTimeRemaining);
      if (next !== this.phase) this.applyPhase(next, false);
    });

    scene.events.on(Phaser.Scenes.Events.UPDATE, this.tick, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
  }

  destroy() {
    this.unsub();
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.tick, this);
    this.bobTween?.stop();
    this.ringTween?.stop();
    this.container.destroy();
  }

  private drawBody(color: number, fanged: boolean) {
    this.body.clear();
    this.body.fillStyle(color, 1);
    // Ears
    this.body.fillTriangle(-20, -10, -12, -28, -6, -12);
    this.body.fillTriangle(20, -10, 12, -28, 6, -12);
    // Head/body
    this.body.fillCircle(0, 0, 20);
    // Collar watch
    this.body.fillStyle(0xffb84a, 1);
    this.body.fillCircle(0, 14, 6);
    this.body.lineStyle(1.5, 0x7a3a00, 1);
    this.body.strokeCircle(0, 14, 6);
    // Mouth — fangs only when critical
    if (fanged) {
      this.body.fillStyle(0xff3a3a, 1);
      this.body.fillTriangle(-6, 8, 6, 8, 0, 16);
      this.body.fillStyle(0xffffff, 1);
      this.body.fillTriangle(-4, 8, -1, 8, -2.5, 12);
      this.body.fillTriangle(4, 8, 1, 8, 2.5, 12);
    }
  }

  private applyPhase(phase: DeadlinePhase, immediate: boolean) {
    this.phase = phase;
    const cfg = PHASE_CONFIG[phase];
    this.drawBody(cfg.body, phase === "critical");
    this.eyeL.setFillStyle(cfg.eye);
    this.eyeR.setFillStyle(cfg.eye);

    this.bobTween?.stop();
    this.bobTween = this.scene.tweens.add({
      targets: this.body,
      y: -3,
      yoyo: true,
      repeat: -1,
      duration: cfg.bobMs,
      ease: "Sine.easeInOut",
    });

    this.ringTween?.stop();
    if (cfg.ringAlpha > 0) {
      this.ring.setStrokeStyle(3, cfg.ringColor, cfg.ringAlpha);
      this.ring.setScale(0.7);
      this.ringTween = this.scene.tweens.add({
        targets: this.ring,
        scale: { from: 0.7, to: 1.4 },
        alpha: { from: cfg.ringAlpha, to: 0 },
        duration: phase === "critical" ? 600 : 900,
        repeat: -1,
        ease: "Quad.easeOut",
      });
    } else {
      this.ring.setStrokeStyle(3, cfg.ringColor, 0);
    }

    if (!immediate) {
      this.scene.tweens.add({
        targets: this.container,
        scale: { from: 1.18, to: 1 },
        duration: 240,
        ease: "Back.easeOut",
      });
    }
  }

  private tick(_t: number, _dt: number) {
    if (this.pouncing) return;
    const cfg = PHASE_CONFIG[this.phase];

    const dx = this.player.x - this.prevPlayerX;
    if (Math.abs(dx) > 0.4) this.dirSign = dx > 0 ? -1 : 1;
    this.prevPlayerX = this.player.x;

    const targetX = this.player.x + this.dirSign * cfg.offset;
    const targetY = this.player.y;
    this.container.x += (targetX - this.container.x) * cfg.speed;
    this.container.y += (targetY - this.container.y) * cfg.speed;

    if (this.phase === "critical") {
      this.container.x += Phaser.Math.Between(-1, 1);
      this.container.y += Phaser.Math.Between(-1, 1);
    }

    this.container.setDepth(this.container.y + 18);

    // Face the player
    const facingSign = this.player.x < this.container.x ? -1 : 1;
    if (this.body.scaleX !== facingSign) this.body.setScale(facingSign, 1);
  }

  /** One-shot dramatic pounce for the timeout moment. */
  pounce() {
    if (this.pouncing) return;
    this.pouncing = true;
    this.applyPhase("critical", true);

    this.scene.cameras.main.shake(500, 0.012);
    this.scene.cameras.main.flash(200, 220, 40, 40);

    // Leap onto the player
    this.scene.tweens.add({
      targets: this.container,
      x: this.player.x,
      y: this.player.y - 8,
      scale: 1.7,
      duration: 320,
      ease: "Back.easeIn",
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.container,
          scale: { from: 1.7, to: 1.3 },
          duration: 220,
          yoyo: true,
          repeat: 1,
        });
      },
    });
  }
}
