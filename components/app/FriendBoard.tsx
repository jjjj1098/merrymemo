'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../Header';
import Icon from '../Icon';
import Tree from '../Tree';
import AdBar from '../AdBar';
import BoardTop from './BoardTop';
import LockedTip from './LockedTip';
import type { TreeProps } from './TreeApp';

export default function FriendBoard(p: TreeProps) {
  const n = p.ornaments.length;
  const [tap, setTap] = useState<number | null>(null);
  useEffect(() => { if (tap === null) return; const t = setTimeout(() => setTap(null), 2600); return () => clearTimeout(t); }, [tap]);
  const items = p.ornaments.map((o, i) => ({ id: o.id, kind: o.ornament, tapped: tap === i }));
  return (
    <div className="screen" data-style={p.style}>
      <div className="col">
        <Header />
        <BoardTop owner={p.owner} count={n} openAt={p.openAt} />
        <div style={{ paddingTop: 12 }}>
          <Tree style={p.style} items={items} emptySlots={n === 0 ? 6 : 0} onTap={(i) => setTap(i)} tapLabel={`(25일에 ${p.owner}만 열 수 있어요)`} label={`장식 ${n}개가 걸린 트리`}>
            {tap !== null && <LockedTip index={tap} count={n} title="편지는 비밀이에요" text={`25일 0시에 ${p.owner}만 열어볼 수 있어요`} />}
          </Tree>
        </div>
        <p className="sub center" style={{ marginTop: 8, fontSize: 14 }}>
          {n === 0 ? `첫 번째 장식을 걸어 줄래요?` : `벌써 장식 ${n}개가 걸렸어요. ${n + 1}번째는 너야!`}
        </p>
        <div style={{ paddingTop: 12 }}>
          <Link href={`/t/${p.slug}/write`} className="btn"><Icon name="pen" size={20} stroke={2.2} />{p.owner} 트리 꾸며주기</Link>
        </div>
        <p className="center" style={{ margin: '10px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 13, color: 'var(--sub)' }}>
          <Icon name="lock" size={13} stroke={2.4} />편지는 25일 0시 전까지 {p.owner}도 못 봐요
        </p>
      </div>
      <AdBar />
    </div>
  );
}
