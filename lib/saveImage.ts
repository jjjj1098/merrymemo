'use client';
import { layoutSlots } from './slots';
import { ORNAMENT_LABEL, type OrnamentKind, type TreeStyle } from './ornaments';

const THEME: Record<TreeStyle, { bg: string; fg: string; sub: string; accent: string; tile?: string; tileSize?: [number, number] }> = {
  classic: { bg: '#5A1220', fg: '#FFF7EC', sub: '#F0CDD2', accent: '#F2C14E', tile: '/bg/classic.svg', tileSize: [390, 844] },
  knit: { bg: '#A11F2C', fg: '#FFF7EC', sub: '#F8DADA', accent: '#FFF7EC', tile: '/bg/knit.svg', tileSize: [12, 14] },
  pixel: { bg: '#C23B37', fg: '#FFF7EC', sub: '#FBE0DA', accent: '#F6D04D', tile: '/bg/pixel.svg', tileSize: [390, 844] },
  illust: { bg: '#F5EEDF', fg: '#4A1A22', sub: '#7A5A58', accent: '#D7263D', tile: '/bg/illust.svg', tileSize: [390, 920] },
};

const cache = new Map<string, Promise<HTMLImageElement>>();
function img(src: string, w?: number, h?: number) {
  const k = `${src}@${w}x${h}`;
  if (!cache.has(k)) {
    cache.set(k, new Promise((res, rej) => {
      const i = new Image(w, h);
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = src;
    }));
  }
  return cache.get(k)!;
}

async function fonts(specs: [string, string][]) {
  try { await Promise.all(specs.map(([f, t]) => document.fonts.load(f, t))); } catch { /* 폰트 로딩 실패해도 기본 글꼴로 그려요 */ }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const lines: string[] = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(/(\s+)/)) {
      const tryLine = line + word;
      if (ctx.measureText(tryLine).width <= maxW) { line = tryLine; continue; }
      if (line.trim()) { lines.push(line.trimEnd()); line = ''; }
      // 단어 하나가 너무 길면 글자 단위로 나눠요
      let chunk = '';
      for (const ch of word.trimStart()) {
        if (ctx.measureText(chunk + ch).width > maxW) { lines.push(chunk); chunk = ch; } else chunk += ch;
      }
      line = chunk;
    }
    lines.push(line.trimEnd());
  }
  return lines;
}

async function background(ctx: CanvasRenderingContext2D, W: number, H: number, style: TreeStyle, scale: number) {
  const t = THEME[style];
  ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
  if (t.tile && t.tileSize) {
    const [tw, th] = t.tileSize.map((v) => v * scale);
    const tile = await img(t.tile, t.tileSize[0], t.tileSize[1]);
    for (let y = 0; y < H; y += th) for (let x = 0; x < W; x += tw) ctx.drawImage(tile, x, y, tw, th);
  }
  const g = ctx.createRadialGradient(W / 2, H * 0.48, 0, W / 2, H * 0.48, W * 0.7);
  g.addColorStop(0, style === 'illust' ? 'rgba(255,226,168,.55)' : 'rgba(255,159,107,.28)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

async function drawTree(ctx: CanvasRenderingContext2D, style: TreeStyle, kinds: OrnamentKind[], x: number, y: number, w: number) {
  const s = w / 340;
  ctx.drawImage(await img(`/trees/${style}.svg`, 340, 400), x, y, w, 400 * s);
  const slots = layoutSlots(kinds.length);
  const imgs = await Promise.all(kinds.map((k) => img(`/ornaments/${k}.svg`, 116, 116)));
  kinds.forEach((_, i) => {
    const sl = slots[i];
    const cx = x + (sl.x + sl.size / 2) * s, cy = y + (sl.y + sl.size / 2) * s, sz = sl.size * s;
    ctx.fillStyle = '#E9C46A';
    ctx.fillRect(cx - 1.2 * s, cy - sz * 0.74, 2.4 * s, sz * 0.32);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate((sl.rot * Math.PI) / 180);
    ctx.drawImage(imgs[i], -sz / 2, -sz / 2, sz, sz);
    ctx.restore();
  });
}

function logo(ctx: CanvasRenderingContext2D, cx: number, y: number, color: string, size = 40) {
  ctx.font = `${size}px Jua`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('메리메모', cx, y);
}

async function deliver(canvas: HTMLCanvasElement, filename: string, title: string) {
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/png'));
  const file = new File([blob], filename, { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try { await nav.share({ files: [file], title }); return 'shared'; } catch (e) { if ((e as Error).name === 'AbortError') return 'cancel'; }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return 'downloaded';
}

/** 트리 전체 (인스타 스토리 9:16, 1080×1920) */
export async function saveTreeImage(o: { style: TreeStyle; owner: string; kinds: OrnamentKind[]; opened: boolean }) {
  const W = 1080, H = 1920, t = THEME[o.style];
  const title = `${o.owner}의 트리`;
  const line = o.opened ? `친구 ${o.kinds.length}명이 편지를 걸어줬어요` : `장식 ${o.kinds.length}개 · 12월 25일 0시에 열려요`;
  await fonts([['90px Jua', title + '메리메모2026'], ['44px "Gowun Dodum"', line + 'CHRISTMAS']]);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d')!;
  await background(ctx, W, H, o.style, 2.77);
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = t.accent; ctx.font = '40px "Gowun Dodum"'; ctx.fillText('2 0 2 6   C H R I S T M A S', W / 2, 190);
  ctx.fillStyle = t.fg; ctx.font = '104px Jua'; ctx.fillText(title, W / 2, 330);
  ctx.fillStyle = t.sub; ctx.font = '44px "Gowun Dodum"'; ctx.fillText(line, W / 2, 410);
  await drawTree(ctx, o.style, o.kinds, 90, 500, 900);
  logo(ctx, W / 2, 1810, t.fg, 52);
  return deliver(c, `merrymemo-tree.png`, title);
}

/** 편지 한 장 (1080×1350) */
export async function saveLetterImage(o: { style: TreeStyle; to: string; from: string; message: string; kind: OrnamentKind }) {
  const W = 1080, H = 1350, t = THEME[o.style];
  await fonts([['64px Gaegu', `To. ${o.to}From. ${o.from}${o.message}`], ['bold 64px Gaegu', `To. ${o.to}From. ${o.from}`], ['40px Jua', '메리메모']]);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d')!;
  await background(ctx, W, H, o.style, 2.77);
  const cx = 110, cy = 150, cw = 860, ch = 1000, r = 56;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
  ctx.fillStyle = '#FFFDF7';
  ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, r); ctx.fill();
  ctx.restore();
  // 글이 길면 글자 크기를 줄여서 카드 안에 맞춰요
  let fs = 60, lh = 92, lines: string[] = [];
  const room = ch - 212 - 150;
  for (fs of [60, 54, 48, 43, 39]) {
    lh = Math.round(fs * 1.52);
    ctx.font = `${fs}px Gaegu`;
    lines = wrap(ctx, o.message, cw - 170);
    if ((lines.length - 1) * lh <= room) break;
  }
  ctx.save(); ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, r); ctx.clip();
  ctx.fillStyle = '#EADCC6';
  for (let y = cy + 212 + 18; y < cy + ch; y += lh) ctx.fillRect(cx, y, cw, 2.5);
  ctx.fillStyle = 'rgba(200,50,60,.35)'; ctx.fillRect(cx + 56, cy, 4, ch);
  ctx.restore();
  ctx.save(); ctx.translate(W / 2, cy); ctx.rotate(-0.05); ctx.fillStyle = 'rgba(233,185,73,.85)'; ctx.fillRect(-90, -24, 180, 48); ctx.restore();
  const orn = await img(`/ornaments/${o.kind}.svg`, 116, 116);
  ctx.drawImage(orn, cx + cw - 170, cy + 30, 140, 140);
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#C8323C'; ctx.font = 'bold 64px Gaegu'; ctx.fillText(`To. ${o.to}`, cx + 96, cy + 130);
  ctx.fillStyle = '#4A1A22'; ctx.font = `${fs}px Gaegu`;
  lines.forEach((l, i) => ctx.fillText(l, cx + 96, cy + 212 + i * lh));
  ctx.textAlign = 'right'; ctx.fillStyle = '#C8323C'; ctx.font = 'bold 64px Gaegu';
  ctx.fillText(`From. ${o.from}`, cx + cw - 70, cy + ch - 60);
  logo(ctx, W / 2, H - 70, t.fg, 44);
  return deliver(c, `merrymemo-${ORNAMENT_LABEL[o.kind]}.png`, `${o.from}의 편지`);
}
