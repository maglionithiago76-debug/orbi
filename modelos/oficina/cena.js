// Torque Auto Center scenes: the rev needle sweeps, the odometer counts to the 10k service and the warning lights go off;
// then the service order prints out and every item gets checked.
window.cena = ({ gsap, ScrollTrigger, reduz, $, $$ }) => {
  const pn = $(".painel"), agulha = $(".pn__agulha", pn), km = $(".pn__km span", pn), luzes = $$(".luz", pn), ok = $(".pn__ok", pn);
  const kmTxt = (v) => String(Math.round(v)).padStart(6, "0");
  if (reduz) { gsap.set(agulha, { rotation: -60, svgOrigin: "200 200" }); km.textContent = kmTxt(10000); gsap.set(ok, { opacity: 1 }); }
  else {
    luzes.forEach((l) => l.classList.add("on"));
    gsap.set(agulha, { rotation: -120, svgOrigin: "200 200" });
    gsap.to(agulha, { rotation: -80, svgOrigin: "200 200", duration: 0.6, ease: "power2.out", delay: 0.3, yoyo: true, repeat: 1 }); // engine start on open
    const o = { k: 0 };
    const tl = gsap.timeline({ defaults: { ease: "none" } })
      .to(agulha, { rotation: 75, svgOrigin: "200 200", duration: 0.8, ease: "power2.in" }, 0)
      .to(agulha, { rotation: -60, svgOrigin: "200 200", duration: 0.6, ease: "power2.out" }, 0.8)
      .to(o, { k: 10000, duration: 1.2, onUpdate: () => (km.textContent = kmTxt(o.k)) }, 0);
    tl.to(ok, { opacity: 1, duration: 0.2 }, 1.6).to({}, { duration: 0.3 });
    ScrollTrigger.create({ trigger: pn, start: "top top", end: () => "+=" + innerHeight * 1.8, pin: true, scrub: true, animation: tl,
      onUpdate: () => luzes.forEach((l, i) => l.classList.toggle("on", tl.time() < 0.6 + i * 0.25)) });
  }

  const os = $(".ordem"), papel = $(".os__papel", os), checks = $$(".os__check", os), pe = $(".os__pe", os);
  if (reduz) { papel.style.clipPath = "none"; checks.forEach((c) => c.classList.add("on")); gsap.set(pe, { opacity: 1 }); }
  else {
    const o = { p: 100 };
    const to = gsap.timeline({ defaults: { ease: "none" } })
      .to(o, { p: 0, duration: 0.8, onUpdate: () => (papel.style.clipPath = `inset(0 0 ${o.p}% 0)`) }, 0)
      .to(pe, { opacity: 1, duration: 0.2 }, 0.8 + checks.length * 0.18)
      .to({}, { duration: 0.3 });
    ScrollTrigger.create({ trigger: os, start: "top top", end: () => "+=" + innerHeight * 1.8, pin: true, scrub: true, animation: to,
      onUpdate: () => checks.forEach((c, i) => c.classList.toggle("on", to.time() > 0.85 + i * 0.18)) });
  }

  if (!reduz) $$(".galpao img").forEach((im, i) => gsap.fromTo(im, { yPercent: -16 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".galpao", start: "top bottom", end: "bottom top", scrub: true } }));
};
