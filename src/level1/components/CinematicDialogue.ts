export interface CinematicDialogueLine {
  speakerName: string;
  speakerRole?: string;
  text: string;
  avatarSrc?: string;
  tone?: "sales" | "hr" | "coach" | "player" | "neutral";
  onShow?: () => void;
}

interface CinematicDialogueOptions {
  lines: CinematicDialogueLine[];
  onComplete?: () => void;
  onClose?: () => void;
}

const TYPE_SPEED_MS = 18;

export function openCinematicDialogue(options: CinematicDialogueOptions) {
  if (!options.lines.length) {
    options.onComplete?.();
    return { close: () => undefined };
  }

  document.querySelector(".l1-cinematic-dialogue")?.remove();

  const root = document.createElement("section");
  root.className = "l1-cinematic-dialogue";
  root.dir = "rtl";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", "حوار");
  root.innerHTML = `
    <div class="l1-cinematic-dialogue__portrait" data-portrait-wrap>
      <img data-avatar alt="" />
    </div>
    <div class="l1-cinematic-dialogue__box" data-box>
      <button class="l1-cinematic-dialogue__close" type="button" data-close aria-label="إغلاق">×</button>
      <header class="l1-cinematic-dialogue__speaker">
        <strong data-name></strong>
        <span data-role></span>
      </header>
      <p class="l1-cinematic-dialogue__text" data-text></p>
      <footer class="l1-cinematic-dialogue__footer">
        <span data-count></span>
        <button class="l1-cinematic-dialogue__next" type="button" data-next>
          <span data-next-label>تابع</span>
          <b aria-hidden="true">▶</b>
        </button>
      </footer>
    </div>
  `;
  document.body.appendChild(root);
  document.body.classList.add("l1-transient-overlay-open");

  const stopInputLeak = (event: Event) => {
    event.stopPropagation();
  };
  root.addEventListener("pointerdown", stopInputLeak);
  root.addEventListener("click", stopInputLeak);

  const portraitWrap = root.querySelector<HTMLElement>("[data-portrait-wrap]")!;
  const avatar = root.querySelector<HTMLImageElement>("[data-avatar]")!;
  const box = root.querySelector<HTMLElement>("[data-box]")!;
  const name = root.querySelector<HTMLElement>("[data-name]")!;
  const role = root.querySelector<HTMLElement>("[data-role]")!;
  const text = root.querySelector<HTMLElement>("[data-text]")!;
  const count = root.querySelector<HTMLElement>("[data-count]")!;
  const nextLabel = root.querySelector<HTMLElement>("[data-next-label]")!;
  const nextBtn = root.querySelector<HTMLButtonElement>("[data-next]")!;

  let index = 0;
  let typed = "";
  let timer: number | undefined;
  let isTyping = false;
  let closed = false;

  const clearTyping = () => {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined;
    isTyping = false;
  };

  const close = (completed = false) => {
    if (closed) return;
    closed = true;
    clearTyping();
    root.classList.add("l1-cinematic-dialogue--closing");
    window.setTimeout(() => {
      root.remove();
      document.body.classList.remove("l1-transient-overlay-open");
      root.removeEventListener("pointerdown", stopInputLeak);
      root.removeEventListener("click", stopInputLeak);
    }, 180);
    if (completed) options.onComplete?.();
    else options.onClose?.();
  };

  const finishTyping = () => {
    clearTyping();
    typed = options.lines[index].text;
    text.textContent = typed;
    nextLabel.textContent = index === options.lines.length - 1 ? "إنهاء" : "تابع";
  };

  const renderLine = () => {
    clearTyping();
    const line = options.lines[index];
    line.onShow?.();
    root.dataset.tone = line.tone ?? "neutral";
    name.textContent = line.speakerName;
    role.textContent = line.speakerRole ?? "";
    role.hidden = !line.speakerRole;
    count.textContent = `${index + 1} / ${options.lines.length}`;
    nextLabel.textContent = "تخطي";
    text.textContent = "";
    typed = "";

    if (line.avatarSrc) {
      avatar.src = line.avatarSrc;
      portraitWrap.hidden = false;
    } else {
      portraitWrap.hidden = true;
    }

    let charIndex = 0;
    isTyping = true;
    timer = window.setInterval(() => {
      if (charIndex >= line.text.length) {
        finishTyping();
        return;
      }
      typed = line.text.slice(0, charIndex + 1);
      text.textContent = typed;
      charIndex += 1;
    }, TYPE_SPEED_MS);
  };

  const advance = () => {
    if (isTyping) {
      finishTyping();
      return;
    }
    if (index >= options.lines.length - 1) {
      close(true);
      return;
    }
    index += 1;
    renderLine();
  };

  nextBtn.addEventListener("click", advance);
  box.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("button")) return;
    advance();
  });
  root.querySelector<HTMLButtonElement>("[data-close]")!.addEventListener("click", () => close(false));

  const onKey = (event: KeyboardEvent) => {
    if (closed) return;
    if (event.key === "Escape") close(false);
    if (event.key === "Enter" || event.key === " " || event.key.toLowerCase() === "e") {
      event.preventDefault();
      advance();
    }
  };
  window.addEventListener("keydown", onKey);

  const originalClose = close;
  const api = {
    close: () => {
      window.removeEventListener("keydown", onKey);
      originalClose(false);
    },
  };

  const cleanupObserver = new MutationObserver(() => {
    if (!document.body.contains(root)) {
      window.removeEventListener("keydown", onKey);
      cleanupObserver.disconnect();
    }
  });
  cleanupObserver.observe(document.body, { childList: true });

  renderLine();
  return api;
}
