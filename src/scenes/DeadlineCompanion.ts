// Deadline companion - a small time-pressure dog that escalates from a distant
// office pressure cue into a direct chase only near timeout.

import Phaser from "phaser";
import {
  getState,
  subscribe,
  LEVEL_DURATION_SECONDS,
} from "../level1/state/store";

export type DeadlinePhase = "relaxed" | "watching" | "impatient" | "chasing" | "hunt";

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
  scale: number;
  barkAlpha: number;
}

const WATCHING_AT_SECONDS = 120;
const IMPATIENT_AT_SECONDS = LEVEL_DURATION_SECONDS * 0.5;
const CHASING_AT_SECONDS = 45;
const HUNT_AT_SECONDS = 15;

const PHASE_CONFIG: Record<DeadlinePhase, PhaseConfig> = {
  relaxed: {
    speed: 0.018,
    offset: 150,
    eye: 0xf7f3e8,
    body: 0x3a3a41,
    glow: 0x2f8a4e,
    glowAlpha: 0,
    bobMs: 1280,
    trailAlpha: 0,
    jitter: 0,
    scale: 0.84,
    barkAlpha: 0,
  },
  watching: {
    speed: 0.035,
    offset: 126,
    eye: 0xffdf8a,
    body: 0x28282f,
    glow: 0xffd36a,
    glowAlpha: 0.18,
    bobMs: 900,
    trailAlpha: 0.12,
    jitter: 0,
    scale: 0.92,
    barkAlpha: 0.18,
  },
  impatient: {
    speed: 0.07,
    offset: 104,
    eye: 0xffb84a,
    body: 0x1d1d24,
    glow: 0xffb84a,
    glowAlpha: 0.42,
    bobMs: 620,
    trailAlpha: 0.32,
    jitter: 0.18,
    scale: 1,
    barkAlpha: 0.42,
  },
  chasing: {
    speed: 0.13,
    offset: 72,
    eye: 0xff3a3a,
    body: 0x111116,
    glow: 0xff3a3a,
    glowAlpha: 0.72,
    bobMs: 360,
    trailAlpha: 0.62,
    jitter: 0.9,
    scale: 1.08,
    barkAlpha: 0.72,
  },
  hunt: {
    speed: 0.22,
    offset: 38,
    eye: 0xff1717,
    body: 0x09090d,
    glow: 0xff1717,
    glowAlpha: 0.95,
    bobMs: 230,
    trailAlpha: 0.86,
    jitter: 1.9,
    scale: 1.18,
    barkAlpha: 1,
  },
};

function phaseFromTime(seconds: number): DeadlinePhase {
  if (seconds <= HUNT_AT_SECONDS) return "hunt";
  if (seconds <= CHASING_AT_SECONDS) return "chasing";
  if (seconds <= IMPATIENT_AT_SECONDS) return "impatient";
  if (seconds <= WATCHING_AT_SECONDS) return "watching";
  return "relaxed";
}

export class DeadlineCompanion {
  private root: Phaser.GameObjects.Container;
  private art: Phaser.GameObjects.Container;
  private shadow: Phaser.GameObjects.Ellipse;
  private pulse: Phaser.GameObjects.Arc;
  private trail: Phaser.GameObjects.Graphics;
  private body: Phaser.GameObjects.Graphics;
  private details: Phaser.GameObjects.Graphics;
  private barks: Phaser.GameObjects.Graphics;
  private biteFlash?: Phaser.GameObjects.Graphics;
  private bobTween?: Phaser.Tweens.Tween;
  private pulseTween?: Phaser.Tweens.Tween;
  private phase: DeadlinePhase = "relaxed";
  private dirSign = -1;
  private prevPlayerX = 0;
  private pouncing = false;
  private unsub: () => void;

  constructor(
    private scene: Phaser.Scene,
    private player: Phaser.GameObjects.Container,
  ) {
    const start = this.initialParkPosition();
    const startX = start.x;
    const startY = start.y;
    this.prevPlayerX = player.x;

    this.root = scene.add.container(startX, startY).setDepth(startY + 18);
    this.art = scene.add.container(0, 0);
    this.shadow = scene.add.ellipse(0, 33, 58, 16, 0x000000, 0.26);
    this.pulse = scene.add.circle(0, -2, 34, 0xffffff, 0).setStrokeStyle(3, 0xffffff, 0);
    this.trail = scene.add.graphics();
    this.body = scene.add.graphics();
    this.details = scene.add.graphics();
    this.barks = scene.add.graphics();

    this.art.add([this.trail, this.body, this.details, this.barks]);
    this.root.add([this.shadow, this.pulse, this.art]);
    this.applyPhase("relaxed", true);

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
    const isPassive = phase === "relaxed" || phase === "watching";
    const isImpatient = phase === "impatient";
    const isChasing = phase === "chasing";
    const isHunt = phase === "hunt";
    const mouthOpen = isImpatient || isChasing || isHunt;

    this.trail.clear();
    if (!isPassive) {
      this.trail.lineStyle(isHunt ? 6 : 4, cfg.glow, cfg.trailAlpha);
      this.trail.beginPath();
      this.trail.moveTo(-26, -10);
      this.trail.lineTo(-48, -22);
      this.trail.lineTo(-70, -16);
      this.trail.strokePath();
      this.trail.beginPath();
      this.trail.moveTo(-29, 8);
      this.trail.lineTo(-52, 15);
      this.trail.lineTo(-72, 5);
      this.trail.strokePath();
    }
    if (isHunt) {
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
    this.body.fillEllipse(-7, 10, 58, isPassive ? 28 : 32);
    this.body.fillEllipse(25, -9, 40, 35);
    this.body.fillEllipse(49, -8, mouthOpen ? 24 : 18, mouthOpen ? 20 : 15);
    this.body.fillTriangle(11, -25, isPassive ? 18 : 13, -45, 25, -23);
    this.body.fillTriangle(33, -25, isPassive ? 43 : 47, -43, 43, -17);
    this.body.fillEllipse(-42, isPassive ? 7 : -2, 30, 11);

    this.body.fillStyle(0x0f0f14, 1);
    this.body.fillRoundedRect(-31, 20, 11, isPassive ? 13 : 21, 5);
    this.body.fillRoundedRect(-4, 22, 11, isPassive ? 15 : 20, 5);
    this.body.fillRoundedRect(17, 18, 12, 22, 5);
    this.body.fillRoundedRect(39, 15, 11, 21, 5);

    this.body.fillStyle(0x050507, 0.42);
    this.body.fillEllipse(18, 5, 35, 19);
    this.body.fillStyle(0xffb84a, phase === "relaxed" ? 0.55 : 0.95);
    this.body.fillCircle(8, 25, 8);
    this.body.lineStyle(2, 0x5c3200, 1);
    this.body.strokeCircle(8, 25, 8);
    this.body.lineStyle(1.5, 0x5c3200, 1);
    this.body.beginPath();
    this.body.moveTo(8, 25);
    this.body.lineTo(8, 19);
    this.body.moveTo(8, 25);
    this.body.lineTo(13, 28);
    this.body.strokePath();

    this.details.clear();
    this.details.fillStyle(cfg.eye, 1);
    if (isPassive) {
      this.details.fillEllipse(20, -13, 7, 10);
      this.details.fillEllipse(34, -12, 7, 10);
      this.details.fillStyle(0x0b0b0d, 1);
      this.details.fillCircle(21, -11, 2);
      this.details.fillCircle(35, -10, 2);
      this.details.lineStyle(2, 0xe9e9e9, 0.92);
      this.details.beginPath();
      this.details.moveTo(32, 3);
      this.details.lineTo(39, 5);
      this.details.lineTo(46, 2);
      this.details.strokePath();
    } else {
      this.details.fillTriangle(17, -16, 30, -12, 18, -6);
      this.details.fillTriangle(39, -16, 29, -12, 40, -6);
      this.details.lineStyle(3, cfg.eye, 1);
      this.details.beginPath();
      this.details.moveTo(15, -21);
      this.details.lineTo(29, -17);
      this.details.moveTo(43, -21);
      this.details.lineTo(31, -17);
      this.details.strokePath();
      this.details.fillStyle(isHunt ? 0xff2a2a : 0xff8c2a, 1);
      this.details.fillEllipse(48, 2, isHunt ? 21 : 15, isHunt ? 13 : 8);
      if (isChasing || isHunt) {
        this.details.fillStyle(0xffffff, 1);
        this.details.fillTriangle(40, -2, 44, 8, 48, -1);
        this.details.fillTriangle(52, -1, 56, 8, 60, -2);
      }
    }

    this.details.fillStyle(0x111116, 1);
    this.details.fillEllipse(59, -6, 8, 6);

    this.barks.clear();
    if (cfg.barkAlpha > 0) {
      this.barks.lineStyle(2, cfg.glow, cfg.barkAlpha);
      this.barks.beginPath();
      this.barks.arc(67, -9, 9, -0.7, 0.7);
      this.barks.strokePath();
      if (isChasing || isHunt) {
        this.barks.beginPath();
        this.barks.arc(75, -9, 16, -0.65, 0.65);
        this.barks.strokePath();
      }
    }
  }

  private applyPhase(phase: DeadlinePhase, immediate: boolean) {
    this.phase = phase;
    const cfg = PHASE_CONFIG[phase];
    this.drawMascot(phase);
    this.art.setScale(cfg.scale);
    this.shadow.setScale(cfg.scale, Math.max(0.72, cfg.scale * 0.82));

    this.bobTween?.stop();
    this.bobTween = this.scene.tweens.add({
      targets: this.art,
      y: phase === "hunt" ? -7 : phase === "chasing" ? -5 : -3,
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
        scale: { from: 0.75, to: phase === "hunt" ? 1.72 : phase === "chasing" ? 1.48 : 1.22 },
        alpha: { from: cfg.glowAlpha, to: 0 },
        duration: phase === "hunt" ? 360 : phase === "chasing" ? 520 : 860,
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

    const target = this.targetPosition(cfg);
    const targetX = target.x;
    const targetY = target.y;
    this.root.x += (targetX - this.root.x) * cfg.speed;
    this.root.y += (targetY - this.root.y) * cfg.speed;

    if (cfg.jitter > 0) {
      this.root.x += Phaser.Math.FloatBetween(-cfg.jitter, cfg.jitter);
      this.root.y += Phaser.Math.FloatBetween(-cfg.jitter, cfg.jitter);
    }

    this.root.setDepth(this.root.y + 18);

    const facingSign = this.player.x < this.root.x ? -1 : 1;
    this.art.setScale(facingSign * cfg.scale, cfg.scale);
  }

  private targetPosition(cfg: PhaseConfig) {
    const roomKey = this.scene.scene.key;
    const inPlayableRoom = roomKey === "PlayableRoomScene";
    const phase = this.phase;

    if (phase === "relaxed") {
      return inPlayableRoom ? { x: 1135, y: 590 } : { x: 110, y: 690 };
    }

    if (phase === "watching") {
      return inPlayableRoom ? { x: 1075, y: 560 } : { x: 145, y: 650 };
    }

    if (phase === "impatient" && inPlayableRoom) {
      const watchX = Phaser.Math.Clamp(this.player.x - 135, 230, 390);
      return { x: watchX, y: 612 };
    }

    const targetX = this.player.x + this.dirSign * cfg.offset;
    const targetY = this.player.y + (phase === "hunt" ? -2 : 3);
    if (!inPlayableRoom) return { x: targetX, y: targetY };

    const minGap = phase === "chasing" ? 62 : phase === "hunt" ? 32 : 92;
    const clampedX = Phaser.Math.Clamp(targetX, 205, 1175);
    const clampedY = Phaser.Math.Clamp(targetY, 232, 640);
    if (Math.abs(clampedX - this.player.x) < minGap) {
      return {
        x: this.player.x + this.dirSign * minGap,
        y: clampedY,
      };
    }
    return { x: clampedX, y: clampedY };
  }

  private initialParkPosition() {
    return this.scene.scene.key === "PlayableRoomScene"
      ? { x: 1135, y: 590 }
      : { x: 110, y: 690 };
  }

  /** One-shot dramatic pounce for the timeout moment. */
  pounce() {
    if (this.pouncing) return;
    this.pouncing = true;
    this.applyPhase("hunt", true);
    this.art.setScale(this.player.x < this.root.x ? -1 : 1, 1);

    this.scene.cameras.main.shake(860, 0.018);
    this.scene.cameras.main.flash(260, 235, 38, 38);

    this.scene.tweens.add({
      targets: this.root,
      x: this.player.x,
      y: this.player.y - 10,
      scale: 1.78,
      angle: { from: 0, to: this.player.x < this.root.x ? 10 : -10 },
      duration: 360,
      ease: "Back.easeIn",
      onComplete: () => {
        this.drawBiteFlash();
        this.scene.tweens.add({
          targets: this.root,
          scale: { from: 1.78, to: 1.25 },
          angle: { from: -7, to: 7 },
          duration: 130,
          yoyo: true,
          repeat: 3,
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
    this.biteFlash.lineStyle(5, 0xff2a2a, 0.95);
    this.biteFlash.beginPath();
    this.biteFlash.moveTo(-39, -23);
    this.biteFlash.lineTo(-10, -5);
    this.biteFlash.lineTo(-39, 16);
    this.biteFlash.moveTo(39, -23);
    this.biteFlash.lineTo(10, -5);
    this.biteFlash.lineTo(39, 16);
    this.biteFlash.strokePath();
    this.biteFlash.fillStyle(0xfff1d0, 0.9);
    this.biteFlash.fillTriangle(-15, -9, -4, -2, -15, 7);
    this.biteFlash.fillTriangle(15, -9, 4, -2, 15, 7);
    this.biteFlash.fillTriangle(-5, -18, 0, -4, 6, -18);
    this.biteFlash.fillTriangle(-5, 15, 0, 1, 6, 15);
    this.biteFlash.lineStyle(3, 0xffffff, 0.82);
    this.biteFlash.strokeCircle(0, -2, 24);

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
