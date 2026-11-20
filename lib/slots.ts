/**
 * 트리 위 장식 자리 계산.
 * 트리 그림은 340×400 좌표계. 자리는 삼각형 안에 줄(row) 단위로 놓이고,
 * 줄 수 R일 때 자리 수 = R(R+1)/2 (R=5 → 15, 6 → 21, 7 → 28 …).
 * 자리가 다 차면 줄이 하나 늘어나며 트리가 "한 단 커져요".
 */
export type Slot = { x: number; y: number; size: number; rot: number };

const MIN_ROWS = 5;
export const capacity = (rows: number) => (rows * (rows + 1)) / 2;

export function rowsFor(count: number) {
  let r = MIN_ROWS;
  while (capacity(r) < count) r++;
  return r;
}

/** 지금 단계의 자리 수, 다음 단까지 남은 개수 */
export function tierInfo(count: number) {
  const rows = rowsFor(Math.max(count, 1));
  const cap = capacity(rows);
  const full = count >= cap;
  const nextCap = full ? capacity(rows + 1) : cap;
  return { rows, cap: nextCap, left: nextCap - count, tier: rows - MIN_ROWS + 1 };
}

function rand(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const memo = new Map<number, Slot[]>();
export function layoutSlots(count: number): Slot[] {
  const rows = rowsFor(Math.max(count, 1));
  const hit = memo.get(rows);
  if (hit) return hit;
  const res = build(rows);
  memo.set(rows, res);
  return res;
}

function build(rows: number): Slot[] {
  const top = 66;
  const bottom = 318;
  const rowH = (bottom - top) / rows;
  const size = Math.min(48, rowH * 0.92);
  const all: (Slot & { order: number })[] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    const n = r + 1;
    const cy = top + rowH * (r + 0.5);
    const half = (cy - 30) * 0.46; // 삼각형 반폭
    for (let c = 0; c < n; c++) {
      const t = n === 1 ? 0.5 : c / (n - 1);
      const cx = 170 + (t - 0.5) * 2 * half * 0.82 + (rand(idx) - 0.5) * 8;
      const y = cy - size / 2 + (rand(idx + 50) - 0.5) * 6;
      all.push({ x: cx - size / 2, y, size, rot: Math.round((rand(idx + 99) - 0.5) * 14), order: rand(idx + 7) + r * 0.0001 });
      idx++;
    }
  }
  // 빈자리에 "순서대로" 걸리되, 이미 걸린 장식들과 가장 먼 자리부터 채워서 트리 전체에 고르게 퍼지게 해요
  const center = (q: Slot) => [q.x + q.size / 2, (q.y + q.size / 2) * 1.15] as const;
  const left = [...all];
  const order: Slot[] = [];
  let first = 0; // 맨 위 꼭대기 자리부터
  for (let i = 1; i < left.length; i++) if (left[i].y < left[first].y) first = i;
  order.push(left.splice(first, 1)[0]);
  while (left.length) {
    let best = 0, bestD = -1;
    for (let i = 0; i < left.length; i++) {
      const [x, y] = center(left[i]);
      let d = Infinity;
      for (const o of order) { const [ox, oy] = center(o); d = Math.min(d, (x - ox) ** 2 + (y - oy) ** 2); }
      d += left[i].order * 40; // 같은 거리면 살짝 섞이게
      if (d > bestD) { bestD = d; best = i; }
    }
    order.push(left.splice(best, 1)[0]);
  }
  return order.map(({ ...s }) => ({ x: s.x, y: s.y, size: s.size, rot: s.rot }));
}
