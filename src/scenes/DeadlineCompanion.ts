// Deadline companion - a small time-pressure mascot that follows the player.
// It stays lightweight by drawing with Phaser Graphics instead of requiring
// production sprites, while still giving clear calm / alert / critical states.

import Phaser from "phaser";
import {
  getState,
  subscribe,
  LEVEL_DURATION_SECONDS,
} from "../level1/state/store";

export type DeadlinePhase = "calm" | "alert" | "critical";

interface PhaseConfig {
  speed: number;
  offset: number;
  eye: number;
  body: number;
  glow: number;
  glowAlpha: number;
  bobMs: number;
  trailAlpha: number;
  jitter: number;
}

const ALERT_AT_SECONDS = LEVEL_DURATION_SECONDS * 0.5;
const CRITICAL_AT_SECONDS = 45;

const PHASE_CONFIG: Record<DeadlinePhase, PhaseConfig> = {
  calm: {
    speed: 0.055,
    offset: 86,
    eye: 0xffffff,
    body: 0x1b1b22,
    glow: 0x2f8a4e,
    glowAlpha: 0,
    bobMs: 980,
    trailAlpha: 0.18,
    jitter: 0,
  },
  alert: {
    speed: 0.095,
    offset: 62,
    eye: 0xffb84a,
    body: 0x141419,
    glow: 0xffb84a,
    glowAlpha: 0.5,
    bobMs: 620,
    trailAlpha: 0.42,
    jitter: 0.4,
  },
  critical: {
    speed: 0.15,
    offset: 40,
    eye: 0xff3a3a,
    body: 0x08080c,
    glow: 0xff3a3a,
    glowAlpha: 0.82,
    bobMs: 360,
    trailAlpha: 0.7,
    jitter: 1.4,
  },
};

function phaseFromTime(seconds: number): DeadlinePhase {
  if (seconds <= CRITICAL_AT_SECONDS) return "critical";
  if (seconds <= ALERT_AT_SECONDS) return "alert";
  return "calm";
}

export class DeadlineCompanion {
  private root: Phaser.GameObjects.Container;
  private art: Phaser.GameObjects.Container;
  private shadow: Phaser.GameObjects.Ellipse;
  private pulse: Phaser.GameObjects.Arc;
  private trail: Phaser.GameObjects.Graphics;
  private body: Phaser.GameObjects.Graphics;
  private details: Phaser.GameObjects.Graphics;
  private biteFlash?: Phaser.GameObjects.Graphics;
  private bobTween?: Phaser.Tweens.Tween;
  private pulseTween?: Phaser.Tweens.Tween;
  private phase: DeadlinePhase = "calm";
  private dirSign = -1;
  private prevPlayerX = 0;
  private pouncing = false;
  private unsub: () => void;

  constructor(
    private scene: Phaser.Scene,
    private player: Phaser.GameObjects.Container,
  ) {
    const startX = player.x - 86;
    const startY = player.y + 4;
    this.prevPlayerX = player.x;

    this.root = scene.add.container(startX, startY).setDepth(startY + 18);
    this.art = scene.add.container(0, 0);
    this.shadow = scene.add.ellipse(0, 33, 58, 16, 0x000000, 0.26);
    this.pulse = scene.add.circle(0, -2, 34, 0xffffff, 0).setStrokeStyle(3, 0xffffff, 0);
    this.trail = scene.add.graphics();
    this.body = scene.add.graphics();
    this.details = scene.add.graphics();

    this.art.add([this.trail, this.body, this.details]);
    this.root.add([this.shadow, this.pulse, this.art]);
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
    this.pulseTween?.stop();
    this.root.destroy();
  }

  private drawMascot(phase: DeadlinePhase) {
    const cfg = PHASE_CONFIG[phase];
    const isAlert = phase === "alert";
    const isCritical = phase === "critical";

    this.trail.clear();
    this.trail.lineStyle(isCritical ? 5 : 3, cfg.glow, cfg.trailAlpha);
    this.trail.beginPath();
    this.trail.moveTo(-18, -12);
    this.trail.lineTo(-34, -25);
    this.trail.lineTo(-48, -25);
    this.trail.lineTo(-58, -16);
    this.trail.strokePath();
    this.trail.lineStyle(isCritical ? 4 : 2, 0x101014, Math.min(0.8, cfg.trailAlpha + 0.1));
    this.trail.beginPath();
    this.trail.moveTo(-21, 4);
    this.trail.lineTo(-40, 12);
    this.trail.lineTo(-54, 8);
    this.trail.lineTo(-63, 0);
    this.trail.strokePath();
    if (isCritical) {
      this.trail.lineStyle(3, 0xff3a3a, 0.55);
      this.trail.beginPath();
      this.trail.moveTo(-25, -24);
      this.trail.lineTo(-43, -42);
      this.trail.lineTo(-59, -41);
      this.trail.lineTo(-72, -30);
      this.trail.strokePath();
    }

    this.body.clear();
    this.body.fillStyle(cfg.body, 1);
    this.body.fillEllipse(-4, 8, 46, 30);
    this.body.fillCircle(20, -8, 22);
    this.body.fillTriangle(7, -23, 14, -44, 22, -22);
    this.body.fillTriangle(32, -22, 42, -39, 38, -15);
    this.body.fillEllipse(-26, 13, 26, 15);

    this.body.fillStyle(0x111116, 1);
    this.body.fillRoundedRect(-24, 21, 11, 19, 5);
    this.body.fillRoundedRect(2, 22, 11, 18, 5);
    this.body.fillRoundedRect(20, 18, 12, 21, 5);
    this.body.fillRoundedRect(34, 15, 11, 20, 5);

    this.body.fillStyle(0x07070a, 0.45);
    this.body.fillEllipse(14, 4, 30, 18);

    this.details.clear();
    this.details.fillStyle(cfg.eye, 1);
    if (phase === "calm") {
      this.details.fillEllipse(13, -12, 7, 10);
      this.details.fillEllipse(29, -11, 7, 10);
      this.details.fillStyle(0x0b0b0d, 1);
      this.details.fillCircle(14, -10, 2);
      this.details.fillCircle(28, -9, 2);
      this.details.lineStyle(2, 0xe9e9e9, 1);
      this.details.beginPath();
      this.details.moveTo(18, 2);
      this.details.lineTo(23, 6);
      this.details.lineTo(29, 2);
      this.details.strokePath();
    } else {
      this.details.fillTriangle(9, -15, 22, -11, 10, -5);
      this.details.fillTriangle(34, -15, 23, -11, 35, -5);
      this.details.lineStyle(3, cfg.eye, 1);
      this.details.beginPath();
      this.details.moveTo(7, -20);
      this.details.lineTo(20, -17);
      this.details.moveTo(37, -20);
      this.details.lineTo(24, -17);
      this.details.strokePath();
      this.details.fillStyle(isCritical ? 0xff3a3a : 0xff8c2a, 1);
      this.details.fillEllipse(24, 4, isCritical ? 17 : 12, isCritical ? 11 : 6);
      if (isCritical) {
        this.details.fillStyle(0xffffff, 1);
        this.details.fillTriangle(18, 1, 21, 8, 24, 1);
        this.details.fillTriangle(27, 1, 30, 8, 33, 1);
      }
    }

    this.details.fillStyle(isCritical ? 0xff3a3a : isAlert ? 0xffb84a : 0xffcf6a, 1);
    this.details.fillCircle(12, 23, 8);
    this.details.lineStyle(2, 0x5c3200, 1);
    this.details.strokeCircle(12, 23, 8);
    this.details.lineStyle(1.5, 0x5c3200, 1);
    this.details.beginPath();
    this.details.moveTo(12, 23);
    this.details.lineTo(12, 17);
    this.details.moveTo(12, 23);
    this.details.lineTo(17, 26);
    this.details.strokePath();
  }

  private applyPhase(phase: DeadlinePhase, immediate: boolean) {
    this.phase = phase;
    const cfg = PHASE_CONFIG[phase];
    this.drawMascot(phase);

    this.bobTween?.stop();
    this.bobTween = this.scene.tweens.add({
      targets: this.art,
      y: phase === "critical" ? -5 : -3,
      yoyo: true,
      repeat: -1,
      duration: cfg.bobMs,
      ease: "Sine.easeInOut",
    });

    this.pulseTween?.stop();
    if (cfg.glowAlpha > 0) {
      this.pulse.setStrokeStyle(3, cfg.glow, cfg.glowAlpha);
      this.pulse.setScale(0.75);
      this.pulseTween = this.scene.tweens.add({
        targets: this.pulse,
        scale: { from: 0.75, to: phase === "critical" ? 1.55 : 1.28 },
        alpha: { from: cfg.glowAlpha, to: 0 },
        duration: phase === "critical" ? 520 : 860,
        repeat: -1,
        ease: "Quad.easeOut",
      });
    } else {
      this.pulse.setStrokeStyle(3, cfg.glow, 0);
      this.pulse.setAlpha(1);
    }

    if (!immediate) {
      this.scene.tweens.add({
        targets: this.root,
        scale: { from: 1.16, to: 1 },
        duration: 230,
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
    const targetY = this.player.y + 3;
    this.root.x += (targetX - this.root.x) * cfg.speed;
    this.root.y += (targetY - this.root.y) * cfg.speed;

    if (cfg.jitter > 0) {
      this.root.x += Phaser.Math.FloatBetween(-cfg.jitter, cfg.jitter);
      this.root.y += Phaser.Math.FloatBetween(-cfg.jitter, cfg.jitter);
    }

    this.root.setDepth(this.root.y + 18);

    const facingSign = this.player.x < this.root.x ? -1 : 1;
    this.art.setScale(facingSign, 1);
  }

  /** One-shot dramatic pounce for the timeout moment. */
  pounce() {
    if (this.pouncing) return;
    this.pouncing = true;
    this.applyPhase("critical", true);
    this.art.setScale(this.player.x < this.root.x ? -1 : 1, 1);

    this.scene.cameras.main.shake(760, 0.014);
    this.scene.cameras.main.flash(220, 230, 42, 42);

    this.scene.tweens.add({
      targets: this.root,
      x: this.player.x,
      y: this.player.y - 10,
      scale: 1.65,
      duration: 420,
      ease: "Back.easeIn",
      onComplete: () => {
        this.drawBiteFlash();
        this.scene.tweens.add({
          targets: this.root,
          scale: { from: 1.65, to: 1.28 },
          angle: { from: -5, to: 5 },
          duration: 150,
          yoyo: true,
          repeat: 2,
          ease: "Sine.easeInOut",
        });
      },
    });
  }

  private drawBiteFlash() {
    this.biteFlash?.destroy();
    this.biteFlash = this.scene.add.graphics().setDepth(this.root.depth + 2);
    this.biteFlash.x = this.player.x;
    this.biteFlash.y = this.player.y - 8;
    this.biteFlash.lineStyle(4, 0xff3a3a, 0.9);
    this.biteFlash.beginPath();
    this.biteFlash.moveTo(-30, -18);
    this.biteFlash.lineTo(-8, -4);
    this.biteFlash.lineTo(-30, 10);
    this.biteFlash.moveTo(30, -18);
    this.biteFlash.lineTo(8, -4);
    this.biteFlash.lineTo(30, 10);
    this.biteFlash.strokePath();
    this.biteFlash.fillStyle(0xfff1d0, 0.9);
    this.biteFlash.fillTriangle(-9, -5, -1, 0, -9, 7);
    this.biteFlash.fillTriangle(9, -5, 1, 0, 9, 7);

    this.scene.tweens.add({
      targets: this.biteFlash,
      alpha: 0,
      scale: 1.35,
      duration: 360,
      ease: "Quad.easeOut",
      onComplete: () => {
        this.biteFlash?.destroy();
        this.biteFlash = undefined;
      },
    });
  }
}
