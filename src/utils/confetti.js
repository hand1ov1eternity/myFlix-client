let styleInjected = false;

function ensureStyle() {
  if (styleInjected) return;
  const style = document.createElement("style");
  style.textContent = `
@keyframes confetti-fall {
  0%   { opacity: 0; transform: translateY(0) scale(0.9) rotate(0deg); }
  10%  { opacity: 1; }
  100% { transform: translateY(-40vh) translateX(calc(-50% + (50vw - 50%))) rotate(360deg); opacity: 0; }
}`;
  document.head.appendChild(style);
  styleInjected = true;
}

/**
 * Fire a small confetti burst using emoji (no dependencies).
 * @param {string[]} icons e.g. ["🎉","✨","💥","💫"]
 * @param {number} count  number of pieces
 * @param {number} duration ms animation duration
 */
export function popConfetti(icons = ["🎉","✨","💥","💫"], count = 18, duration = 1000) {
  ensureStyle();

  const layer = document.createElement("div");
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  layer.style.zIndex = "9999";
  document.body.appendChild(layer);

  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = icons[Math.floor(Math.random() * icons.length)];
    s.style.position = "absolute";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = "60vh";
    s.style.fontSize = 16 + Math.random() * 18 + "px";
    s.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
    s.style.animation = `confetti-fall ${duration}ms ease-out forwards`;
    layer.appendChild(s);
  }

  setTimeout(() => layer.remove(), duration + 200);
}
