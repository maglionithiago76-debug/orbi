// Cantina Rossi scenes: the house Margherita turns like a wheel while its six steps pass one at a time; the oven counts to 90 seconds.
window.cena = (kit) => {
  const { gsap, ScrollTrigger, reduz } = kit, q = kit.$, qa = kit.$$;
  const sec = q(".roda"), pizza = q(".rd__pizza img", sec), falas = qa(".rd-p", sec), n = falas.length;
  // k = -1 is the opening (headline and button); then one step at a time, switched cleanly
  const ir = (p) => {
    const k = p - 0.1 < 0 ? -1 : Math.min(n - 1, Math.floor(((p - 0.1) / 0.9) * n * 1.0001));
    sec.classList.toggle("girando", k >= 0);
    falas.forEach((f, i) => f.classList.toggle("on", i === k));
  };
  ir(0);
  if (!reduz) {
    gsap.fromTo(pizza, { rotation: 0, scale: 1.22 }, { rotation: -300, scale: 1.22, ease: "none",
      scrollTrigger: { trigger: sec, start: "top top", end: () => "+=" + innerHeight * 3, pin: true, scrub: true, onUpdate: (s) => ir(s.progress) } });
  }

  // oven: the photo heats up, the counter runs to 90 seconds, embers rise
  const fn = q(".forno"), num = q(".fn__num span", fn), foto = q(".fn__foto", fn);
  qa(".fn__brasas i", fn).forEach((b, i) => Object.assign(b.style, { left: ((i * 37) % 100) + "%", animationDuration: 3 + ((i * 7) % 5) + "s", animationDelay: -((i * 13) % 50) / 10 + "s", "--dx": ((i * 29) % 80) - 40 + "px" }));
  if (reduz) { num.textContent = "90"; gsap.set(foto, { filter: "brightness(.8) saturate(1)", scale: 1 }); return; }
  const o = { s: 12 };   // already counting on arrival
  num.textContent = "12";
  const tf = gsap.timeline({ defaults: { ease: "none" } })
    .to(foto, { scale: 1, filter: "brightness(.95) saturate(1.1)", duration: 1 }, 0)
    .to(o, { s: 90, duration: 1, onUpdate: () => (num.textContent = Math.round(o.s)) }, 0)
    .to({}, { duration: 0.25 });
  ScrollTrigger.create({ trigger: fn, start: "top top", end: () => "+=" + innerHeight * 1.4, pin: true, scrub: true, animation: tf });
};
