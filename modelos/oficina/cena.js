// Torque Auto Center scenes: the rev needle sweeps, the odometer counts to the 10k service and the warning lights go off.
// Then the service order prints out and every item gets checked.
window.cena = (kit) => {
  const { gsap, ScrollTrigger, reduz } = kit, q = kit.$, qa = kit.$$;
  const pn = q(".painel"), agulha = q(".pn__agulha", pn), km = q(".pn__km span", pn), luzes = qa(".luz", pn), ok = q(".pn__ok", pn);
  const kmTxt = (v) => String(Math.round(v)).padStart(6, "0");
  if (reduz) { gsap.set(agulha, { rotation: -60, svgOrigin: "200 200" }); km.textContent = kmTxt(10000); }
  else {
    luzes.forEach((l) => l.classList.add("on"));
    gsap.set(ok, { autoAlpha: 0 });
    gsap.set(agulha, { rotation: -120, svgOrigin: "200 200" });
    gsap.to(agulha, { rotation: -70, svgOrigin: "200 200", duration: 0.7, ease: "power2.out", delay: 0.3 }); // engine start on arrival
    const o = { k: 0 };
    const tl = gsap.timeline({ defaults: { ease: "none" } })
      .fromTo(agulha, { rotation: -70 }, { rotation: 75, svgOrigin: "200 200", duration: 0.7, ease: "power2.in", immediateRender: false }, 0)
      .to(agulha, { rotation: -60, svgOrigin: "200 200", duration: 0.5, ease: "power2.out" }, 0.7)
      .to(o, { k: 10000, duration: 1.1, onUpdate: () => (km.textContent = kmTxt(o.k)) }, 0)
      .to(ok, { autoAlpha: 1, duration: 0.05 }, 1.25)
      .to({}, { duration: 0.3 });
    const apagar = () => luzes.forEach((l, i) => l.classList.toggle("on", 0.4 + i * 0.22 - tl.time() > 0));
    ScrollTrigger.create({ trigger: pn, start: "top top", end: () => "+=" + innerHeight * 1.4, pin: true, scrub: true, animation: tl, onUpdate: apagar });
  }

  const folha = q(".ordem"), papel = q(".os__papel", folha), checks = qa(".os__check", folha), pe = q(".os__pe", folha);
  if (reduz) checks.forEach((c) => c.classList.add("on"));
  else {
    // the first lines are already printed on arrival: scrolling prints the rest line by line, then checks each one
    const linhas = qa(".os__item", folha).slice(3);
    gsap.set(pe, { autoAlpha: 0 });
    gsap.set(linhas, { autoAlpha: 0 });
    const to = gsap.timeline({ defaults: { ease: "none" } });
    linhas.forEach((l, i) => to.to(l, { autoAlpha: 1, duration: 0.04 }, 0.05 + i * 0.1));
    to.to(pe, { autoAlpha: 1, duration: 0.05 }, 0.42 + checks.length * 0.1)
      .to({}, { duration: 0.6 });
    const marcar = () => checks.forEach((c, i) => c.classList.toggle("on", to.time() - 0.4 - i * 0.1 > 0));
    ScrollTrigger.create({ trigger: folha, start: "top top", end: () => "+=" + innerHeight * 1.4, pin: true, scrub: true, animation: to, onUpdate: marcar });
  }
};
