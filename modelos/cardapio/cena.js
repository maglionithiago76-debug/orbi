// Cantina Rossi scenes: the pizza turns like a wheel and each slice brings a flavour; the oven counts to 90 seconds.
window.cena = ({ gsap, ScrollTrigger, reduz, $, $$ }) => {
  const sec = $(".roda"), falas = $$(".rd-p", sec), pizza = $(".rd__pizza", sec);
  if (reduz) {
    gsap.set(falas[0], { autoAlpha: 1 });
  } else {
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    const n = falas.length;
    tl.to($(".rd__abre", sec), { y: -40, autoAlpha: 0, duration: 0.5 }, 0.1);
    tl.fromTo(pizza, { rotation: 0, scale: 0.92 }, { rotation: -60 * n, scale: 1.04, duration: n + 0.8 }, 0);
    falas.forEach((f, i) => {
      const at = 0.6 + i;
      tl.fromTo(f, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.3 }, at);
      if (i < n - 1) tl.to(f, { autoAlpha: 0, y: -40, duration: 0.25 }, at + 0.75);
    });
    tl.to({}, { duration: 0.4 });
    ScrollTrigger.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * (falas.length * 0.75 + 0.8), pin: true, scrub: true, animation: tl });
  }

  // oven: photo heats up, counter runs to 90 seconds, embers rise
  const fn = $(".forno"), num = $(".fn__num span", fn);
  $$(".fn__brasas i", fn).forEach((b, i) => Object.assign(b.style, { left: ((i * 37) % 100) + "%", animationDuration: 3 + ((i * 7) % 5) + "s", animationDelay: -((i * 13) % 50) / 10 + "s", "--dx": ((i * 29) % 80) - 40 + "px" }));
  if (reduz) { num.textContent = "90"; gsap.set($(".fn__foto", fn), { filter: "brightness(1) saturate(1)", scale: 1 }); return; }
  const o = { s: 0 };
  const tf = gsap.timeline({ defaults: { ease: "none" } })
    .to($(".fn__foto", fn), { scale: 1, filter: "brightness(1.05) saturate(1.1)", duration: 1 }, 0)
    .to(o, { s: 90, duration: 1, onUpdate: () => (num.textContent = Math.round(o.s)) }, 0)
    .to({}, { duration: 0.25 });
  ScrollTrigger.create({ trigger: fn, start: "top top", end: () => "+=" + innerHeight * 1.6, pin: true, scrub: true, animation: tf });
};
