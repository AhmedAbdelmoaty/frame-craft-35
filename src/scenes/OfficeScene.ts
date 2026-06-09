import Phaser from "phaser";
import { company, npcs } from "../data/salesCase";
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
  private currentTarget: { x: number; y: number } = { x: 200, y: 600 };
  private moving = false;
  private hotspots: Hotspot[] = [];
  private interactionLocked = false;

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
    this.load.svg("n.alex", url("/assets/characters/data-coach.svg"), { width: 74, height: 112 });
    this.load.svg("desk", url("/assets/props/notebook.svg"), { width: 70, height: 70 });
  }

  create() {
    this.cameras.main.setBackgroundColor("#e6ecf2");
    this.cameras.main.setBounds(0, 0, ROOM_W, ROOM_H);

    this.drawShell();
    this.setupHotspots();
    this.drawHotspots();
    this.createPlayer();

    gameEvents.on("phasechange", (e) => {
      if (!e.detail) return;
      // Lock interaction when not in field phase
      this.interactionLocked = e.detail.phase !== "field";
    });
  }

  private drawShell() {
    const g = this.add.graphics();
    g.fillStyle(0xf6f8fb, 1);
    g.fillRoundedRect(40, 40, ROOM_W - 80, ROOM_H - 80, 20);
    g.lineStyle(3, 0xb9c4cf, 1);
    g.strokeRoundedRect(40, 40, ROOM_W - 80, ROOM_H - 80, 20);

    // Header strip
    g.fillStyle(0x1f3a52, 1);
    g.fillRoundedRect(40, 40, ROOM_W - 80, 70, { tl: 20, tr: 20, bl: 0, br: 0 });
    this.add
      .text(ROOM_W / 2, 76, `${company.name} — ${company.tagline}`, {
        fontFamily: "Inter, sans-serif",
        fontSize: "20px",
        fontStyle: "700",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Office zones (visual only)
    g.fillStyle(0xeef3f8, 1);
    g.fillRoundedRect(120, 160, 380, 240, 12); // VP corner
    g.fillRoundedRect(540, 160, 380, 240, 12); // HR corner
    g.fillRoundedRect(960, 160, 280, 240, 12); // Sales Ops
    g.fillRoundedRect(120, 460, 540, 260, 12); // Player desk + Alex
    g.fillRoundedRect(700, 460, 540, 260, 12); // Open area

    this.add.text(135, 175, "VP Sales", this.label());
    this.add.text(555, 175, "HR", this.label());
    this.add.text(975, 175, "Sales Ops", this.label());
    this.add.text(135, 475, "مكتبك (The Lab)", this.label());
    this.add.text(715, 475, "Open area", this.label());
  }

  private label(color = "#5d6f82") {
    return {
      fontFamily: "Inter, sans-serif",
      fontSize: "13px",
      fontStyle: "700",
      color,
    } as Phaser.Types.GameObjects.Text.TextStyle;
  }

  private setupHotspots() {
    this.hotspots = [
      { id: "karim", x: 310, y: 290, label: npcs.karim.name, sublabel: npcs.karim.role, color: 0x2b78c5 },
      { id: "hala", x: 730, y: 290, label: npcs.hala.name, sublabel: npcs.hala.role, color: 0x7657a5 },
      { id: "tarek", x: 1100, y: 290, label: npcs.tarek.name, sublabel: npcs.tarek.role, color: 0xb7791f },
      { id: "alex", x: 540, y: 600, label: npcs.alex.name, sublabel: npcs.alex.role, color: 0xa83d47 },
      { id: "desk", x: 240, y: 600, label: "مكتبك", sublabel: "افتح The Lab", color: 0x3d8644 },
    ];
  }

  private drawHotspots() {
    this.hotspots.forEach((h) => {
      const key = h.id === "desk" ? "desk" : `n.${h.id}`;
      const sprite = this.add.image(h.x, h.y, key);
      sprite.setOrigin(0.5, 0.85);
      sprite.setInteractive({ useHandCursor: true });

      const labelBg = this.add.rectangle(h.x, h.y + 50, 180, 44, 0xffffff, 0.92);
      labelBg.setStrokeStyle(2, h.color, 0.9);
      const text = this.add.text(h.x, h.y + 50, `${h.label}\n${h.sublabel}`, {
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        fontStyle: "700",
        color: "#1f2a37",
        align: "center",
      });
      text.setOrigin(0.5);

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

  private createPlayer() {
    const start = { x: 200, y: 620 };
    this.currentTarget = start;
    this.player = this.add.container(start.x, start.y).setDepth(1000);
    const shadow = this.add.ellipse(0, 45, 60, 18, 0x17202a, 0.2);
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
        this.currentTarget = target;
        onArrive?.();
      },
    });
  }
}
