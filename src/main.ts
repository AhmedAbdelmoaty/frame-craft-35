import "./styles.css";
import { createGame } from "./game/createGame";
import { initLevel1 } from "./level1";
import type { PlayerProfile } from "./game/types";

const APP_VERSION = "MADAR-ANALYST-2026-06-13-LATEST";
const CACHE_CLEANUP_KEY = `madar-cache-cleaned:${APP_VERSION}`;

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root");
}

const appRoot = app;

document.documentElement.dataset.appVersion = APP_VERSION;

void clearStalePreviewCache();

const defaultProfile: PlayerProfile = {
  name: "نور",
  avatar: "female",
};

function renderProfileScreen() {
  appRoot.innerHTML = `
    <main class="profile-screen" dir="rtl">
      <section class="profile-panel profile-panel--hero">
        <p class="eyebrow">محاكاة تدريبية من IMP</p>
        <h1>المحلل</h1>
        <p class="intro">
          أنت محلل أداء في شركة <strong>مجموعة رواج للتجزئة</strong>. اجتماع اعتماد مكافآت الفروع يبدأ بعد دقائق،
          وهناك خلاف بين المبيعات وHR. تحرّك بين المكاتب، اجمع ما يكفي من الأدلة، ثم قدّم توصية قابلة للدفاع.
        </p>
        <div class="mission-strip">
          <span>تحرّك بين المكاتب</span>
          <span>اجمع الأدلة</span>
          <span>حلّل البيانات</span>
          <span>قدّم توصيتك</span>
        </div>

        <form id="profile-form" class="profile-form">
          <label class="field-label" for="player-name">اسم المحلل</label>
          <input id="player-name" name="name" maxlength="18" value="${defaultProfile.name}" />

          <div class="avatar-grid" role="radiogroup" aria-label="اختيار شخصية المحلل">
            <label class="avatar-card">
              <input type="radio" name="avatar" value="female" checked />
              <img class="avatar-portrait" src="/assets/characters/player-female.svg" alt="" />
              <strong>محللة بيانات</strong>
              <small>هادئة، دقيقة، تلاحظ التفاصيل</small>
            </label>
            <label class="avatar-card">
              <input type="radio" name="avatar" value="male" />
              <img class="avatar-portrait" src="/assets/characters/player-male.svg" alt="" />
              <strong>محلل بيانات</strong>
              <small>عملي، مركز، ثابت تحت الضغط</small>
            </label>
          </div>

          <button class="primary-button" type="submit">ابدأ اللعبة</button>
        </form>
      </section>
    </main>
  `;

  const form = document.querySelector<HTMLFormElement>("#profile-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || defaultProfile.name).trim() || defaultProfile.name;
    const avatar = data.get("avatar") === "male" ? "male" : "female";
    bootSlice({ name, avatar });
  });
}

function bootSlice(profile: PlayerProfile) {
  appRoot.innerHTML = `
    <main class="game-shell">
      <section id="game-root" class="game-root" aria-label="خريطة الشركة"></section>
      <span class="version-badge" aria-label="نسخة اللعبة الحالية">آخر نسخة · ${APP_VERSION}</span>
    </main>
  `;

  createGame(profile);
  initLevel1();
}

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
