import "./styles.css";
import { createHud } from "./ui/hud";
import { company } from "./data/salesCase";
import { gameEvents } from "./game/events";
import type { PlayerProfile } from "./game/types";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app root");
const appRoot = app;

const defaultProfile: PlayerProfile = { name: "نور", avatar: "female" };

clearLegacyPreviewState();

function renderProfileScreen() {
  appRoot.innerHTML = `
    <main class="profile-screen" dir="rtl">
      <section class="profile-panel profile-panel--hero">
        <p class="eyebrow">IMP — The Analyst Series</p>
        <h1>The Analyst: First Quarter</h1>
        <p class="intro">
          أنت محلل بيانات Senior منضم حديثاً لشركة <strong>${company.arabicName}</strong>،
          متخصصة في توزيع الأدوية للصيدليات.
          أول مهمة ليك: تقييم أداء فريقي مبيعات قبل ما الإدارة تقرر مكافآت Q2.
        </p>
        <div class="mission-strip">
          <span>اقرأ السياق</span>
          <span>افتح البيانات الخام</span>
          <span>اختار أدواتك</span>
          <span>اكتب توصيتك</span>
          <span>شوف العواقب بعد 3 شهور</span>
        </div>
        <form id="profile-form" class="profile-form">
          <label class="field-label" for="player-name">اسمك</label>
          <input id="player-name" name="name" maxlength="18" value="${defaultProfile.name}" />
          <div class="avatar-grid" role="radiogroup" aria-label="اختر شخصيتك">
            <label class="avatar-card">
              <input type="radio" name="avatar" value="female" checked />
              <img class="avatar-portrait" src="/assets/characters/player-female.svg" alt="" />
              <strong>محللة بيانات</strong>
              <small>دقيقة، بتلاحظ التفاصيل</small>
            </label>
            <label class="avatar-card">
              <input type="radio" name="avatar" value="male" />
              <img class="avatar-portrait" src="/assets/characters/player-male.svg" alt="" />
              <strong>محلل بيانات</strong>
              <small>عملي، ثابت تحت الضغط</small>
            </label>
          </div>
          <button class="primary-button" type="submit">ابدأ المهمة</button>
        </form>
      </section>
    </main>
  `;
  const form = document.querySelector<HTMLFormElement>("#profile-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || defaultProfile.name).trim() || defaultProfile.name;
    const avatar = data.get("avatar") === "male" ? "male" : "female";
    bootSlice({ name, avatar });
  });
}

function bootSlice(profile: PlayerProfile) {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  appRoot.innerHTML = `
    <main class="game-shell">
      <section id="game-root" class="game-root" aria-label="مكتب NovaPharm"></section>
      <section id="hud-root" class="hud-root" aria-label="واجهة اللعبة"></section>
    </main>
  `;
  createHud(profile);
  bootOfficeScene(profile);
}

renderProfileScreen();

function clearLegacyPreviewState() {
  void navigator.serviceWorker?.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => void registration.unregister());
  });

  if ("caches" in window) {
    void caches.keys().then((keys) => keys.forEach((key) => void caches.delete(key)));
  }
}

async function bootOfficeScene(profile: PlayerProfile, attempt = 1) {
  try {
    const { createGame } = await import("./game/createGame");
    createGame(profile);
  } catch (error) {
    console.warn("Phaser office scene failed to load; retrying current NovaPharm scene.", error);
    if (attempt < 3) {
      window.setTimeout(() => void bootOfficeScene(profile, attempt + 1), 600 * attempt);
      return;
    }
    renderOfficeFallback();
  }
}

function renderOfficeFallback() {
  const container = document.querySelector<HTMLElement>("#game-root");
  if (!container) return;
  container.innerHTML = `
    <div class="office-fallback" dir="rtl" aria-label="مكتب NovaPharm">
      <header>
        <strong>${company.name}</strong>
        <span>${company.tagline}</span>
      </header>
      <button data-npc="karim">مكتب مدير المبيعات — Karim</button>
      <button data-npc="hala">غرفة الموارد البشرية — Hala</button>
      <button data-npc="tarek">مكتب العمليات الميدانية — Tarek</button>
      <button data-desk>مكتبك — افتح التحليل</button>
    </div>
  `;
  container.querySelectorAll<HTMLButtonElement>("[data-npc]").forEach((button) => {
    button.addEventListener("click", () => {
      const npc = button.dataset.npc as "karim" | "hala" | "tarek";
      gameEvents.emit("npcinteract", { npc });
    });
  });
  container.querySelector<HTMLButtonElement>("[data-desk]")?.addEventListener("click", () => {
    gameEvents.emit("opendesk", undefined);
  });
}
