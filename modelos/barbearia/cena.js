// Navalha Club scenes: zoom through the letters of the name into the photo; services swap the chair photo; the clock follows the booking.
window.cena = ({ gsap, ScrollTrigger, reduz, $, $$ }) => {
  const sec = $(".letra"), svg = $(".lt__mascara", sec), txt = $("text", svg);

  // fit the word to what the viewport shows of the 1600x900 "slice" viewBox
  const caber = () => {
    const a = innerWidth / innerHeight, vis = a < 16 / 9 ? 900 * a : 1600;
    txt.setAttribute("font-size", 330);
    const L = txt.getComputedTextLength() || 1300;
    txt.setAttribute("font-size", Math.min(330, (330 * vis * 0.88) / L));
  };
  caber(); document.fonts && document.fonts.ready.then(caber); addEventListener("resize", caber);

  if (reduz) {
    gsap.set($(".lt__preto", sec), { opacity: 0 }); gsap.set($(".lt__texto", sec), { autoAlpha: 1 }); sec.style.setProperty("--veu", 1);
  } else {
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.to($(".lt__dica", sec), { opacity: 0, duration: 0.2 }, 0)
      .to($(".lt__g", sec), { scale: 16, svgOrigin: "800 470", duration: 1.2, ease: "power2.in" }, 0)
      .to($(".lt__preto", sec), { opacity: 0, duration: 0.45 }, 0.75)
      .to($(".lt__foto", sec), { scale: 1, duration: 1.4 }, 0)
      .to(sec, { "--veu": 1, duration: 0.4 }, 1.2)
      .fromTo($(".lt__texto", sec), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.45 }, 1.3)
      .to({}, { duration: 0.4 });
    ScrollTrigger.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * 2.4, pin: true, scrub: true, animation: tl });
  }

  // chair: each service swaps the sticky photo
  const fotos = $$(".cd__fotos img"), servs = $$(".sv");
  const ativar = (sv) => {
    servs.forEach((s) => s.classList.toggle("on", s === sv));
    fotos.forEach((f) => f.classList.toggle("on", f.dataset.i === sv.dataset.foto));
  };
  ativar(servs[0]);
  servs.forEach((sv) => ScrollTrigger.create({ trigger: sv, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && ativar(sv) }));

  // clock: spins with the scroll, then points at the chosen time
  const h = $(".ponteiro-h"), m = $(".ponteiro-m");
  if (!h) return;
  let escolhido = false;
  if (!reduz) ScrollTrigger.create({ trigger: ".agenda", start: "top bottom", end: "bottom top", scrub: true, onUpdate: (s) => {
    if (escolhido) return;
    gsap.set(m, { rotation: s.progress * 720, svgOrigin: "100 100" }); gsap.set(h, { rotation: s.progress * 60, svgOrigin: "100 100" });
  } });
  document.addEventListener("agenda", (e) => {
    const hora = e.detail.hora; if (!hora) return;
    escolhido = true;
    const [hh, mm] = hora.split(":").map(Number);
    gsap.to(h, { rotation: (hh % 12) * 30 + mm * 0.5 + 360, svgOrigin: "100 100", duration: 0.9, ease: "back.out(1.6)" });
    gsap.to(m, { rotation: mm * 6 + 720, svgOrigin: "100 100", duration: 0.9, ease: "back.out(1.6)" });
  });

  if (!reduz) gsap.to(".poste", { backgroundPosition: "100% 0", ease: "none", scrollTrigger: { trigger: ".rodape", start: "top bottom", end: "bottom bottom", scrub: true } });
};
