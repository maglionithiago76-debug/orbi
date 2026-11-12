// Amparo Vet scenes: the heartbeat line draws itself with a bpm counter and the photo rises; the vaccination card gets stamped dose by dose.
window.cena = ({ gsap, ScrollTrigger, reduz, $, $$ }) => {
  const sec = $(".pulso"), linha = $(".pu__linha", sec), bpm = $(".pu__bpm b", sec), foto = $(".pu__foto", sec);
  const L = linha.getTotalLength();
  linha.style.strokeDasharray = L;
  if (reduz) { linha.style.strokeDashoffset = 0; bpm.textContent = "92"; gsap.set(foto, { y: 0 }); }
  else {
    linha.style.strokeDashoffset = L;
    gsap.to(linha, { strokeDashoffset: L * 0.78, duration: 1.4, ease: "power2.out", delay: 0.2 }); // first beat on open
    const o = { b: 0 };
    const tl = gsap.timeline({ defaults: { ease: "none" } })
      .fromTo(linha, { strokeDashoffset: L * 0.78 }, { strokeDashoffset: 0, duration: 1 }, 0)
      .to(o, { b: 92, duration: 1, onUpdate: () => (bpm.textContent = Math.round(o.b)) }, 0)
      .fromTo(foto, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: "power2.out" }, 0.5)
      .to({}, { duration: 0.3 });
    ScrollTrigger.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * 1.8, pin: true, scrub: true, animation: tl });
  }

  const vc = $(".vacina"), carimbos = $$(".vc__carimbo", vc);
  if (reduz) gsap.set(carimbos, { opacity: 1 });
  else {
    const tv = gsap.timeline();
    carimbos.forEach((c, i) => tv.fromTo(c, { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, 0.2 + i * 0.5));
    tv.to({}, { duration: 0.4 });
    ScrollTrigger.create({ trigger: vc, start: "top top", end: () => "+=" + innerHeight * 1.8, pin: true, scrub: true, animation: tv });
  }
};
