export function renderPlaceholderTab(
  container: HTMLElement,
  opts: { title: string; hint: string; items: string[] },
) {
  container.innerHTML = `
    <div class="l1-placeholder">
      <p class="l1-placeholder__eyebrow">سيُملأ تلقائيًا أثناء التحقيق</p>
      <h3>${opts.title}</h3>
      <p class="l1-placeholder__hint">${opts.hint}</p>
      <ul class="l1-placeholder__list">
        ${opts.items.map((i) => `<li><span class="l1-placeholder__dot"></span>${i}</li>`).join("")}
      </ul>
    </div>
  `;
}
