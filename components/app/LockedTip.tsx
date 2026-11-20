'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import { layoutSlots } from '@/lib/slots';

/** 트리 안에서 누른 장식 위(또는 아래)에 뜨는 말풍선 */
export default function LockedTip({ index, count, title, text }: { index: number; count: number; title: string; text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; arrow: number; below: boolean } | null>(null);
  useLayoutEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const W = parent.clientWidth, H = parent.clientHeight, s = layoutSlots(count)[index];
    const cx = ((s.x + s.size / 2) / 340) * W;
    const below = s.y < 110;
    const tw = Math.min(220, W - 8);
    const left = Math.max(4, Math.min(W - tw - 4, cx - tw / 2));
    const top = below ? ((s.y + s.size) / 400) * H + 10 : (s.y / 400) * H - 14;
    setPos({ left, top, arrow: cx - left, below });
  }, [index, count]);
  return (
    <div ref={ref} role="status" className={`tip${pos?.below ? ' below' : ''}`}
      style={{ left: pos?.left ?? 0, top: pos?.top ?? 0, transform: pos?.below ? undefined : 'translateY(-100%)', visibility: pos ? 'visible' : 'hidden', ['--arrow' as string]: `${pos?.arrow ?? 0}px` }}>
      <b><Icon name="lock" size={16} stroke={2.5} />{title}</b>
      <p>{text}</p>
    </div>
  );
}
