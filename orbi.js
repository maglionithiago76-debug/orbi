// Orbi homepage: live model demo, FAQ index, opening hours, entrances and the hero shutter.
(() => {
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- entrances: parts of each section rise in turn ---------- */
  const rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduz) {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach((el) => io.observe(el));
  } else rv.forEach((el) => el.classList.add("in"));

  /* ---------- the one clip: still for reduced motion ---------- */
  if (reduz) document.querySelectorAll("video[autoplay]").forEach((v) => { v.removeAttribute("autoplay"); v.pause(); });

  /* ---------- hero shutter ---------- */
  const sh = document.getElementById("shutter");
  if (sh) requestAnimationFrame(() => setTimeout(() => sh.classList.add("open"), 120));

  /* ---------- live demo: real model inside a phone or a laptop screen ---------- */
  const device = document.getElementById("device");
  const tela = document.getElementById("tela");
  const form = document.getElementById("controles");
  const abrir = document.getElementById("abrir");
  const stage = device && device.parentElement;
  function fit() {
    if (!device) return;
    const pc = form.v.value === "pc";
    const vw = pc ? 1280 : 390, vh = pc ? 800 : 844;           // the page size the model is rendered at
    const box = stage.getBoundingClientRect();
    const pad = pc ? 16 : 20, frame = pc ? 16 : 20;
    const s = Math.min((box.width - pad * 2 - frame) / vw, (box.height - pad * 2 - frame) / vh);
    tela.style.width = vw + "px"; tela.style.height = vh + "px";
    tela.style.transform = `scale(${s})`;
    device.style.width = vw * s + frame + "px";
    device.style.height = vh * s + frame + "px";
    device.classList.toggle("is-desk", pc);
  }
  if (form) {
    form.addEventListener("change", (e) => {
      if (e.target.name === "m") {
        tela.src = e.target.value;
        tela.title = "Modelo " + e.target.dataset.nome + " funcionando";
        abrir.href = e.target.value;
      }
      fit();
      // the model lays itself out once for its width: reload it at the new size
      if (e.target.name === "v") tela.src = form.m.value;
    });
    addEventListener("resize", fit);
    fit();
  }

  /* ---------- FAQ: questions on the left, the answer large on the right ---------- */
  const faq = document.getElementById("faq");
  const pane = document.getElementById("faq-pane");
  if (faq) {
    const qs = [...faq.querySelectorAll(".faq-q")];
    const pick = (q) => {
      qs.forEach((x) => {
        const on = x === q;
        x.setAttribute("aria-expanded", on);
        x.nextElementSibling.hidden = !on;
      });
      const txt = q.nextElementSibling.textContent;
      if (pane.textContent === txt) return;
      pane.classList.add("fade");
      setTimeout(() => { pane.textContent = txt; pane.classList.remove("fade"); }, reduz ? 0 : 150);
    };
    qs.forEach((q) => {
      q.addEventListener("click", () => pick(q));
      q.addEventListener("focus", () => pick(q));
      q.addEventListener("mouseenter", () => { if (matchMedia("(pointer: fine)").matches) pick(q); });
    });
  }

  /* ---------- opening hours, live in Brasília time ---------- */
  const agora = document.getElementById("agora");
  if (agora) {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", hour12: false })
      .formatToParts(new Date()).map((x) => [x.type, x.value]));
    const h = +p.hour % 24, util = !["Sat", "Sun"].includes(p.weekday);
    agora.textContent = util && h >= 9 && h < 18 ? "Aberto agora" : "Fechado agora. Pode mandar mensagem, a gente responde no próximo horário.";
  }
})();
