#!/usr/bin/env node
/** Generate SVG food illustrations (placeholders) for menu & gallery images. */
const fs = require("fs");
const path = require("path");

const OUT_MENU = path.join(__dirname, "..", "public", "images", "menu");
const OUT_GALLERY = path.join(__dirname, "..", "public", "images", "gallery");
fs.mkdirSync(OUT_MENU, { recursive: true });
fs.mkdirSync(OUT_GALLERY, { recursive: true });

function bowl({ bg1, bg2, broth, label, emoji }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect width="800" height="600" fill="url(#glow)"/>
  <ellipse cx="400" cy="470" rx="240" ry="36" fill="#00000022"/>
  <path d="M180 300 a220 150 0 0 0 440 0 z" fill="#8a5a3b"/>
  <path d="M180 300 a220 150 0 0 0 440 0 z" fill="#00000018"/>
  <ellipse cx="400" cy="300" rx="220" ry="88" fill="${broth}"/>
  <ellipse cx="400" cy="296" rx="196" ry="74" fill="${broth}" opacity="0.85"/>
  <circle cx="320" cy="292" r="30" fill="#e8d5b7"/>
  <circle cx="470" cy="284" r="24" fill="#d9b98a"/>
  <circle cx="404" cy="316" r="26" fill="#caa06a"/>
  <ellipse cx="360" cy="278" rx="26" ry="14" fill="#f3e8d3"/>
  <ellipse cx="452" cy="312" rx="22" ry="12" fill="#efdfc4"/>
  <g fill="#2f7a4d">
    <ellipse cx="292" cy="268" rx="12" ry="5" transform="rotate(-24 292 268)"/>
    <ellipse cx="508" cy="272" rx="12" ry="5" transform="rotate(18 508 272)"/>
    <ellipse cx="392" cy="252" rx="11" ry="5" transform="rotate(40 392 252)"/>
  </g>
  <path d="M180 300 h440" stroke="#ffffff55" stroke-width="6" stroke-linecap="round"/>
  <text x="400" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#3b2a1a">${label}</text>
  <text x="400" y="180" text-anchor="middle" font-size="64">${emoji}</text>
</svg>`;
}

function drink({ bg1, bg2, liquid, label, emoji }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <linearGradient id="liq" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${liquid}" stop-opacity="0.9"/><stop offset="1" stop-color="${liquid}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <ellipse cx="400" cy="500" rx="180" ry="26" fill="#00000022"/>
  <path d="M310 180 h180 l-20 300 a20 20 0 0 1 -20 18 h-100 a20 20 0 0 1 -20 -18 z" fill="#ffffffcc"/>
  <path d="M322 250 h156 l-16 228 a14 14 0 0 1 -14 12 h-96 a14 14 0 0 1 -14 -12 z" fill="url(#liq)"/>
  <rect x="330" y="196" width="140" height="26" rx="13" fill="#ffffffee"/>
  <path d="M460 210 l70 -60" stroke="#c0392b" stroke-width="14" stroke-linecap="round"/>
  <circle cx="345" cy="238" r="8" fill="#ffffffaa"/><circle cx="368" cy="230" r="6" fill="#ffffffaa"/>
  <text x="400" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#3b2a1a">${label}</text>
  <text x="400" y="120" text-anchor="middle" font-size="60">${emoji}</text>
</svg>`;
}

function snack({ bg1, bg2, main, accent, label, emoji }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <ellipse cx="400" cy="480" rx="230" ry="34" fill="#00000022"/>
  <ellipse cx="400" cy="360" rx="210" ry="70" fill="#f5efe0"/>
  <ellipse cx="400" cy="344" rx="180" ry="56" fill="#ffffff"/>
  <rect x="270" y="250" width="120" height="110" rx="16" fill="${main}" transform="rotate(-8 330 305)"/>
  <rect x="390" y="240" width="120" height="110" rx="16" fill="${accent}" transform="rotate(6 450 295)"/>
  <circle cx="345" cy="270" r="10" fill="#ffffff55"/>
  <circle cx="465" cy="262" r="10" fill="#ffffff55"/>
  <text x="400" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#3b2a1a">${label}</text>
  <text x="400" y="150" text-anchor="middle" font-size="60">${emoji}</text>
</svg>`;
}

function scene({ bg1, bg2, label, emoji }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect x="80" y="320" width="640" height="180" rx="14" fill="#7c5a3e"/>
  <rect x="80" y="300" width="640" height="30" rx="10" fill="#9a7350"/>
  <ellipse cx="260" cy="292" rx="90" ry="22" fill="#ffffff" opacity="0.9"/>
  <path d="M230 292 a30 26 0 0 0 60 0 z" fill="#b07a4a"/>
  <ellipse cx="520" cy="292" rx="90" ry="22" fill="#ffffff" opacity="0.9"/>
  <path d="M490 292 a30 26 0 0 0 60 0 z" fill="#c98d52"/>
  <rect x="120" y="150" width="120" height="130" rx="10" fill="#ffffff55"/>
  <rect x="560" y="150" width="120" height="130" rx="10" fill="#ffffff55"/>
  <text x="400" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="40" font-weight="bold" fill="#3b2a1a">${label}</text>
  <text x="400" y="110" text-anchor="middle" font-size="56">${emoji}</text>
</svg>`;
}

// ---------- MENU ----------
const menuFiles = {
  "coto-ranukaya.svg": bowl({ bg1: "#fbbf24", bg2: "#f59e0b", broth: "#c98d52", label: "Coto Ranukaya", emoji: "🍲" }),
  "coto-ranukaya-spesial.svg": bowl({ bg1: "#fb923c", bg2: "#f97316", broth: "#b57a45", label: "Coto Ranukaya Spesial", emoji: "🍛" }),
  "coto-campur.svg": bowl({ bg1: "#fcd34d", bg2: "#fbbf24", broth: "#b57a45", label: "Coto Campur", emoji: "🥘" }),
  "coto-daging.svg": bowl({ bg1: "#fde68a", bg2: "#fcd34d", broth: "#d49a5e", label: "Coto Daging", emoji: "🍖" }),
  "es-teh.svg": drink({ bg1: "#fca5a5", bg2: "#f87171", liquid: "#b45309", label: "Es Teh Manis", emoji: "🧊" }),
  "es-jeruk.svg": drink({ bg1: "#fdba74", bg2: "#fb923c", liquid: "#ea8c1f", label: "Es Jeruk", emoji: "🍊" }),
  "pisang-ijo.svg": snack({ bg1: "#86efac", bg2: "#4ade80", main: "#facc15", accent: "#ef8ba8", label: "Pisang Ijo", emoji: "🍌" }),
  "buras.svg": snack({ bg1: "#d9f99d", bg2: "#bef264", main: "#fef3c7", accent: "#fde68a", label: "Buras", emoji: "🍙" }),
  "placeholder.svg": bowl({ bg1: "#e7e5e4", bg2: "#d6d3d1", broth: "#a8a29e", label: "Coto Ranukaya", emoji: "🍽️" }),
};
for (const [name, svg] of Object.entries(menuFiles)) {
  fs.writeFileSync(path.join(OUT_MENU, name), svg.trim() + "\n");
}

// ---------- GALLERY ----------
const galleryFiles = {
  "g1.svg": bowl({ bg1: "#fbbf24", bg2: "#f59e0b", broth: "#c98d52", label: "Coto Ranukaya", emoji: "🍲" }),
  "g2.svg": bowl({ bg1: "#fcd34d", bg2: "#fbbf24", broth: "#b57a45", label: "Coto Campur", emoji: "🥘" }),
  "g3.svg": snack({ bg1: "#86efac", bg2: "#4ade80", main: "#facc15", accent: "#ef8ba8", label: "Pisang Ijo", emoji: "🍌" }),
  "g4.svg": scene({ bg1: "#fdba74", bg2: "#fb923c", label: "Suasana Dalam", emoji: "🪑" }),
  "g5.svg": scene({ bg1: "#fcd34d", bg2: "#fbbf24", label: "Area Makan", emoji: "🍽️" }),
  "g6.svg": drink({ bg1: "#fca5a5", bg2: "#f87171", liquid: "#b45309", label: "Es Teh & Es Jeruk", emoji: "🥤" }),
  "hero.svg": bowl({ bg1: "#f59e0b", bg2: "#d97706", broth: "#b57a45", label: "Coto Ranukaya", emoji: "🍜" }),
};
for (const [name, svg] of Object.entries(galleryFiles)) {
  fs.writeFileSync(path.join(OUT_GALLERY, name), svg.trim() + "\n");
}

console.log("SVG images generated:", Object.keys(menuFiles).length + Object.keys(galleryFiles).length);
