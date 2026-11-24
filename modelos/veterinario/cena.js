// Amparo Vet scenes: the heartbeat line draws itself behind the photo while the bpm counts up.
// Then the vaccination card gets stamped dose by dose and the WhatsApp reminder arrives.
window.cena = (kit) => {
  const { gsap, ScrollTrigger, reduz } = kit, q = kit.$, qa = kit.$$;
  const sec = q(".pulso"), linha = q(".pu__linha", sec), bpm = q(".pu__bpm b", sec), foto = q(".pu__foto img", sec);
  const L = linha.getTotalLength();
  linha.style.strokeDasharray = L;
  if (reduz) { linha.style.strokeDashoffset = 0; bpm.textContent = "92"; }
  else {
    linha.style.strokeDashoffset = L;
    const o = { b: 64 };   // o.b = 64 on arrival: the counter is already running
    // first beat on arrival: the line and the counter are already alive on the first screen
    gsap.to(linha, { strokeDashoffset: L * 0.6, duration: 1.6, ease: "power2.out", delay: 0.2 });
    bpm.textContent = "64";
    const tl = gsap.timeline({ defaults: { ease: "none" } })
      .fromTo(linha, { strokeDashoffset: L * 0.6 }, { strokeDashoffset: 0, duration: 1, immediateRender: false }, 0)
      .fromTo(o, { b: 64 }, { b: 92, duration: 1, immediateRender: false, onUpdate: () => (bpm.textContent = Math.round(o.b)) }, 0)
      .fromTo(foto, { scale: 1.14 }, { scale: 1, duration: 1 }, 0)
      .to({}, { duration: 0.2 });
    ScrollTrigger.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * 1.2, pin: true, scrub: true, animation: tl });
  }

  const cartao = q(".vacina"), selos = qa(".vc__carimbo", cartao), lembrete = q(".vc__zap--eu", cartao);
  if (!reduz) {
    const tv = gsap.timeline();
    selos.forEach((c, i) => tv.fromTo(c, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.14, ease: "back.out(2)" }, 0.1 + i * 0.3));
    tv.fromTo(lembrete, { autoAlpha: 0, y: 24, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.18, ease: "back.out(1.6)", transformOrigin: "100% 100%" }, 0.1 + selos.length * 0.3)
      .to({}, { duration: 0.4 });
    ScrollTrigger.create({ trigger: cartao, start: "top top", end: () => "+=" + innerHeight * 1.4, pin: true, scrub: true, animation: tv });
  }
};
