// Torch cursor: canvas overlay, darkens the scene and carves a flickering light hole at the mouse.
(function () {
  const canvas = document.getElementById("torch");
  const ctx = canvas.getContext("2d");

  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  let mx = w / 2, my = h / 2, tx = mx, ty = my;
  window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
  window.addEventListener("touchmove", (e) => {
    if (e.touches[0]) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }
  }, { passive: true });

  let flicker = 0;
  function frame() {
    // Smoothly chase the cursor
    mx += (tx - mx) * 0.2;
    my += (ty - my) * 0.2;

    // Flicker with a touch of random walk
    flicker += (Math.random() - 0.5) * 4;
    flicker *= 0.85;
    const baseR = 170;
    const r = baseR + flicker;

    // Dark veil
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(6, 4, 2, 0.90)";
    ctx.fillRect(0, 0, w, h);

    // Carve the light hole
    const grad = ctx.createRadialGradient(mx, my, 0, mx, my, r);
    grad.addColorStop(0, "rgba(255, 220, 160, 1)");
    grad.addColorStop(0.35, "rgba(255, 170, 80, 0.65)");
    grad.addColorStop(0.75, "rgba(255, 120, 40, 0.2)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, Math.PI * 2);
    ctx.fill();

    // Tiny warm spill over the veil
    ctx.globalCompositeOperation = "screen";
    const spill = ctx.createRadialGradient(mx, my, 0, mx, my, r * 1.4);
    spill.addColorStop(0, "rgba(255, 140, 60, 0.25)");
    spill.addColorStop(1, "rgba(255, 140, 60, 0)");
    ctx.fillStyle = spill;
    ctx.beginPath();
    ctx.arc(mx, my, r * 1.4, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(frame);
  }
  frame();
})();
