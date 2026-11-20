'use client';
import { useEffect, useState } from 'react';

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export function countdown(openAtIso: string, now: number | null) {
  const target = new Date(openAtIso).getTime();
  const left = Math.max(0, target - (now ?? target));
  const days = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  // D-day 는 한국 날짜 기준
  const kst = (t: number) => Math.floor((t + 9 * 3600000) / 86400000);
  const dday = now === null ? null : kst(target) - kst(now);
  return { left, days, clock: `${days}일 ${pad(h)}:${pad(m)}:${pad(s)}`, dday, done: now !== null && left === 0 };
}
