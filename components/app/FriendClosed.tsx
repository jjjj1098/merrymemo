'use client';
import Link from 'next/link';
import Header from '../Header';
import Icon from '../Icon';
import Tree from '../Tree';
import AdBar from '../AdBar';
import type { TreeProps } from './TreeApp';

export default function FriendClosed(p: TreeProps) {
  const items = p.ornaments.map((o) => ({ id: o.id, kind: o.ornament }));
  return (
    <div className="screen" data-style={p.style}>
      <div className="col">
        <Header />
        <section className="center">
          <p className="badge ghost" style={{ margin: 0 }}><Icon name="gift" size={14} />12월 25일 · 편지 마감</p>
          <h1 className="h1" style={{ marginTop: 10 }}>{p.owner}의 트리는 이미 열렸어요</h1>
          <p className="sub">{p.owner}의 트리에 장식 {items.length}개가 걸렸어요</p>
        </section>
        <div style={{ paddingTop: 8 }}><Tree style={p.style} items={items} size="md" label={`장식 ${items.length}개가 걸린 트리`} /></div>
        <div className="paper-card center" style={{ marginTop: 12 }}>
          <p style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--display)', fontSize: 20 }}><Icon name="lock" size={18} stroke={2.4} />편지 쓰기는 마감됐어요</p>
          <p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.5, color: '#7A5A58' }}>12월 24일 자정까지만 장식을 달 수 있어요.<br />{p.owner}에게 직접 메리 크리스마스라고 말해 줘요!</p>
          <p style={{ margin: '10px 0 0', fontSize: 12.5, color: '#7A5A58' }}>내 트리라면 저장해 둔 열쇠 링크로 들어와 주세요.</p>
          <Link href="/" className="btn2" style={{ marginTop: 14, color: '#4A1A22', borderColor: '#D9C8B0' }}>메리메모 처음으로</Link>
        </div>
      </div>
      <AdBar />
    </div>
  );
}
