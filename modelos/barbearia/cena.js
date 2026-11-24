// Navalha Club scenes: zoom through the letters of the name into the photo; services swap the chair photo; the clock follows the booking.
window.cena = (kit) => {
  const { gsap, ScrollTrigger, reduz } = kit, q = kit.$, qa = kit.$$, $ = q, $$ = qa;
  const sec = $(".letra"), svg = $(".lt__mascara", sec), txt = $("text", svg), txts = $$("text", svg);

  // fit the word to what the viewport shows of the 1600x900 "slice" viewBox
  const caber = () => {
    const a = innerWidth / innerHeight, vis = a < 16 / 9 ? 900 * a : 1600;
    txt.style.fontSize = "330px";
    const L = txt.getComputedTextLength() || 1300;
    txts.forEach((t) => (t.style.fontSize = Math.min(330, (330 * vis * 0.88) / L) + "px"));
  };
  const fone = innerWidth < 760;   // phone: the word sits higher, above the headline
  if (fone) txts.forEach((t) => t.setAttribute("y", 260));
  caber(); document.fonts && document.fonts.ready.then(caber); addEventListener("resize", caber);

  if (!reduz) {
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.to(q(".lt__g", sec), { scale: 9, svgOrigin: fone ? "800 180" : "800 230", duration: 1, ease: "power2.in" }, 0)
      .to(q(".lt__g", sec), { opacity: 0, duration: 0.5 }, 0.3)
      .to(q(".lt__foto", sec), { scale: 1, duration: 1.2 }, 0)
      .to({}, { duration: 0.2 });
    ScrollTrigger.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * 1.4, pin: true, scrub: true, animation: tl });
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
