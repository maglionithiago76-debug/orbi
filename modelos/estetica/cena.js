// Essenza Estética scenes: a drop falls, ripples and opens the photo in a growing circle; the protocol ring fills step by step.
window.cena = ({ gsap, ScrollTrigger, reduz, $, $$ }) => {
  const sec = $(".gota-sec"), foto = $(".gt__foto", sec), gota = $(".gt__gota", sec), ondas = $$(".gt__ondas i", sec);
  if (reduz) { foto.style.clipPath = "circle(150% at 50% 50%)"; sec.style.setProperty("--veu", 1); gota.style.display = "none"; }
  else {
    const o = { r: 0 };
    const tl = gsap.timeline({ defaults: { ease: "none" } })
      .to(gota, { y: () => innerHeight / 2 - 31, rotation: 180, duration: 0.6, ease: "power2.in" }, 0)
      .to(gota, { scaleY: 0.4, scaleX: 1.6, opacity: 0, duration: 0.12 }, 0.6);
    ondas.forEach((w, i) => tl.fromTo(w, { scale: 0, opacity: 0.9 }, { scale: 6 + i * 3, opacity: 0, duration: 0.8, ease: "power1.out" }, 0.62 + i * 0.12));
    tl.to(o, { r: 150, duration: 0.9, ease: "power2.in", onUpdate: () => (foto.style.clipPath = `circle(${o.r}% at 50% 50%)`) }, 0.68)
      .to(sec, { "--veu": 1, duration: 0.4 }, 1.2)
      .to({}, { duration: 0.3 });
    ScrollTrigger.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * 1.8, pin: true, scrub: true, animation: tl });
  }

  const pr = $(".protocolo"), fio = $(".pr__fio", pr), fotos = $$(".pr__fotos img", pr), falas = $$(".pr__fala", pr);
  const L = 2 * Math.PI * 94; fio.style.strokeDasharray = L;
  const n = falas.length;
  const ir = (p) => {
    fio.style.strokeDashoffset = L * (1 - p);
    const k = Math.min(n - 1, Math.floor(p * n));
    if (k === ir.k) return; ir.k = k;
    fotos.forEach((f, i) => gsap.to(f, { opacity: i === k ? 1 : 0, duration: 0.4, overwrite: true }));
    falas.forEach((f, i) => gsap.to(f, { opacity: i === k ? 1 : 0, y: i === k ? 0 : 16, duration: 0.35, overwrite: true }));
  };
  fio.style.strokeDashoffset = L;
  if (reduz) ir(1);
  else ScrollTrigger.create({ trigger: pr, start: "top top", end: () => "+=" + innerHeight * 2.2, pin: true, scrub: true, onUpdate: (s) => ir(s.progress) });
};
