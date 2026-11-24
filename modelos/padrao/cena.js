// Client base scenes (site/gen.py). 1: the photo window opens to the whole screen behind the name.
// 2: services light up one by one with a progress bar. 3: the Google rating counts up. 4: the "about" sentence reads in word by word.
window.cena = (kit) => {
  const { gsap, ScrollTrigger, reduz } = kit, q = kit.$, qa = kit.$$;

  const ab = q(".abre");
  if (ab && !reduz) {
    const ini = () => (innerWidth < 760 ? [52, 5, 4, 5] : [16, 4, 9, 54]);
    const abrir = (p) => {
      const v = ini();
      ["--t", "--r", "--b", "--l"].forEach((k, i) => ab.style.setProperty(k, v[i] * (1 - p) + "%"));
      ab.style.setProperty("--raio-f", 28 * (1 - p) + "px");
      ab.style.setProperty("--veu", Math.min(1, p * 1.8));
    };
    abrir(0);
    ScrollTrigger.create({ trigger: ab, start: "top top", end: () => "+=" + innerHeight * 1.1, pin: true, scrub: true, onUpdate: (s) => abrir(Math.min(1, s.progress * 1.15)) });
  }

  const itens = qa(".sv__item"), barra = q(".sv__barra i");
  if (itens.length) {
    const ativar = (el) => itens.forEach((x) => x.classList.toggle("on", x === el));
    ativar(itens[0]);
    itens.forEach((el) => ScrollTrigger.create({ trigger: el, start: "top 58%", end: "bottom 58%", onToggle: (s) => s.isActive && ativar(el) }));
    if (barra) ScrollTrigger.create({ trigger: ".sv__lista", start: "top 70%", end: "bottom 50%", scrub: true, onUpdate: (s) => (barra.style.transform = "scaleX(" + s.progress + ")") });
  }

  qa("[data-contar]").forEach((el) => {
    if (reduz) return;
    const alvo = +el.dataset.contar, o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => gsap.to(o, { v: alvo, duration: 1.2, ease: "power2.out", onUpdate: () => (el.textContent = o.v.toFixed(1).replace(".", ",")) }) });
  });

  const sb = q(".sb__texto");
  if (sb && !reduz) {
    const palavras = qa("span", sb);
    sb.classList.add("vivo");
    ScrollTrigger.create({ trigger: sb, start: "top 82%", end: "bottom 48%", scrub: true, onUpdate: (s) => palavras.forEach((w, i) => w.classList.toggle("on", i - s.progress * (palavras.length + 1) < 0)) });
  }
};
