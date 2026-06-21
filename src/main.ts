import "./styles.css";
import { createGame } from "./game/createGame";
import { initLevel1 } from "./level1";
import { resetLevel } from "./level1/state/store";
import type { PlayerProfile } from "./game/types";

const APP_VERSION = "MADAR-ANALYST-2026-06-13-LATEST";
const CACHE_CLEANUP_KEY = `madar-cache-cleaned:${APP_VERSION}`;

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root");
}

const appRoot = app;
let currentGame: ReturnType<typeof createGame> | null = null;
let currentProfile: PlayerProfile | null = null;

document.documentElement.dataset.appVersion = APP_VERSION;

void clearStalePreviewCache();

const defaultProfile: PlayerProfile = {
  name: "نور",
  avatar: "female",
};

function renderProfileScreen() {
  appRoot.innerHTML = `
    <main class="profile-screen" dir="rtl">
      <div class="start-scene start-scene--compact" aria-label="شاشة بداية مهمة المحلل">
        <div class="start-scene__skyline" aria-hidden="true"></div>
        <div class="start-scene__scan" aria-hidden="true"></div>

        <section class="profile-panel profile-panel--hero compact-briefing">
          <header class="briefing-top">
            <div class="case-folder case-folder--mini">
              <span class="case-folder__stamp">سري</span>
              <p>ملف المهمة</p>
              <h3>قرار المكافآت</h3>
            </div>
            <div class="start-timer">
              <span>الوقت المتاح</span>
              <strong>03:00</strong>
            </div>
            <div class="agent-chip">
              <img class="avatar-portrait avatar-portrait--active" src="/assets/characters/player-female.svg" alt="" data-active-avatar />
              <span>
                <strong data-preview-name>${defaultProfile.name}</strong>
                <small>محلل بيانات · Riwaj Group</small>
              </span>
            </div>
          </header>

          <div class="title-lockup">
            <p class="eyebrow">IMP Training Simulation · Riwaj Group</p>
            <h1>المحلل</h1>
            <p class="intro">افتح الملفات، اسأل الفريق، ثم اختر القرار المناسب قبل انتهاء الوقت.</p>
          </div>

          <div class="mission-strip" aria-label="خطوات المهمة">
            <span><b>01</b> اجمع الأدلة</span>
            <span><b>02</b> حلل المشهد</span>
            <span><b>03</b> قدم القرار</span>
          </div>

          <form id="profile-form" class="profile-form">
            <div class="start-name-row">
              <label class="field-label" for="player-name">اسم المحلل</label>
              <input id="player-name" name="name" maxlength="18" value="${defaultProfile.name}" autocomplete="off" />
            </div>

            <div class="avatar-grid" role="radiogroup" aria-label="اختيار شخصية المحلل">
              <label class="avatar-card">
                <input type="radio" name="avatar" value="female" checked />
                <img class="avatar-portrait" src="/assets/characters/player-female.svg" alt="" />
                <strong>محللة بيانات</strong>
              </label>
              <label class="avatar-card">
                <input type="radio" name="avatar" value="male" />
                <img class="avatar-portrait" src="/assets/characters/player-male.svg" alt="" />
                <strong>محلل بيانات</strong>
              </label>
            </div>

            <button class="primary-button start-button" type="submit">ابدأ المهمة</button>
          </form>
        </section>
      </div>
    </main>
  `;

  const form = document.querySelector<HTMLFormElement>("#profile-form");
  const nameInput = document.querySelector<HTMLInputElement>("#player-name");
  const previewName = document.querySelector<HTMLElement>("[data-preview-name]");
  const activeAvatar = document.querySelector<HTMLImageElement>("[data-active-avatar]");
  nameInput?.addEventListener("input", () => {
    if (previewName) previewName.textContent = nameInput.value.trim() || defaultProfile.name;
  });
  form?.querySelectorAll<HTMLInputElement>('input[name="avatar"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (!radio.checked || !activeAvatar) return;
      activeAvatar.src = radio.value === "male" ? "/assets/characters/player-male.svg" : "/assets/characters/player-female.svg";
    });
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || defaultProfile.name).trim() || defaultProfile.name;
    const avatar = data.get("avatar") === "male" ? "male" : "female";
    bootSlice({ name, avatar });
  });
}

function bootSlice(profile: PlayerProfile) {
  const levelCleanup = (window as Window & { __level1Cleanup?: () => void }).__level1Cleanup;
  levelCleanup?.();
  (window as Window & { __level1Cleanup?: () => void }).__level1Cleanup = undefined;
  currentGame?.destroy(true);
  currentGame = null;
  resetLevel();
  currentProfile = profile;

  appRoot.innerHTML = `
    <main class="game-shell">
      <section id="game-root" class="game-root" aria-label="خريطة الشركة"></section>
      <span class="version-badge" aria-label="نسخة اللعبة الحالية">آخر نسخة · ${APP_VERSION}</span>
    </main>
  `;

  currentGame = createGame(profile);
  initLevel1();
}

window.addEventListener("madar:restart-level", () => {
  bootSlice(currentProfile ?? defaultProfile);
});

async function clearStalePreviewCache() {
  if (sessionStorage.getItem(CACHE_CLEANUP_KEY) === "done") return;

  const cleanupTasks: Promise<unknown>[] = [];

  if ("serviceWorker" in navigator) {
    cleanupTasks.push(
      navigator.serviceWorker.getRegistrations().then((registrations) => Promise.all(registrations.map((item) => item.unregister()))),
    );
  }

  if ("caches" in window) {
    cleanupTasks.push(caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))));
  }

  if (!cleanupTasks.length) {
    sessionStorage.setItem(CACHE_CLEANUP_KEY, "done");
    return;
  }

  try {
    await Promise.allSettled(cleanupTasks);
  } finally {
    sessionStorage.setItem(CACHE_CLEANUP_KEY, "done");
  }
}

renderProfileScreen();
