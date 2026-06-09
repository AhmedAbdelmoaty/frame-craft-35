import Phaser from "phaser";
import { briefcaseFiles, company, npcs } from "../data/salesCase";
import { gameEvents } from "../game/events";
import type { NPCId, PlayerProfile } from "../game/types";

type Hotspot = {
  id: NPCId | "desk";
  x: number;
  y: number;
  label: string;
  sublabel: string;
  color: number;
};

const ROOM_W = 1380;
const ROOM_H = 780;

export class OfficeScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Container;
  private playerSprite?: Phaser.GameObjects.Image;
  private moving = false;
  private hotspots: Hotspot[] = [];
  private deskGlow?: Phaser.GameObjects.Arc;
  private interactionLocked = false;
  private collectedCount = 0;

  constructor(private readonly profile: PlayerProfile) {
    super("OfficeScene");
  }

  preload() {
    const url = (p: string) => p;
    this.load.svg("p.female", url("/assets/characters/player-female.svg"), { width: 86, height: 128 });
    this.load.svg("p.male", url("/assets/characters/player-male.svg"), { width: 86, height: 128 });
    this.load.svg("n.karim", url("/assets/characters/sales-manager.svg"), { width: 78, height: 118 });
    this.load.svg("n.hala", url("/assets/characters/hr-manager.svg"), { width: 78, height: 118 });
    this.load.svg("n.tarek", url("/assets/characters/employee.svg"), { width: 70, height: 108 });
    this.load.svg("desk", url("/assets/props/notebook.svg"), { width: 70, height: 70 });
  }

  create() {
    this.cameras.main.setBackgroundColor("#0f172a");
    this.cameras.main.setBounds(0, 0, ROOM_W, ROOM_H);

    this.drawShell();
    this.setupHotspots();
    this.drawHotspots();
    this.createPlayer();

    gameEvents.on("phasechange", (e) => {
      if (!e.detail) return;
      this.interactionLocked = e.detail.phase !== "field";
    });
    gameEvents.on("filecollected", () => {
      this.collectedCount += 1;
      this.updateDeskGlow();
    });
  }

  private drawShell() {
    const g = this.add.graphics();
    // Office floor
    g.fillStyle(0x1e293b, 1);
    g.fillRoundedRect(40, 40, ROOM_W - 80, ROOM_H - 80, 18);
    g.lineStyle(2, 0x334155, 1);
    g.strokeRoundedRect(40, 40, ROOM_W - 80, ROOM_H - 80, 18);

    // Header strip
    g.fillStyle(0x0f172a, 1);
    g.fillRoundedRect(40, 40, ROOM_W - 80, 64, { tl: 18, tr: 18, bl: 0, br: 0 });
    this.add
      .text(ROOM_W / 2, 72, `${company.name} — ${company.tagline}`, {
        fontFamily: "Inter, sans-serif",
        fontSize: "18px",
        fontStyle: "700",
        color: "#fbbf24",
      })
      .setOrigin(0.5);

    // 3 rooms + player desk
    const rooms = [
      { x: 110, y: 150, w: 360, h: 250, name: "مكتب مدير المبيعات", sub: "Karim" },
      { x: 510, y: 150, w: 360, h: 250, name: "غرفة اجتماعات الموارد البشرية", sub: "Hala" },
      { x: 910, y: 150, w: 360, h: 250, name: "مكتب العمليات الميدانية", sub: "Tarek" },
      { x: 410, y: 450, w: 560, h: 280, name: "مكتبك (المحلل)", sub: this.profile.name },
    ];
    rooms.forEach((r, i) => {
      g.fillStyle(i === 3 ? 0x172033 : 0x1e2a3d, 1);
      g.fillRoundedRect(r.x, r.y, r.w, r.h, 12);
      g.lineStyle(2, i === 3 ? 0xfbbf24 : 0x334155, 0.8);
      g.strokeRoundedRect(r.x, r.y, r.w, r.h, 12);

      // door / sign
      const signY = r.y + 16;
      const sx = r.x + r.w / 2;
      this.add
        .text(sx, signY, r.name, {
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          fontStyle: "700",
          color: "#e2e8f0",
          align: "center",
        })
        .setOrigin(0.5, 0);
      this.add
        .text(sx, signY + 18, r.sub, {
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          color: "#94a3b8",
        })
        .setOrigin(0.5, 0);
    });
  }

  private setupHotspots() {
    this.hotspots = [
      { id: "karim", x: 290, y: 300, label: npcs.karim.name, sublabel: "مدير المبيعات", color: 0x60a5fa },
      { id: "hala", x: 690, y: 300, label: npcs.hala.name, sublabel: "الموارد البشرية", color: 0xc084fc },
      { id: "tarek", x: 1090, y: 300, label: npcs.tarek.name, sublabel: "العمليات الميدانية", color: 0xf59e0b },
      { id: "desk", x: 690, y: 600, label: "مكتبك", sublabel: "افتح بعد ما تجمع 3 ملفات", color: 0xfbbf24 },
    ];
  }

  private drawHotspots() {
    this.hotspots.forEach((h) => {
      if (h.id === "desk") {
        this.deskGlow = this.add.circle(h.x, h.y + 10, 70, 0xfbbf24, 0.0);
      }
      const key = h.id === "desk" ? "desk" : `n.${h.id}`;
      const sprite = this.add.image(h.x, h.y, key);
      sprite.setOrigin(0.5, 0.85);
      sprite.setInteractive({ useHandCursor: true });

      const labelBg = this.add.rectangle(h.x, h.y + 54, 200, 42, 0x0f172a, 0.92);
      labelBg.setStrokeStyle(2, h.color, 0.85);
      this.add
        .text(h.x, h.y + 54, `${h.label}\n${h.sublabel}`, {
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          fontStyle: "700",
          color: "#e2e8f0",
          align: "center",
        })
        .setOrigin(0.5);

      sprite.on("pointerdown", () => this.interact(h));
      labelBg.setInteractive({ useHandCursor: true });
      labelBg.on("pointerdown", () => this.interact(h));

      this.tweens.add({
        targets: sprite,
        y: h.y - 3,
        yoyo: true,
        repeat: -1,
        duration: 1300,
        ease: "Sine.easeInOut",
      });
    });
  }

  private updateDeskGlow() {
    if (!this.deskGlow) return;
    if (this.collectedCount >= 3) {
      this.tweens.add({
        targets: this.deskGlow,
        fillAlpha: 0.4,
        scale: { from: 1, to: 1.3 },
        yoyo: true,
        repeat: -1,
        duration: 900,
        ease: "Sine.easeInOut",
      });
    }
  }

  private createPlayer() {
    const start = { x: 200, y: 620 };
    this.player = this.add.container(start.x, start.y).setDepth(1000);
    const shadow = this.add.ellipse(0, 45, 60, 18, 0x000000, 0.3);
    const key = this.profile.avatar === "female" ? "p.female" : "p.male";
    this.playerSprite = this.add.image(0, 0, key);
    this.playerSprite.setOrigin(0.5, 0.82);
    this.player.add([shadow, this.playerSprite]);
    this.tweens.add({
      targets: this.playerSprite,
      y: -3,
      yoyo: true,
      repeat: -1,
      duration: 950,
      ease: "Sine.easeInOut",
    });
  }

  private interact(h: Hotspot) {
    if (this.interactionLocked) return;
    this.moveTo({ x: h.x - 90, y: h.y + 10 }, () => {
      if (h.id === "desk") {
        gameEvents.emit("opendesk", undefined);
      } else {
        gameEvents.emit("npcinteract", { npc: h.id as NPCId });
      }
    });
  }

  private moveTo(target: { x: number; y: number }, onArrive?: () => void) {
    if (!this.player || this.moving) return;
    this.moving = true;
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, target.x, target.y);
    const flip = target.x < this.player.x ? -1 : 1;
    this.playerSprite?.setScale(flip, 1);
    this.tweens.add({
      targets: this.player,
      x: target.x,
      y: target.y,
      duration: Phaser.Math.Clamp(dist * 2, 400, 1100),
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.moving = false;
        onArrive?.();
      },
    });
  }
}
// Reference to briefcaseFiles to avoid tree-shaking complaints in some build setups.
void briefcaseFiles;
