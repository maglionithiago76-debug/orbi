// Essenza Estética scenes: the photo starts as a round window; a drop falls on it, it ripples and opens to the whole screen.
// Then the protocol ring fills step by step.
window.cena = (kit) => {
  const { gsap, ScrollTrigger, reduz } = kit, q = kit.$, qa = kit.$$;
  const sec = q(".gota-sec"), gota = q(".gt__gota", sec), ondas = qa(".gt__ondas i", sec);
  const fone = () => innerWidth < 760;
  const r0 = () => (fone() ? innerWidth * 0.42 : Math.min(innerHeight * 0.34, innerWidth * 0.21));
  const cy = () => innerHeight * (fone() ? 0.67 : 0.47);
  if (reduz) { sec.style.setProperty("--r", "150vmax"); sec.style.setProperty("--veu", 1); gota.style.display = "none"; }
  else {
    // the round window morphs into the whole picture: a square inset whose corners relax from a full circle to none
    const foto = q(".gt__foto", sec), o = { r: 0 };
    const abrir = () => {
      const W = foto.offsetWidth, H = foto.offsetHeight, r = r0(), y = H * (fone() ? 0.492 : 0.47), k = 1 - o.r;
      const v = [(y - r) * k, (W / 2 - r) * k, (H - y - r) * k, (W / 2 - r) * k].map((n) => Math.max(0, n).toFixed(1) + "px").join(" ");
      foto.style.clipPath = "inset(" + v + " round " + (r * k).toFixed(1) + "px)";
    };
    abrir();
    const tl = gsap.timeline({ defaults: { ease: "none" } })
      .to(gota, { y: () => cy() - 31, rotation: 180, duration: 0.5, ease: "power2.in" }, 0)
      .to(gota, { scaleY: 0.4, scaleX: 1.6, opacity: 0, duration: 0.1 }, 0.5);
    // rings hug the window, so they never run across the headline
    ondas.forEach((w, i) => tl.fromTo(w, { scale: 0, opacity: 0.9 }, { scale: () => (r0() * 2.5) / 200, opacity: 0, duration: 0.5, ease: "power1.out" }, 0.52 + i * 0.1));
    tl.fromTo(o, { r: 0 }, { r: 1, duration: 0.9, ease: "power2.in", onUpdate: abrir }, 0.6)
      .fromTo(sec, { "--veu": 0 }, { "--veu": 1, duration: 0.3 }, 0.6)
      .to({}, { duration: 0.25 });
    ScrollTrigger.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * 1.5, pin: true, scrub: true, animation: tl, invalidateOnRefresh: true, onRefresh: abrir });
  }

  const pr = q(".protocolo"), fio = q(".pr__fio", pr), fotos = qa(".pr__fotos img", pr), falas = qa(".pr__fala", pr);
  const L = 2 * Math.PI * 96, n = falas.length;
  fio.style.strokeDasharray = L;
  let atual = -1;
  const ir = (p) => {
    const k = Math.min(n - 1, Math.floor(p * n));
    fio.style.strokeDashoffset = L * (1 - p);
    if (k === atual) return;
    atual = k;
    fotos.forEach((f, i) => f.classList.toggle("on", i === k));
    falas.forEach((f, i) => f.classList.toggle("on", i === k));
  };
  ir(reduz ? 0.999 : 0.04);
  if (!reduz) ScrollTrigger.create({ trigger: pr, start: "top top", end: () => "+=" + innerHeight * 1.5, pin: true, scrub: true, onUpdate: (s) => ir(Math.min(0.999, 0.04 + s.progress * 1.04)) });
};
