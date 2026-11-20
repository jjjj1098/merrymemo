'use client';
import { layoutSlots } from '@/lib/slots';
import type { OrnamentKind, TreeStyle } from '@/lib/ornaments';
import { ORNAMENT_LABEL } from '@/lib/ornaments';

export type TreeItem = { id: string; kind: OrnamentKind; read?: boolean; unread?: boolean; isNew?: boolean; tapped?: boolean };

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export default function Tree({
  style, items, onTap, emptySlots = 0, size = '', label, children, tapLabel,
}: {
  style: TreeStyle; items: TreeItem[]; onTap?: (index: number) => void; emptySlots?: number; size?: '' | 'sm' | 'md';
  label?: string; children?: React.ReactNode; tapLabel?: string;
}) {
  const total = Math.max(items.length, emptySlots);
  const slots = layoutSlots(total);
  return (
    <div className={`tree ${size}`} role={onTap ? undefined : 'img'} aria-label={onTap ? undefined : label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tree-art" src={`/trees/${style}.svg`} alt="" />
      {Array.from({ length: Math.max(0, emptySlots - items.length) }).map((_, j) => {
        const s = slots[items.length + j];
        const d = s.size * 0.75;
        return (
          <span key={`e${j}`} aria-hidden="true" className={`slot${j === 0 ? ' first' : ''}`}
            style={{ left: pct(s.x + (s.size - d) / 2, 340), top: pct(s.y + (s.size - d) / 2, 400), width: pct(d, 340), height: pct(d, 400) }}>
            <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </span>
        );
      })}
      {items.map((it, i) => {
        const s = slots[i];
        const st: React.CSSProperties = { left: pct(s.x, 340), top: pct(s.y, 400), width: pct(s.size, 340), height: pct(s.size, 400) };
        const inner = (
          <>
            <span className="string" aria-hidden="true" />
            {it.unread && <span className="pulse" aria-hidden="true" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/ornaments/${it.kind}.svg`} alt="" draggable={false} style={{ transform: `rotate(${s.rot}deg)` }} />
            {it.read && (
              <span className="check" aria-hidden="true">
                <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
            )}
            {it.isNew && <span className="newtag">NEW</span>}
          </>
        );
        const cls = `orn${it.isNew ? ' new' : ''}${it.tapped ? ' tapped' : ''}`;
        return onTap ? (
          <button key={it.id} type="button" className={cls} style={{ ...st, zIndex: it.isNew || it.tapped ? 2 : 1 }} onClick={() => onTap(i)}
            aria-label={`${ORNAMENT_LABEL[it.kind]} 장식${tapLabel ? ' ' + tapLabel : ''}${it.read ? ' (읽음)' : ''}`}>{inner}</button>
        ) : (
          <span key={it.id} className={cls} style={{ ...st, zIndex: it.isNew ? 2 : 1 }}>{inner}</span>
        );
      })}
      {children}
    </div>
  );
}
