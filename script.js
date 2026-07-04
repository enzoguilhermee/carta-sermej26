// ---------- Fogos de artifício ----------
(function(){
  const canvas = document.getElementById("fireworks");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduceMotion) return;

  let w, h;
  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const palette = ["#f4b93c", "#f2703c", "#8b95e0", "#5f86c9", "#f3ecd6"];
  const rand = (min, max) => Math.random() * (max - min) + min;

  let rockets = [];
  let particles = [];

  function launchRocket(){
    const x = rand(w * 0.12, w * 0.88);
    rockets.push({
      x,
      y: h,
      targetY: rand(h * 0.16, h * 0.46),
      vy: rand(-7.6, -6.2),
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }

  function explode(x, y, color){
    const count = 44 + Math.floor(Math.random() * 22);
    for(let i = 0; i < count; i++){
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.25;
      const speed = rand(1.4, 5.2);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size: rand(1.1, 2.4),
        decay: rand(0.011, 0.019)
      });
    }
  }

  function tick(){
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    for(let i = rockets.length - 1; i >= 0; i--){
      const r = rockets[i];
      r.y += r.vy;
      r.vy += 0.05;

      ctx.beginPath();
      ctx.fillStyle = r.color;
      ctx.globalAlpha = 0.9;
      ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
      ctx.fill();

      if(r.vy >= 0 || r.y <= r.targetY){
        explode(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    }

    for(let i = particles.length - 1; i >= 0; i--){
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.045;
      p.vx *= 0.985;
      p.alpha -= p.decay;

      if(p.alpha <= 0){
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(tick);
  }

  function scheduleNext(){
    launchRocket();
    if(Math.random() < 0.35) setTimeout(launchRocket, rand(220, 480));
    setTimeout(scheduleNext, rand(2200, 4200));
  }

  tick();
  setTimeout(scheduleNext, 1000);
})();

// ---------- Lanterna que segue o cursor ----------
(function(){
  const flashlight = document.getElementById("flashlight");
  if(!flashlight) return;

  function setSpot(x, y){
    flashlight.style.setProperty("--mx", x + "px");
    flashlight.style.setProperty("--my", y + "px");
  }

  setSpot(window.innerWidth / 2, window.innerHeight * 0.35);

  window.addEventListener("mousemove", (e) => setSpot(e.clientX, e.clientY));
  window.addEventListener("touchmove", (e) => {
    if(e.touches[0]) setSpot(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
})();

// ---------- Envelope ----------
const carta = document.getElementById("carta");

function toggleCarta(){
  const isOpen = carta.classList.toggle("open");
  carta.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

carta.addEventListener("click", toggleCarta);
carta.addEventListener("keydown", (e) => {
  if(e.key === "Enter" || e.key === " "){
    e.preventDefault();
    toggleCarta();
  }
});

// ---------- Efeito magnético ----------
const magnets = document.querySelectorAll(".magnet");
magnets.forEach((magnet) => {
  magnet.addEventListener("mousemove", (e) => {
    const rect = magnet.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const moveX = (relX - rect.width / 2) * 0.3;
    const moveY = (relY - rect.height / 2) * 0.3;
    gsap.to(magnet, { x: moveX, y: moveY, duration: 0.3, ease: "power2.out" });
  });
  magnet.addEventListener("mouseleave", () => {
    gsap.to(magnet, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
  });
});

// ---------- QR code para a contagem regressiva ----------
// Aponta sempre para countdown.html no mesmo lugar onde a carta estiver hospedada.
const countdownUrl = new URL("countdown.html", window.location.href).href;

new QRCode(document.getElementById("qrcode"), {
  text: countdownUrl,
  width: 128,
  height: 128,
  colorDark: "#0a1730",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.M
});

document.getElementById("qrcode").addEventListener("click", () => {
  window.location.href = countdownUrl;
});

// ---------- Frase: some, e uma faísca acende de volta ----------
const textEl = document.getElementById("typingText");
const sparkDot = document.getElementById("sparkDot");
const msgWrap = document.getElementById("msgWrap");
const phrases = [
  "VOCÊ TÁ PREPARADO?",
  "CONEXÕES QUE INCENDEIAM",
];
let phraseIndex = 0;

async function cycleMessage(){
  // 1. frase visível e acesa por um tempo
  await gsap.to({}, { duration: 1.2 }); // pausa

  // 2. a frase apaga
  await gsap.to(textEl, {
    opacity: 0,
    y: 6,
    filter: "blur(3px)",
    duration: 0.55,
    ease: "power1.in"
  });

  // troca o texto enquanto está apagado
  phraseIndex = (phraseIndex + 1) % phrases.length;
  textEl.textContent = phrases[phraseIndex];

  // 3. a faísca atravessa e acende a frase de volta
  const wrapWidth = msgWrap.offsetWidth;
  gsap.set(sparkDot, { x: 0, opacity: 0, scale: 0.5 });

  const igniteTl = gsap.timeline();
  igniteTl
    .to(sparkDot, { opacity: 1, scale: 1, duration: 0.15 })
    .to(sparkDot, {
      x: wrapWidth,
      duration: 0.75,
      ease: "power1.inOut"
    }, "<")
    .to(sparkDot, { opacity: 0, duration: 0.25 }, "-=0.2")
    .to(textEl, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.35,
      ease: "power2.out"
    }, "-=0.55")
    .fromTo(textEl,
      { textShadow: "0 0 6px #fff, 0 0 40px rgba(244,185,60,1), 0 0 80px rgba(242,112,60,0.9)" },
      {
        textShadow: "2px 2px 6px rgba(0,0,0,0.5), 0 0 12px rgba(244,185,60,0.5)",
        duration: 0.9,
        ease: "power2.out"
      }, "-=0.3");

  await igniteTl;

  // 4. repete pra sempre
  cycleMessage();
}

cycleMessage();

