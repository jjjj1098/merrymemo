'use client';
import { useEffect, useState } from 'react';
import Header from '../Header';
import Icon from '../Icon';
import Tree from '../Tree';
import AdBar from '../AdBar';
import BoardTop from './BoardTop';
import Progress from './Progress';
import LockedTip from './LockedTip';
import ShareSheet from './ShareSheet';
import KeyCard from './KeyCard';
import { useToast } from './Toast';
import { countdown, useNow } from '@/lib/useCountdown';
import { saveTreeImage } from '@/lib/saveImage';
import type { TreeProps } from './TreeApp';

export default function OwnerBoard(p: TreeProps & { ownerKey: string }) {
  const n = p.ornaments.length;
  const [share, setShare] = useState(false);
  const [showKey, setShowKey] = useState(p.isNew || n === 0);
  const [tap, setTap] = useState<number | null>(null);
  const [toast, showToast] = useToast();
  const now = useNow(1000);
  const cd = countdown(p.openAt, now);

  useEffect(() => { if (tap === null) return; const t = setTimeout(() => setTap(null), 2600); return () => clearTimeout(t); }, [tap]);
  useEffect(() => { if (cd.done) window.location.reload(); }, [cd.done]); // 0시가 되면 새로고침해서 뒤집기 화면으로

  const items = p.ornaments.map((o, i) => ({ id: o.id, kind: o.ornament, tapped: tap === i }));
  async function story() {
    showToast('이미지를 만들고 있어요…');
    try { await saveTreeImage({ style: p.style, owner: p.owner, kinds: p.ornaments.map((o) => o.ornament), opened: false }); }
    catch { showToast('이미지를 만들지 못했어요. 다시 시도해 주세요.'); }
  }

  return (
    <div className="screen" data-style={p.style}>
      <div className="col">
        <Header right={<button type="button" className="iconbtn end" aria-label="공유하기" onClick={() => setShare(true)}><Icon name="share" /></button>} />
        {n === 0 ? (
          <section className="center">
            <p className="badge soft" style={{ margin: 0 }}><Icon name="sparkle" size={13} />트리 완성!</p>
            <h1 className="h1" style={{ marginTop: 10 }}>{p.owner}의 트리가 생겼어요</h1>
            <p className="sub">링크를 보내면 친구들이 빈자리를 채워줘요</p>
          </section>
        ) : (
          <BoardTop owner={p.owner} count={n} openAt={p.openAt} />
        )}
        <div style={{ paddingTop: 12 }}>
          <Tree style={p.style} items={items} emptySlots={n === 0 ? 9 : 0} size={showKey ? 'md' : ''} onTap={(i) => setTap(i)} tapLabel="(25일에 열려요)" label={`장식 ${n}개가 걸린 트리`}>
            {tap !== null && <LockedTip index={tap} count={n} title="아직 잠겨 있어요" text="25일 0시에 뒤집을 수 있어요" />}
          </Tree>
        </div>
        {showKey ? (
          <KeyCard slug={p.slug} ownerKey={p.ownerKey} onToast={showToast} />
        ) : (
          <>
            {n > 0 && <Progress count={n} />}
            <div className="card center" style={{ padding: '10px 14px' }}>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--sub)' }}>크리스마스까지</p>
              <p style={{ margin: '2px 0 0', fontFamily: 'var(--display)', fontSize: 24, letterSpacing: 1, color: 'var(--bar)', fontVariantNumeric: 'tabular-nums' }} suppressHydrationWarning>{now === null ? ' ' : cd.clock}</p>
            </div>
          </>
        )}
        <div style={{ paddingTop: 14 }}><button type="button" className="btn" onClick={() => setShare(true)}><Icon name="share" size={20} stroke={2.2} />친구들한테 링크 보내기</button></div>
        <p className="center" style={{ margin: '6px 0 0' }}>
          <button type="button" className="linkbtn" onClick={() => setShowKey((v) => !v)}>{showKey ? '남은 시간 보기' : '열쇠 링크 다시 보기'}</button>
        </p>
      </div>
      <AdBar house={false} />
      {share && <ShareSheet slug={p.slug} owner={p.owner} count={n} style={p.style} onClose={() => setShare(false)} onToast={showToast} onStoryImage={story} />}
      {toast}
    </div>
  );
}
