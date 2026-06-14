import Phaser from "phaser";
import { stationCopy } from "../data/salesCase";
import { gameEvents } from "../game/events";
import type { HotspotId, PlayerProfile, RoomId, StationId } from "../game/types";

const STATION_TO_ROOM: Record<StationId, RoomId> = {
  lobby: "office",
  desk: "office",
  sales: "sales",
  hr: "hr",
  decision: "meeting",
};

type StationView = {
  id: StationId;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  label: string;
  sublabel: string;
  hotspot: HotspotId;
  propKey?: PropAssetKey;
};

type HotspotView = {
  id: HotspotId;
  station: StationId;
  x: number;
  y: number;
  label: string;
  propKey?: PropAssetKey;
};

type PropAssetKey = "summaryReport" | "hrFolder" | "salesBoard" | "decisionBoard" | "notebook";

const stations: StationView[] = [
  {
    id: "lobby",
    x: 335,
    y: 625,
    width: 320,
    height: 190,
    color: 0xe8edf1,
    label: "مكتب المحلل",
    sublabel: "نقطة البداية · رسالة نادر",
    hotspot: "reception",
  },
  {
    id: "desk",
    x: 265,
    y: 230,
    width: 330,
    height: 230,
    color: 0xddebf5,
    label: "مكتب المحلل · طاولة التحليل",
    sublabel: "بطاقات الأداء والأدوات",
    hotspot: "summaryReport",
    propKey: "summaryReport",
  },
  {
    id: "sales",
    x: 745,
    y: 225,
    width: 380,
    height: 240,
    color: 0xf3dfcf,
    label: "مكتب المبيعات",
    sublabel: "عماد · لوحة الأداء",
    hotspot: "salesBoard",
    propKey: "salesBoard",
  },
  {
    id: "hr",
    x: 830,
    y: 625,
    width: 330,
    height: 190,
    color: 0xe8e0f4,
    label: "مكتب HR",
    sublabel: "ليلى · سياسة الأداء",
    hotspot: "hrFolder",
    propKey: "hrFolder",
  },
  {
    id: "decision",
    x: 1190,
    y: 355,
    width: 330,
    height: 300,
    color: 0xe0f0dc,
    label: "غرفة الاجتماع",
    sublabel: "اعتماد المكافأة",
    hotspot: "decisionBoard",
    propKey: "decisionBoard",
  },
];

const stationPoints: Record<StationId, { x: number; y: number }> = {
  lobby: { x: 335, y: 660 },
  desk: { x: 265, y: 285 },
  sales: { x: 745, y: 295 },
  hr: { x: 830, y: 670 },
  decision: { x: 1190, y: 450 },
};

const assetKeys = {
  playerFemale: "character.player.female",
  playerMale: "character.player.male",
  hrManager: "character.hr",
  salesManager: "character.sales",
  dataCoach: "character.coach",
  employee: "character.employee",
  summaryReport: "prop.summaryReport",
  hrFolder: "prop.hrFolder",
  salesBoard: "prop.salesBoard",
  decisionBoard: "prop.decisionBoard",
  notebook: "prop.notebook",
} as const;

export class OfficeScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Container;
  private playerSprite?: Phaser.GameObjects.Image;
  private playerLabel?: Phaser.GameObjects.Text;
  private prompt?: Phaser.GameObjects.Container;
  private stationHighlights = new Map<StationId, Phaser.GameObjects.Rectangle>();
  private hotspots = new Map<HotspotId, HotspotView>();
  private currentStation: StationId = "lobby";
  private moving = false;
  private unsubscribeMove?: () => void;
  private unsubscribeDecision?: () => void;

  constructor(private readonly profile: PlayerProfile) {
    super("OfficeScene");
  }

  preload() {
    this.load.svg(assetKeys.playerFemale, "/assets/characters/player-female.svg", { width: 86, height: 128 });
    this.load.svg(assetKeys.playerMale, "/assets/characters/player-male.svg", { width: 86, height: 128 });
    this.load.svg(assetKeys.hrManager, "/assets/characters/hr-manager.svg", { width: 78, height: 118 });
    this.load.svg(assetKeys.salesManager, "/assets/characters/sales-manager.svg", { width: 78, height: 118 });
    this.load.svg(assetKeys.dataCoach, "/assets/characters/data-coach.svg", { width: 74, height: 112 });
    this.load.svg(assetKeys.employee, "/assets/characters/employee.svg", { width: 66, height: 100 });
    this.load.svg(assetKeys.summaryReport, "/assets/props/summary-report.svg", { width: 62, height: 62 });
    this.load.svg(assetKeys.hrFolder, "/assets/props/hr-folder.svg", { width: 66, height: 66 });
    this.load.svg(assetKeys.salesBoard, "/assets/props/sales-board.svg", { width: 110, height: 82 });
    this.load.svg(assetKeys.decisionBoard, "/assets/props/decision-board.svg", { width: 112, height: 84 });
    this.load.svg(assetKeys.notebook, "/assets/props/notebook.svg", { width: 56, height: 56 });
  }

  create() {
    this.cameras.main.setBackgroundColor("#dfe7ef");
    this.cameras.main.setBounds(0, 0, 1380, 780);
    this.drawOfficeShell();
    this.drawRooms();
    this.drawFurniture();
    this.drawNpcs();
    this.createPlayer();
    this.drawPrompt();
    this.setStation("lobby", false);
    this.setupKeyboard();

    this.unsubscribeMove = gameEvents.on("movetostation", (event) => {
      this.setStation(event.detail.station, true);
    });

    this.unsubscribeDecision = gameEvents.on("decisionsubmitted", () => {
      this.playDecisionPulse();
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.unsubscribeMove?.();
      this.unsubscribeDecision?.();
    });
  }

  private drawOfficeShell() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xf6f2e9, 1);
    graphics.fillRoundedRect(48, 48, 1284, 684, 18);
    graphics.lineStyle(4, 0xb9c4cf, 1);
    graphics.strokeRoundedRect(48, 48, 1284, 684, 18);

    graphics.fillStyle(0xd5dce3, 0.88);
    graphics.fillRoundedRect(435, 365, 565, 92, 12);
    graphics.fillRoundedRect(520, 105, 96, 600, 12);
    graphics.fillRoundedRect(1010, 110, 92, 520, 12);
    graphics.strokeRoundedRect(435, 365, 565, 92, 12);
    graphics.strokeRoundedRect(520, 105, 96, 600, 12);
    graphics.strokeRoundedRect(1010, 110, 92, 520, 12);

    graphics.fillStyle(0xffffff, 0.68);
    graphics.fillRoundedRect(76, 72, 250, 56, 10);
    graphics.fillStyle(0x2b78c5, 1);
    graphics.fillCircle(112, 101, 15);
    graphics.fillStyle(0x3d8644, 1);
    graphics.fillCircle(135, 101, 15);

    this.add.text(168, 85, "مجموعة رواج للتجزئة", this.labelStyle(24, "#17202a", "900"));
    this.add.text(168, 112, "اجتماع اعتماد مكافآت الفروع", this.labelStyle(13, "#607083", "700"));

    this.add.text(1118, 82, "RIWAJ HQ", this.labelStyle(22, "#27313c", "900"));
    this.add.text(1118, 110, "Retail Group", this.labelStyle(13, "#607083", "700"));
  }

  private drawRooms() {
    stations.forEach((station) => {
      const room = this.add.rectangle(station.x, station.y, station.width, station.height, station.color, 1);
      room.setStrokeStyle(3, 0xffffff, 0.96);
      room.setInteractive({ useHandCursor: true });
      room.on("pointerdown", () => this.setStation(station.id, true));

      const highlight = this.add.rectangle(station.x, station.y, station.width + 12, station.height + 12, 0xffffff, 0);
      highlight.setStrokeStyle(4, 0x2b78c5, 0);
      this.stationHighlights.set(station.id, highlight);

      this.add.text(station.x - station.width / 2 + 22, station.y - station.height / 2 + 18, station.label, this.labelStyle(20));
      this.add.text(
        station.x - station.width / 2 + 22,
        station.y - station.height / 2 + 47,
        station.sublabel,
        this.labelStyle(12, "#607083", "700"),
      );

      const hotspot = this.addHotspot(station);
      this.hotspots.set(station.hotspot, hotspot);

      if (station.id === "sales") {
        const cabinet = this.addHotspot({
          ...station,
          hotspot: "repCabinet",
          propKey: undefined,
          label: "درج بطاقات المندوبين",
          x: station.x + 126,
          y: station.y + 42,
        });
        this.hotspots.set("repCabinet", cabinet);
      }
    });
  }

  private addHotspot(station: StationView): HotspotView {
    const propX = station.id === "decision" ? station.x + 10 : station.x + station.width / 2 - 86;
    const propY = station.id === "lobby" ? station.y + 20 : station.y + 22;
    const id = station.hotspot;
    const hotspot: HotspotView = { id, station: station.id, x: propX, y: propY, label: station.sublabel, propKey: station.propKey };

    if (station.propKey) {
      const prop = this.add.image(propX, propY, assetKeys[station.propKey]);
      prop.setInteractive({ useHandCursor: true });
      prop.setDepth(4);
      prop.on("pointerdown", () => this.interactWith(hotspot));
      prop.on("pointerover", () => this.showPrompt(hotspot));
      prop.on("pointerout", () => this.showPrompt());
      this.tweens.add({
        targets: prop,
        y: propY - 4,
        yoyo: true,
        repeat: -1,
        duration: 1100,
        ease: "Sine.easeInOut",
      });
    } else {
      const desk = this.add.rectangle(propX, propY, 128, 54, 0xffffff, 0.78);
      desk.setStrokeStyle(2, 0x9aa8b8, 0.75);
      desk.setInteractive({ useHandCursor: true });
      desk.on("pointerdown", () => this.interactWith(hotspot));
      desk.on("pointerover", () => this.showPrompt(hotspot));
      desk.on("pointerout", () => this.showPrompt());
      this.add.text(propX - 50, propY - 10, "تكليف", this.labelStyle(16, "#27313c", "900")).setDepth(5);
    }

    return hotspot;
  }

  private drawFurniture() {
    const graphics = this.add.graphics();

    // Analyst desk
    graphics.fillStyle(0x365f8c, 1);
    graphics.fillRoundedRect(158, 280, 130, 54, 9);
    graphics.fillStyle(0xffffff, 0.96);
    graphics.fillRoundedRect(190, 224, 82, 48, 7);
    graphics.fillStyle(0x9cc6e9, 1);
    graphics.fillRect(201, 234, 60, 28);

    // Sales desks and board area
    graphics.fillStyle(0xffffff, 0.82);
    [650, 725, 800].forEach((x) => graphics.fillRoundedRect(x, 302, 56, 54, 10));
    graphics.fillStyle(0xd28a56, 0.8);
    graphics.fillRoundedRect(838, 263, 132, 66, 9);

    // HR table
    graphics.fillStyle(0x7657a5, 0.86);
    graphics.fillRoundedRect(735, 654, 155, 52, 10);
    graphics.fillStyle(0xffffff, 0.86);
    graphics.fillRect(765, 672, 90, 8);

    // Decision table
    graphics.fillStyle(0x3d8644, 0.9);
    graphics.fillRoundedRect(1100, 480, 184, 92, 14);
    graphics.fillStyle(0xffffff, 0.92);
    graphics.fillCircle(1142, 526, 17);
    graphics.fillCircle(1190, 526, 17);
    graphics.fillCircle(1238, 526, 17);

    // Plants and office life.
    this.drawPlant(96, 660);
    this.drawPlant(410, 158);
    this.drawPlant(1290, 620);
  }

  private drawPlant(x: number, y: number) {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x7a5a37, 1);
    graphics.fillRoundedRect(x - 14, y + 12, 28, 24, 5);
    graphics.fillStyle(0x3d8644, 1);
    graphics.fillEllipse(x - 13, y + 4, 24, 44);
    graphics.fillEllipse(x + 12, y, 24, 44);
    graphics.fillEllipse(x, y - 12, 24, 48);
  }

  private drawNpcs() {
    this.drawNpc(875, 280, assetKeys.salesManager, "عماد", "مدير المبيعات");
    this.drawNpc(780, 612, assetKeys.hrManager, "ليلى", "مديرة HR");
    this.drawNpc(1180, 305, assetKeys.dataCoach, "نادر", "المدير المالي");
    this.animateWorker(this.drawNpc(510, 412, assetKeys.employee, "موظف", "عمليات", false), [
      { x: 510, y: 412 },
      { x: 650, y: 412 },
      { x: 730, y: 335 },
      { x: 610, y: 335 },
    ]);
    this.animateWorker(this.drawNpc(1050, 405, assetKeys.employee, "موظفة", "تنسيق", false), [
      { x: 1050, y: 405 },
      { x: 1110, y: 405 },
      { x: 1110, y: 520 },
      { x: 1010, y: 520 },
    ]);
  }

  private drawNpc(x: number, y: number, key: string, name: string, role: string, label = true) {
    const container = this.add.container(x, y).setDepth(y);
    const shadow = this.add.ellipse(0, 42, 58, 18, 0x17202a, 0.18);
    const sprite = this.add.image(0, 0, key);
    sprite.setOrigin(0.5, 0.82);
    container.add([shadow, sprite]);

    if (label) {
      const text = this.add.text(0, 66, `${name}\n${role}`, {
        ...this.textStyle(12, "#27313c", "800"),
        align: "center",
        backgroundColor: "rgba(255,255,255,0.78)",
        padding: { x: 7, y: 4 },
      });
      text.setOrigin(0.5);
      container.add(text);
    }

    this.tweens.add({
      targets: sprite,
      y: -3,
      yoyo: true,
      repeat: -1,
      duration: 1250,
      ease: "Sine.easeInOut",
    });

    return container;
  }

  private animateWorker(worker: Phaser.GameObjects.Container, points: Array<{ x: number; y: number }>) {
    let index = 1;
    const moveNext = () => {
      const point = points[index] ?? points[0];
      this.tweens.add({
        targets: worker,
        x: point.x,
        y: point.y,
        duration: 2600,
        hold: 900,
        ease: "Sine.easeInOut",
        onUpdate: () => worker.setDepth(worker.y),
        onComplete: () => {
          index = (index + 1) % points.length;
          moveNext();
        },
      });
    };
    moveNext();
  }

  private createPlayer() {
    const start = stationPoints.lobby;
    this.player = this.add.container(start.x, start.y).setDepth(start.y + 20);
    const shadow = this.add.ellipse(0, 45, 62, 19, 0x17202a, 0.2);
    const key = this.profile.avatar === "female" ? assetKeys.playerFemale : assetKeys.playerMale;
    this.playerSprite = this.add.image(0, 0, key);
    this.playerSprite.setOrigin(0.5, 0.82);
    this.player.add([shadow, this.playerSprite]);
    this.playerLabel = this.add.text(start.x, start.y + 70, this.profile.name, {
      ...this.textStyle(13, "#17202a", "900"),
      backgroundColor: "rgba(255,255,255,0.8)",
      padding: { x: 8, y: 4 },
    });
    this.playerLabel.setOrigin(0.5).setDepth(1000);

    this.tweens.add({
      targets: this.playerSprite,
      y: -3,
      yoyo: true,
      repeat: -1,
      duration: 950,
      ease: "Sine.easeInOut",
    });
  }

  private drawPrompt() {
    const bg = this.add.rectangle(0, 0, 190, 42, 0x17202a, 0.82);
    bg.setStrokeStyle(1, 0xffffff, 0.45);
    const text = this.add.text(0, 0, "انقر للتفاعل أو اضغط E", this.textStyle(13, "#ffffff", "800"));
    text.setOrigin(0.5);
    this.prompt = this.add.container(0, 0, [bg, text]).setDepth(2000).setVisible(false);
  }

  private setupKeyboard() {
    this.input.keyboard?.on("keydown-E", () => {
      const hotspot = this.hotspots.get(stations.find((station) => station.id === this.currentStation)?.hotspot ?? "reception");
      if (hotspot) {
        this.interactWith(hotspot);
      }
    });
  }

  private interactWith(hotspot: HotspotView) {
    this.setStation(hotspot.station, true, () => {
      gameEvents.emit("hotspotinteract", { hotspot: hotspot.id, station: hotspot.station });
      this.showPrompt(hotspot);
    });
  }

  private setStation(station: StationId, animate: boolean, onArrive?: () => void) {
    this.currentStation = station;
    stations.forEach((item) => {
      const highlight = this.stationHighlights.get(item.id);
      if (highlight) {
        highlight.setAlpha(item.id === station ? 1 : 0);
        highlight.setStrokeStyle(4, 0x2b78c5, item.id === station ? 0.95 : 0);
      }
    });

    const target = stationPoints[station];
    if (this.player && this.playerLabel) {
      if (animate) {
        this.movePlayerTo(target, onArrive);
      } else {
        this.player.setPosition(target.x, target.y);
        this.player.setDepth(target.y + 20);
        this.playerLabel.setPosition(target.x, target.y + 70);
        onArrive?.();
      }
    }

    gameEvents.emit("stationchange", { station });
    this.showPrompt();
  }

  private movePlayerTo(target: { x: number; y: number }, onArrive?: () => void) {
    if (!this.player || !this.playerLabel || this.moving) return;

    this.moving = true;
    const path = this.add.graphics().setDepth(3);
    path.lineStyle(4, 0x2b78c5, 0.25);
    path.lineBetween(this.player.x, this.player.y + 35, target.x, target.y + 35);
    const marker = this.add.circle(target.x, target.y + 36, 12, 0x2b78c5, 0.32).setDepth(4);
    const flip = target.x < this.player.x ? -1 : 1;
    this.playerSprite?.setScale(flip, 1);

    this.tweens.add({
      targets: this.player,
      x: target.x,
      y: target.y,
      duration: Phaser.Math.Clamp(Phaser.Math.Distance.Between(this.player.x, this.player.y, target.x, target.y) * 2.1, 520, 1350),
      ease: "Sine.easeInOut",
      onUpdate: () => {
        if (this.player && this.playerLabel) {
          this.player.setDepth(this.player.y + 20);
          this.playerLabel.setPosition(this.player.x, this.player.y + 70);
        }
      },
      onComplete: () => {
        this.moving = false;
        path.destroy();
        marker.destroy();
        onArrive?.();
      },
    });
  }

  private showPrompt(hotspot?: HotspotView) {
    if (!this.prompt) return;
    if (!hotspot) {
      this.prompt.setVisible(false);
      return;
    }
    this.prompt.setPosition(hotspot.x, hotspot.y - 78);
    this.prompt.setVisible(true);
  }

  private playDecisionPulse() {
    const station = stations.find((item) => item.id === "decision");
    if (!station) return;

    const pulse = this.add.circle(station.x, station.y, 30, 0x3d8644, 0.35).setDepth(1500);
    this.tweens.add({
      targets: pulse,
      radius: 220,
      alpha: 0,
      duration: 800,
      ease: "Quad.easeOut",
      onComplete: () => pulse.destroy(),
    });
  }

  private labelStyle(size = 16, color = "#17202a", weight = "900") {
    return {
      color,
      fontFamily: "Tajawal, Inter, Arial, sans-serif",
      fontSize: `${size}px`,
      fontStyle: weight,
    };
  }

  private textStyle(size = 14, color = "#17202a", weight = "700") {
    return {
      color,
      fontFamily: "Tajawal, Inter, Arial, sans-serif",
      fontSize: `${size}px`,
      fontStyle: weight,
    };
  }
}
