import "./styles.css";
import { createGame } from "./game/createGame";
import { createHud } from "./ui/hud";
import type { PlayerProfile } from "./game/types";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root");
}

const appRoot = app;

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
          أنت محلل بيانات في شركة <strong>مدار للتوزيع</strong>. اليوم هو يوم مراجعة الأداء الشهرية.
          تحرك داخل الشركة، قابل أصحاب القرار، افحص ما يكفي من البيانات، ثم قدّم توصية قبل إغلاق دورة المكافآت.
        </p>
        <div class="mission-strip">
          <span>تحرك بين الأماكن</span>
          <span>افتح الأدلة</span>
          <span>اتخذ قرارًا</span>
          <span>شاهد العواقب</span>
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
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  appRoot.innerHTML = `
    <main class="game-shell">
      <section id="game-root" class="game-root" aria-label="خريطة الشركة"></section>
      <section id="hud-root" class="hud-root" aria-label="أدوات اللعبة"></section>
    </main>
  `;

  createHud(profile);
  createGame(profile);
}

renderProfileScreen();
