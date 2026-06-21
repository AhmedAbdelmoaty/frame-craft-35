import Phaser from "phaser";
import { gameEvents } from "../game/events";
import type { PlayerProfile, RoomId } from "../game/types";
import {
  buildMeetingPresentation,
  type MeetingDialogueLine,
  type MeetingSpeakerId,
} from "../level1/logic/meetingPresentation";
import { openEvidencePreview } from "../level1/components/EvidencePreview";
import { openCinematicDialogue, type CinematicDialogueLine } from "../level1/components/CinematicDialogue";
import {
  enterAnalysisRoom,
  getState,
  inspectHRPolicy,
  inspectSalesBoard,
  isGameOver,
  receiveIndividualPerformanceFile,
  saveHRPolicy,
  saveSalesSummary,
  setMeetingStage,
  submitRecommendation,
  subscribe,
  visitHR,
  visitSales,
} from "../level1/state/store";
import { DeadlineCompanion } from "./DeadlineCompanion";

type PlayableRoomId = Extract<RoomId, "office" | "sales" | "hr" | "decision" | "meeting">;
type HotspotAction =
  | "npc"
  | "salesBoard"
  | "salesSummary"
  | "repFile"
  | "hrPolicy"
  | "analystComputer"
  | "decisionBoard"
  | "meetingTable";

type RoomHotspot = {
  id: HotspotAction;
  x: number;
  y: number;
  label: string;
  kind: "npc" | "board" | "file" | "folder" | "computer" | "table";
  asset?: string;
};

type RoomPerson = {
  speakerId?: Exclude<MeetingSpeakerId, "player">;
  name: string;
  role: string;
  asset: string;
  x: number;
  y: number;
};

type RoomConfig = {
  id: PlayableRoomId;
  title: string;
  subtitle: string;
  color: number;
  accent: number;
  npc: {
    name: string;
    role: string;
    asset: string;
    lines: string[];
  } | null;
  people?: RoomPerson[];
  hotspots: RoomHotspot[];
  spawn: { x: number; y: number };
};

const assetKeys = {
  playerFemale: "character.player.female",
  playerMale: "character.player.male",
  hrManager: "character.hr",
  salesManager: "character.sales",
  dataCoach: "character.coach",
  summaryReport: "prop.summaryReport",
  hrFolder: "prop.hrFolder",
  salesBoard: "prop.salesBoard",
  decisionBoard: "prop.decisionBoard",
  notebook: "prop.notebook",
} as const;

const assetSources: Record<string, { path: string; width: number; height: number }> = {
  [assetKeys.playerFemale]: { path: "/assets/characters/player-female.svg", width: 86, height: 128 },
  [assetKeys.playerMale]: { path: "/assets/characters/player-male.svg", width: 86, height: 128 },
  [assetKeys.hrManager]: { path: "/assets/characters/hr-manager.svg", width: 78, height: 118 },
  [assetKeys.salesManager]: { path: "/assets/characters/sales-manager.svg", width: 78, height: 118 },
  [assetKeys.dataCoach]: { path: "/assets/characters/data-coach.svg", width: 74, height: 112 },
  [assetKeys.summaryReport]: { path: "/assets/props/summary-report.svg", width: 62, height: 62 },
  [assetKeys.hrFolder]: { path: "/assets/props/hr-folder.svg", width: 66, height: 66 },
  [assetKeys.salesBoard]: { path: "/assets/props/sales-board.svg", width: 110, height: 82 },
  [assetKeys.decisionBoard]: { path: "/assets/props/decision-board.svg", width: 112, height: 84 },
  [assetKeys.notebook]: { path: "/assets/props/notebook.svg", width: 56, height: 56 },
};

const ROOM_CONFIGS: Record<PlayableRoomId, RoomConfig> = {
  office: {
    id: "office",
    title: "مكتب المحلل",
    subtitle: "طاولة التحليل · histogram + tools",
    color: 0xddebf5,
    accent: 0x2b78c5,
    spawn: { x: 255, y: 620 },
    npc: null,
    hotspots: [
      { id: "analystComputer", x: 640, y: 395, label: "افتح طاولة التحليل", kind: "computer", asset: assetKeys.notebook },
    ],
  },
  sales: {
    id: "sales",
    title: "مكتب المبيعات",
    subtitle: "عماد · لوحة الأداء",
    color: 0xf3dfcf,
    accent: 0x2b78c5,
    spawn: { x: 255, y: 620 },
    npc: {
      name: "عماد",
      role: "مدير المبيعات",
      asset: assetKeys.salesManager,
      lines: [
        "الأرقام الرسمية على اللوحة. خذ الملفات التي تحتاجها قبل الاجتماع.",
        "ملف الأداء الفردي على المكتب، وسيفيدك داخل التحليل.",
      ],
    },
    hotspots: [
      { id: "npc", x: 950, y: 350, label: "تحدث مع عماد", kind: "npc" },
      { id: "salesBoard", x: 620, y: 270, label: "افحص لوحة المبيعات", kind: "board", asset: assetKeys.salesBoard },
      { id: "salesSummary", x: 620, y: 470, label: "استلام ملخص المبيعات", kind: "file", asset: assetKeys.summaryReport },
      { id: "repFile", x: 420, y: 470, label: "استلام ملف الأداء الفردي", kind: "file", asset: assetKeys.hrFolder },
    ],
  },
  hr: {
    id: "hr",
    title: "مكتب الموارد البشرية",
    subtitle: "ليلى · سياسة الأداء",
    color: 0xe8e0f4,
    accent: 0x7b55bb,
    spawn: { x: 255, y: 620 },
    npc: {
      name: "ليلى",
      role: "مديرة HR",
      asset: assetKeys.hrManager,
      lines: [
        "المكافأة الجماعية يجب أن تكون قابلة للتبرير.",
        "سياسة الأداء على المكتب. خذها معك قبل بناء التوصية.",
      ],
    },
    hotspots: [
      { id: "npc", x: 930, y: 350, label: "تحدث مع ليلى", kind: "npc" },
      { id: "hrPolicy", x: 600, y: 455, label: "استلام سياسة الأداء", kind: "folder", asset: assetKeys.hrFolder },
    ],
  },
  decision: {
    id: "decision",
    title: "غرفة القرار",
    subtitle: "لوحة التوصية · اختيار الفرع والأدلة",
    color: 0xfdf2d6,
    accent: 0xc48a2c,
    spawn: { x: 255, y: 620 },
    npc: null,
    hotspots: [
      { id: "decisionBoard", x: 650, y: 350, label: "جهّز التوصية", kind: "board", asset: assetKeys.decisionBoard },
    ],
  },
  meeting: {
    id: "meeting",
    title: "غرفة الاجتماع",
    subtitle: "نادر · عماد · ليلى",
    color: 0xe0f0dc,
    accent: 0x3d8644,
    spawn: { x: 255, y: 620 },
    npc: null,
    people: [
      { speakerId: "nader", name: "نادر", role: "CEO", asset: assetKeys.dataCoach, x: 520, y: 320 },
      { speakerId: "emad", name: "عماد", role: "مدير المبيعات", asset: assetKeys.salesManager, x: 760, y: 318 },
      { speakerId: "layla", name: "ليلى", role: "مديرة HR", asset: assetKeys.hrManager, x: 930, y: 440 },
    ],
    hotspots: [
      { id: "meetingTable", x: 700, y: 460, label: "قدّم التوصية", kind: "table", asset: assetKeys.decisionBoard },
    ],
  },
};

const ROOM_BOUNDS = new Phaser.Geom.Rectangle(180, 210, 1020, 430);
const INTERACTION_DISTANCE = 90;

export class PlayableRoomScene extends Phaser.Scene {
  private roomId: PlayableRoomId = "sales";
  private config: RoomConfig = ROOM_CONFIGS.sales;
  private player?: Phaser.GameObjects.Container;
  private playerSprite?: Phaser.GameObjects.Image;
  private prompt?: Phaser.GameObjects.Container;
  private promptBg?: Phaser.GameObjects.Rectangle;
  private promptText?: Phaser.GameObjects.Text;
  private bubble?: Phaser.GameObjects.Container;
  private dialogueBubble?: Phaser.GameObjects.Container;
  private cinematicDialogue?: { close: () => void };
  private hotspots = new Map<HotspotAction, RoomHotspot>();
  private hotspotViews = new Map<HotspotAction, Phaser.GameObjects.Container>();
  private hotspotLabels = new Map<HotspotAction, Phaser.GameObjects.Text>();
  private speakerViews = new Map<MeetingDialogueLine["speaker"], Phaser.GameObjects.Container>();
  private meetingDialogue: MeetingDialogueLine[] = [];
  private meetingDialogueIndex = -1;
  private meetingDialogueActive = false;
  private meetingReportPlaced = false;
  private moveTween?: Phaser.Tweens.Tween;
  private moveCleanup?: () => void;
  private moveToken = 0;
  private bubbleTimer?: Phaser.Time.TimerEvent;
  private deadline?: DeadlineCompanion;
  private meetingReportProp?: Phaser.GameObjects.Image;
  private unsubscribeStore?: () => void;
  private unsubscribeClose?: () => void;
  private unsubscribeTimeout?: () => void;
  private unsubscribeDecisionPrepared?: () => void;
  private unsubscribeMeetingReportReviewed?: () => void;
  private readonly handleRoomPointerDown = (
    pointer: Phaser.Input.Pointer,
    objects: Phaser.GameObjects.GameObject[],
  ) => {
    if (this.meetingDialogueActive) {
      return;
    }
    if (isGameOver() || objects.length > 0) return;
    const x = Phaser.Math.Clamp(pointer.worldX, ROOM_BOUNDS.left, ROOM_BOUNDS.right);
    const y = Phaser.Math.Clamp(pointer.worldY, ROOM_BOUNDS.top, ROOM_BOUNDS.bottom);
    this.movePlayerTo({ x, y });
  };
  private readonly handleInteractKey = () => {
    if (this.meetingDialogueActive) {
      return;
    }
    if (isGameOver()) return;
    const nearest = this.nearestHotspot();
    if (nearest) this.moveToHotspot(nearest);
  };

  constructor(private readonly profile: PlayerProfile) {
    super("PlayableRoomScene");
  }

  init(data: { roomId?: PlayableRoomId }) {
    this.roomId = data.roomId ?? "sales";
    this.config = ROOM_CONFIGS[this.roomId] ?? ROOM_CONFIGS.sales;
  }

  preload() {
    Object.entries(assetSources).forEach(([key, source]) => {
      if (!this.textures.exists(key)) {
        this.load.svg(key, source.path, { width: source.width, height: source.height });
      }
    });
  }

  create() {
    if (this.roomId === "sales") visitSales();
    if (this.roomId === "hr") visitHR();

    this.cameras.main.setBackgroundColor("#e9edf2");
    this.drawRoom();
    this.createPeople();
    this.createHotspots();
    this.createPlayer();
    if (this.player) this.deadline = new DeadlineCompanion(this, this.player);
    this.createPrompt();
    this.setupInput();
    this.refreshHotspots();

    if (this.roomId === "meeting" && getState().hasPreparedDecision && getState().meetingStage !== "intro") {
      this.ensureMeetingReportPlaced(false);
    }

    this.unsubscribeStore = subscribe(() => this.refreshHotspots());
    this.unsubscribeClose = gameEvents.on("closePlayableRoom", () => this.closeScene());
    this.unsubscribeTimeout = gameEvents.on("timeout", () => {
      this.cancelMove();
      this.clearBubble();
      this.clearDialogueBubble();
      this.cinematicDialogue?.close();
      this.meetingDialogueActive = false;
      this.input.enabled = false;
      this.deadline?.pounce();
    });
    this.unsubscribeDecisionPrepared = gameEvents.on("decisionPreparedForMeeting", () => {
      if (this.roomId === "decision") {
        this.showBubble(["تم تجهيز التوصية للاجتماع."], 650, 255);
      }
    });
    this.unsubscribeMeetingReportReviewed = gameEvents.on("meetingReportReviewed", () => {
      if (this.roomId === "meeting" && !isGameOver()) {
        this.startMeetingDialogue();
      }
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.unsubscribeStore?.();
      this.unsubscribeClose?.();
      this.unsubscribeTimeout?.();
      this.unsubscribeDecisionPrepared?.();
      this.unsubscribeMeetingReportReviewed?.();
      this.input.off("pointerdown", this.handleRoomPointerDown);
      this.input.keyboard?.off("keydown-E", this.handleInteractKey);
      this.cancelMove();
      this.clearBubble();
      this.clearDialogueBubble();
    });
  }

  private drawRoom() {
    const g = this.add.graphics();
    g.fillStyle(0xf7f4ea, 1);
    g.fillRoundedRect(110, 150, 1160, 560, 18);
    g.lineStyle(5, 0xb9c4cf, 1);
    g.strokeRoundedRect(110, 150, 1160, 560, 18);

    g.fillStyle(this.config.color, 1);
    g.fillRoundedRect(170, 205, 1040, 450, 16);
    g.lineStyle(4, 0xffffff, 0.92);
    g.strokeRoundedRect(170, 205, 1040, 450, 16);

    g.fillStyle(0xd7dee7, 0.9);
    g.fillRoundedRect(210, 610, 170, 34, 10);
    g.lineStyle(2, 0xaebac6, 1);
    g.strokeRoundedRect(210, 610, 170, 34, 10);

    this.add.text(690, 96, this.config.title, this.labelStyle(30, "#17202a", "900")).setOrigin(0.5);
    this.add.text(690, 132, this.config.subtitle, this.labelStyle(15, "#607083", "800")).setOrigin(0.5);
    this.add.text(295, 627, "باب الخريطة", this.labelStyle(13, "#607083", "800")).setOrigin(0.5);

    if (this.roomId === "meeting") {
      this.drawMeetingTable(700, 455);
    } else {
      this.drawDesk(565, 495, 315, 82);
    }
    if (this.roomId === "office") this.drawMonitor(640, 395);
    if (this.roomId === "sales") this.drawDesk(620, 290, 360, 78);
    if (this.roomId === "hr") this.drawDesk(600, 470, 300, 78);
    if (this.roomId === "decision") this.drawDecisionTable(650, 390);
    this.drawPlant(1130, 575);
    this.drawPlant(245, 255);
  }

  private drawDesk(x: number, y: number, w: number, h: number) {
    const desk = this.add.rectangle(x, y, w, h, 0xffffff, 0.72);
    desk.setStrokeStyle(2, 0xb8c3cf, 0.9);
    desk.setDepth(y - 20);
  }

  private drawMonitor(x: number, y: number) {
    const screen = this.add.rectangle(x, y - 42, 158, 86, 0x162537, 0.96);
    screen.setStrokeStyle(4, 0xffffff, 0.92);
    screen.setDepth(y - 24);
    this.add.rectangle(x, y + 11, 42, 10, 0x7d8ca0, 1).setDepth(y - 18);
    this.add.rectangle(x, y + 24, 86, 12, 0xb7c3d0, 1).setDepth(y - 17);
    [34, 58, 44, 72, 50, 62].forEach((h, i) => {
      this.add.rectangle(x - 55 + i * 22, y - 12 - h / 2, 11, h, i % 2 ? 0x3d8644 : 0x2b78c5, 0.88).setDepth(y - 15);
    });
  }

  private drawDecisionTable(x: number, y: number) {
    this.drawDesk(x, y, 340, 92);
    this.add.rectangle(x, y - 64, 210, 90, 0xfffbef, 0.9).setStrokeStyle(3, 0xc48a2c, 0.7).setDepth(y - 30);
    this.add.circle(x - 62, y - 64, 13, 0x2b78c5, 0.9).setDepth(y - 20);
    this.add.circle(x, y - 64, 13, 0x3d8644, 0.9).setDepth(y - 20);
    this.add.circle(x + 62, y - 64, 13, 0xc56b2b, 0.9).setDepth(y - 20);
  }

  private drawMeetingTable(x: number, y: number) {
    const table = this.add.ellipse(x, y, 430, 170, 0xffffff, 0.82);
    table.setStrokeStyle(4, 0x9fb7a0, 0.85);
    table.setDepth(y - 50);
    this.add.rectangle(x, y, 320, 26, 0xcad8cf, 0.6).setDepth(y - 48);
  }

  private drawPlant(x: number, y: number) {
    const g = this.add.graphics();
    g.fillStyle(0x7a5a37, 1);
    g.fillRoundedRect(x - 12, y + 18, 24, 22, 5);
    g.fillStyle(0x3d8644, 1);
    g.fillEllipse(x - 10, y + 8, 22, 38);
    g.fillEllipse(x + 10, y + 4, 22, 38);
    g.fillEllipse(x, y - 6, 24, 44);
    g.setDepth(y + 20);
  }

  private createPeople() {
    this.config.people?.forEach((person) => {
      const container = this.add.container(person.x, person.y).setDepth(person.y + 8);
      const shadow = this.add.ellipse(0, 42, 58, 18, 0x17202a, 0.18);
      const sprite = this.add.image(0, 0, person.asset);
      sprite.setOrigin(0.5, 0.82);
      const label = this.add.text(0, 66, `${person.name}\n${person.role}`, {
        ...this.textStyle(12, "#27313c", "800"),
        align: "center",
        backgroundColor: "rgba(255,255,255,0.82)",
        padding: { x: 8, y: 4 },
      }).setOrigin(0.5);
      container.add([shadow, sprite, label]);
      this.tweens.add({ targets: sprite, y: -3, yoyo: true, repeat: -1, duration: 1200, ease: "Sine.easeInOut" });
      if (person.speakerId) this.speakerViews.set(person.speakerId, container);
    });
  }

  private createHotspots() {
    this.hotspots.clear();
    this.hotspotViews.clear();
    this.hotspotLabels.clear();

    this.config.hotspots.forEach((hotspot) => {
      this.hotspots.set(hotspot.id, hotspot);
      const container = this.add.container(hotspot.x, hotspot.y).setDepth(hotspot.y + 4);
      const halo = this.add.circle(0, 44, 34, this.config.accent, 0.1);
      halo.setStrokeStyle(2, this.config.accent, 0.3);
      container.add(halo);

      if (hotspot.kind === "npc") {
        if (!this.config.npc) return;
        const shadow = this.add.ellipse(0, 45, 58, 18, 0x17202a, 0.18);
        const sprite = this.add.image(0, 0, this.config.npc.asset);
        sprite.setOrigin(0.5, 0.82);
        const npcLabel = this.add.text(0, 68, `${this.config.npc.name}\n${this.config.npc.role}`, {
          ...this.textStyle(12, "#27313c", "800"),
          align: "center",
          backgroundColor: "rgba(255,255,255,0.82)",
          padding: { x: 8, y: 4 },
        }).setOrigin(0.5);
        container.add([shadow, sprite, npcLabel]);
        this.tweens.add({ targets: sprite, y: -3, yoyo: true, repeat: -1, duration: 1200, ease: "Sine.easeInOut" });
      } else if (hotspot.asset) {
        const sprite = this.add.image(0, 0, hotspot.asset);
        sprite.setOrigin(0.5);
        container.add(sprite);
        this.tweens.add({ targets: sprite, y: -4, yoyo: true, repeat: -1, duration: 1100, ease: "Sine.easeInOut" });
      }

      const label = this.add.text(0, 72, hotspot.label, {
        ...this.textStyle(12, "#17202a", "900"),
        align: "center",
        backgroundColor: "rgba(255,255,255,0.78)",
        padding: { x: 8, y: 4 },
      }).setOrigin(0.5);
      if (hotspot.kind !== "npc") container.add(label);

      container.setSize(130, 120);
      container.setInteractive({ useHandCursor: true });
      container.on("pointerdown", () => this.moveToHotspot(hotspot));
      container.on("pointerover", () => this.showPrompt(hotspot));
      container.on("pointerout", () => this.showPrompt());
      this.hotspotViews.set(hotspot.id, container);
      if (hotspot.kind !== "npc") this.hotspotLabels.set(hotspot.id, label);
    });
  }

  private createPlayer() {
    const start = this.config.spawn;
    this.player = this.add.container(start.x, start.y).setDepth(start.y + 20);
    const shadow = this.add.ellipse(0, 45, 62, 19, 0x17202a, 0.2);
    const key = this.profile.avatar === "female" ? assetKeys.playerFemale : assetKeys.playerMale;
    this.playerSprite = this.add.image(0, 0, key);
    this.playerSprite.setOrigin(0.5, 0.82);
    const label = this.add.text(0, 72, this.profile.name, {
      ...this.textStyle(13, "#17202a", "900"),
      backgroundColor: "rgba(255,255,255,0.82)",
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5);
    this.player.add([shadow, this.playerSprite, label]);
    this.speakerViews.set("player", this.player);
    this.tweens.add({ targets: this.playerSprite, y: -3, yoyo: true, repeat: -1, duration: 950, ease: "Sine.easeInOut" });
  }

  private createPrompt() {
    const bg = this.add.rectangle(0, 0, 260, 42, 0x17202a, 0.86);
    bg.setStrokeStyle(1, 0xffffff, 0.45);
    const text = this.add.text(0, 0, "انقر للتفاعل أو اضغط E", this.textStyle(13, "#ffffff", "800"));
    text.setOrigin(0.5);
    this.promptBg = bg;
    this.promptText = text;
    this.prompt = this.add.container(0, 0, [bg, text]).setDepth(4000).setVisible(false);
  }

  private setupInput() {
    this.input.enabled = true;
    this.input.off("pointerdown", this.handleRoomPointerDown);
    this.input.keyboard?.off("keydown-E", this.handleInteractKey);
    this.input.on("pointerdown", this.handleRoomPointerDown);
    this.input.keyboard?.on("keydown-E", this.handleInteractKey);
  }

  private moveToHotspot(hotspot: RoomHotspot) {
    if (isGameOver() || this.meetingDialogueActive) return;
    const target = {
      x: Phaser.Math.Clamp(hotspot.x - 42, ROOM_BOUNDS.left, ROOM_BOUNDS.right),
      y: Phaser.Math.Clamp(hotspot.y + 60, ROOM_BOUNDS.top, ROOM_BOUNDS.bottom),
    };
    this.movePlayerTo(target, () => this.interact(hotspot));
  }

  private movePlayerTo(target: { x: number; y: number }, onArrive?: () => void) {
    if (!this.player) return;
    this.cancelMove();
    this.clearBubble();
    const token = ++this.moveToken;
    const path = this.add.graphics().setDepth(3);
    path.lineStyle(3, this.config.accent, 0.22);
    path.lineBetween(this.player.x, this.player.y + 35, target.x, target.y + 35);
    const marker = this.add.circle(target.x, target.y + 36, 10, this.config.accent, 0.28).setDepth(4);
    this.moveCleanup = () => {
      path.destroy();
      marker.destroy();
    };
    this.playerSprite?.setScale(target.x < this.player.x ? -1 : 1, 1);
    this.moveTween = this.tweens.add({
      targets: this.player,
      x: target.x,
      y: target.y,
      duration: Phaser.Math.Clamp(
        Phaser.Math.Distance.Between(this.player.x, this.player.y, target.x, target.y) * 2.1,
        360,
        1100,
      ),
      ease: "Sine.easeInOut",
      onUpdate: () => this.player?.setDepth(this.player.y + 20),
      onComplete: () => {
        this.moveTween = undefined;
        this.moveCleanup?.();
        this.moveCleanup = undefined;
        if (token === this.moveToken && !isGameOver()) onArrive?.();
      },
    });
  }

  private interact(hotspot: RoomHotspot) {
    if (isGameOver()) return;
    this.showPrompt(hotspot);

    if (hotspot.id === "npc") {
      if (this.config.npc) {
        this.openNpcDialogue();
      }
      return;
    }

    if (hotspot.id === "analystComputer") {
      if (!getState().hasReceivedIndividualPerformanceFile) {
        this.showBubble(["لا يوجد ملف أداء للتحليل بعد."], hotspot.x, hotspot.y - 90);
        return;
      }
      enterAnalysisRoom();
      gameEvents.emit("openRoomOverlay", { roomId: "office" });
      return;
    }

    if (hotspot.id === "decisionBoard") {
      gameEvents.emit("openRoomOverlay", { roomId: "decision" });
      return;
    }

    if (hotspot.id === "meetingTable") {
      if (!getState().hasPreparedDecision) {
        this.showBubble(["لا توجد توصية جاهزة. اذهب إلى غرفة القرار أولًا."], hotspot.x, hotspot.y - 90);
        return;
      }
      const presentation = buildMeetingPresentation(getState().preparedBranch, getState().preparedEvidenceIds);
      if (!presentation) {
        this.showBubble(["التوصية غير مكتملة بعد."], hotspot.x, hotspot.y - 90);
        return;
      }
      this.ensureMeetingReportPlaced();
      setMeetingStage("report_open");
      gameEvents.emit("openRoomOverlay", { roomId: "meeting" });
      return;
    }

    if (hotspot.id === "salesBoard") {
      inspectSalesBoard();
      openEvidencePreview({
        kind: "sales-summary",
        alreadyCollected: getState().hasSavedSalesSummary,
        onCollect: saveSalesSummary,
      });
      return;
    }

    if (hotspot.id === "salesSummary") {
      openEvidencePreview({
        kind: "sales-summary",
        alreadyCollected: getState().hasSavedSalesSummary,
        onCollect: saveSalesSummary,
      });
      return;
    }

    if (hotspot.id === "repFile") {
      openEvidencePreview({
        kind: "rep-performance",
        alreadyCollected: getState().hasReceivedIndividualPerformanceFile,
        onCollect: receiveIndividualPerformanceFile,
      });
      return;
    }

    if (hotspot.id === "hrPolicy") {
      inspectHRPolicy();
      openEvidencePreview({
        kind: "hr-policy",
        alreadyCollected: getState().hasSavedHRPolicy,
        onCollect: saveHRPolicy,
      });
    }
  }

  private showBubble(lines: string[], x: number, y: number) {
    this.clearBubble();
    let index = 0;
    const bg = this.add.rectangle(0, 0, 390, 78, 0x0f1e2e, 0.96);
    bg.setStrokeStyle(1, 0xffffff, 0.28);
    const text = this.add.text(0, 0, lines[index], {
      ...this.textStyle(17, "#ffffff", "800"),
      align: "center",
      wordWrap: { width: 340 },
      lineSpacing: 5,
    }).setOrigin(0.5);
    this.bubble = this.add.container(x, y, [bg, text]).setDepth(5000);
    const activeBubble = this.bubble;

    const showNext = () => {
      if (this.bubble !== activeBubble || !text.active) return;
      index += 1;
      if (index >= lines.length) {
        this.clearBubble();
        return;
      }
      text.setText(lines[index]);
      this.bubbleTimer = this.time.delayedCall(2400, showNext);
    };

    this.bubbleTimer = this.time.delayedCall(lines.length > 1 ? 2400 : 2200, showNext);
  }

  private clearBubble() {
    this.bubbleTimer?.remove(false);
    this.bubbleTimer = undefined;
    this.bubble?.destroy();
    this.bubble = undefined;
  }

  private showPrompt(hotspot?: RoomHotspot) {
    if (!this.prompt || !this.promptText || !this.promptBg || this.meetingDialogueActive) return;
    if (!hotspot || isGameOver()) {
      this.prompt.setVisible(false);
      return;
    }
    this.promptText.setText(hotspot.label);
    this.promptBg.width = Math.max(180, this.promptText.width + 40);
    this.prompt.setPosition(hotspot.x, hotspot.y - 82);
    this.prompt.setVisible(true);
  }

  private nearestHotspot() {
    if (!this.player) return null;
    let best: RoomHotspot | null = null;
    let bestDist = Infinity;
    this.hotspots.forEach((hotspot) => {
      const dist = Phaser.Math.Distance.Between(this.player!.x, this.player!.y, hotspot.x, hotspot.y);
      if (dist < bestDist) {
        best = hotspot;
        bestDist = dist;
      }
    });
    return bestDist <= INTERACTION_DISTANCE ? best : null;
  }

  private refreshHotspots() {
    const s = getState();
    this.setHotspotDone("salesBoard", s.hasInspectedSalesBoard);
    this.setHotspotDone("salesSummary", s.hasSavedSalesSummary);
    this.setHotspotDone("repFile", s.hasReceivedIndividualPerformanceFile);
    this.setHotspotDone("hrPolicy", s.hasSavedHRPolicy);
    this.setHotspotDone("analystComputer", s.hasOpenedPerformanceCards || s.hasEnteredAnalysisRoom);
    this.setHotspotDone("decisionBoard", s.hasPreparedDecision);
    this.setHotspotDone("meetingTable", s.finalOutcome !== null);

    if (this.roomId === "meeting") {
      if (s.hasPreparedDecision && s.meetingStage !== "intro") {
        this.ensureMeetingReportPlaced(false);
      }
      if (!s.hasPreparedDecision) {
        this.meetingReportPlaced = false;
        this.meetingReportProp?.destroy();
        this.meetingReportProp = undefined;
        this.setHotspotLabel("meetingTable", "قدّم التوصية");
      }
    }
  }

  private setHotspotDone(id: HotspotAction, done: boolean) {
    const view = this.hotspotViews.get(id);
    if (!view) return;
    view.setAlpha(done ? 0.66 : 1);
    const halo = view.list[0] as Phaser.GameObjects.Arc | undefined;
    if (halo?.setFillStyle) {
      halo.setFillStyle(done ? 0x2f8a4e : this.config.accent, done ? 0.18 : 0.1);
      halo.setStrokeStyle(2, done ? 0x2f8a4e : this.config.accent, done ? 0.55 : 0.3);
    }
  }

  private setHotspotLabel(id: HotspotAction, label: string) {
    const hotspot = this.hotspots.get(id);
    if (hotspot) hotspot.label = label;
    this.hotspotLabels.get(id)?.setText(label);
  }

  private ensureMeetingReportPlaced(animate = true) {
    if (this.roomId !== "meeting") return;
    this.meetingReportPlaced = true;
    this.setHotspotLabel("meetingTable", "افتح التقرير");

    if (!this.meetingReportProp) {
      this.meetingReportProp = this.add.image(700, 438, assetKeys.summaryReport);
      this.meetingReportProp.setScale(1.1);
      this.meetingReportProp.setAngle(-10);
      this.meetingReportProp.setDepth(420);
    }

    this.meetingReportProp.setVisible(true);
    if (animate) {
      this.tweens.add({
        targets: this.meetingReportProp,
        y: this.meetingReportProp.y - 6,
        yoyo: true,
        repeat: 1,
        duration: 170,
        ease: "Sine.easeOut",
      });
    }
  }

  private startMeetingDialogue() {
    if (this.roomId !== "meeting" || isGameOver() || this.meetingDialogueActive) return;
    const presentation = buildMeetingPresentation(getState().preparedBranch, getState().preparedEvidenceIds);
    if (!presentation) return;

    this.clearBubble();
    this.clearDialogueBubble();
    this.cinematicDialogue?.close();
    this.meetingDialogue = presentation.dialogue;
    this.meetingDialogueIndex = -1;
    this.meetingDialogueActive = true;
    setMeetingStage("dialogue");
    this.showPrompt();
    this.cinematicDialogue = openCinematicDialogue({
      lines: this.meetingDialogue.map((line) => this.toCinematicLine(line)),
      onComplete: () => this.finishMeetingDialogue(),
      onClose: () => {
        this.meetingDialogueActive = false;
        this.meetingDialogue = [];
        this.meetingDialogueIndex = -1;
        this.highlightSpeaker();
        setMeetingStage("report_open");
      },
    });
  }

  private advanceMeetingDialogue() {
    if (!this.meetingDialogueActive || isGameOver()) return;
    this.meetingDialogueIndex += 1;

    if (this.meetingDialogueIndex >= this.meetingDialogue.length) {
      this.finishMeetingDialogue();
      return;
    }

    this.showDialogueLine(this.meetingDialogue[this.meetingDialogueIndex]);
  }

  private showDialogueLine(line: MeetingDialogueLine) {
    this.clearDialogueBubble();

    const speakerView = this.speakerViews.get(line.speaker);
    if (!speakerView) return;

    this.highlightSpeaker(line.speaker);

    const bubbleX = Phaser.Math.Clamp(speakerView.x, 330, 1050);
    const bubbleY = Phaser.Math.Clamp(speakerView.y - 108, 170, 520);
    const width = 420;
    const bg = this.add.rectangle(0, 0, width, 118, 0x0f1e2e, 0.97);
    bg.setStrokeStyle(1, 0xffffff, 0.28);

    const who = this.add.text(0, -36, this.speakerName(line.speaker), {
      ...this.textStyle(12, "#f3c66b", "900"),
      backgroundColor: "rgba(255,255,255,0.1)",
      padding: { x: 10, y: 4 },
    }).setOrigin(0.5);

    const text = this.add.text(0, 4, line.text, {
      ...this.textStyle(16, "#ffffff", "800"),
      align: "center",
      wordWrap: { width: width - 46 },
      lineSpacing: 5,
    }).setOrigin(0.5);

    const hint = this.add.text(0, 42, "اضغط E أو انقر للمتابعة", {
      ...this.textStyle(11, "#d0d7de", "700"),
    }).setOrigin(0.5);

    this.dialogueBubble = this.add.container(bubbleX, bubbleY, [bg, who, text, hint]).setDepth(5500);
  }

  private clearDialogueBubble() {
    this.dialogueBubble?.destroy();
    this.dialogueBubble = undefined;
    this.highlightSpeaker();
  }

  private highlightSpeaker(active?: MeetingDialogueLine["speaker"]) {
    this.speakerViews.forEach((view, key) => {
      const isActive = active === key;
      view.setAlpha(active ? (isActive ? 1 : 0.72) : 1);
      view.setScale(active ? (isActive ? 1.05 : 1) : 1);
    });
  }

  private finishMeetingDialogue() {
    const presentation = buildMeetingPresentation(getState().preparedBranch, getState().preparedEvidenceIds);
    this.meetingDialogueActive = false;
    this.meetingDialogue = [];
    this.meetingDialogueIndex = -1;
    this.clearDialogueBubble();
    this.cinematicDialogue = undefined;
    this.highlightSpeaker();

    if (!presentation) return;

    submitRecommendation(
      presentation.evaluation.outcome,
      presentation.evaluation.failureReason ?? null,
    );
  }

  private speakerName(speaker: MeetingDialogueLine["speaker"]) {
    if (speaker === "player") return this.profile.name;
    if (speaker === "nader") return "نادر";
    if (speaker === "layla") return "ليلى";
    return "عماد";
  }

  private speakerRole(speaker: MeetingDialogueLine["speaker"]) {
    if (speaker === "player") return "محلل البيانات";
    if (speaker === "nader") return "CEO";
    if (speaker === "layla") return "مديرة HR";
    return "مدير المبيعات";
  }

  private speakerTone(speaker: MeetingDialogueLine["speaker"]): CinematicDialogueLine["tone"] {
    if (speaker === "player") return "player";
    if (speaker === "layla") return "hr";
    if (speaker === "nader") return "coach";
    if (speaker === "emad") return "sales";
    return "neutral";
  }

  private speakerAvatar(speaker: MeetingDialogueLine["speaker"]) {
    if (speaker === "player") {
      const key = this.profile.avatar === "female" ? assetKeys.playerFemale : assetKeys.playerMale;
      return assetSources[key].path;
    }
    if (speaker === "nader") return assetSources[assetKeys.dataCoach].path;
    if (speaker === "layla") return assetSources[assetKeys.hrManager].path;
    return assetSources[assetKeys.salesManager].path;
  }

  private toCinematicLine(line: MeetingDialogueLine): CinematicDialogueLine {
    return {
      speakerName: this.speakerName(line.speaker),
      speakerRole: this.speakerRole(line.speaker),
      text: line.text,
      avatarSrc: this.speakerAvatar(line.speaker),
      tone: this.speakerTone(line.speaker),
      onShow: () => this.highlightSpeaker(line.speaker),
    };
  }

  private openNpcDialogue() {
    if (!this.config.npc) return;
    this.cinematicDialogue?.close();
    const npc = this.config.npc;
    this.cinematicDialogue = openCinematicDialogue({
      lines: npc.lines.map((text) => ({
        speakerName: npc.name,
        speakerRole: npc.role,
        text,
        avatarSrc: assetSources[npc.asset].path,
        tone: this.roomId === "hr" ? "hr" : "sales",
      })),
      onComplete: () => {
        this.cinematicDialogue = undefined;
      },
      onClose: () => {
        this.cinematicDialogue = undefined;
      },
    });
  }

  private cancelMove() {
    this.moveTween?.stop();
    this.moveTween = undefined;
    this.moveCleanup?.();
    this.moveCleanup = undefined;
  }

  private closeScene() {
    this.cancelMove();
    this.clearDialogueBubble();
    this.cinematicDialogue?.close();
    this.cinematicDialogue = undefined;
    if (this.roomId === "meeting" && !isGameOver() && getState().meetingStage !== "result") {
      setMeetingStage("intro");
    }
    this.scene.resume("OfficeScene");
    this.scene.stop();
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
