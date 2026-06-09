import "./styles.css";
import { createGame } from "./game/createGame";
import { createHud } from "./ui/hud";
import { company } from "./data/salesCase";
import type { PlayerProfile } from "./game/types";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app root");
const appRoot = app;

const defaultProfile: PlayerProfile = { name: "نور", avatar: "female" };

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
  createGame(profile);
}

renderProfileScreen();
