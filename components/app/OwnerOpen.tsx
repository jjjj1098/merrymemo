'use client';
import { useCallback, useEffect, useState } from 'react';
import Header from '../Header';
import Icon from '../Icon';
import Tree from '../Tree';
import AdBar, { Ad, hasAd } from '../AdBar';
import Ornament from '../Ornament';
import { useToast } from './Toast';
import { saveLetterImage, saveTreeImage } from '@/lib/saveImage';
import type { OrnamentKind } from '@/lib/ornaments';
import type { TreeProps } from './TreeApp';

type Letter = { id: string; ornament: OrnamentKind; from: string; message: string; read: boolean };

export default function OwnerOpen(p: TreeProps & { ownerKey: string }) {
  const [letters, setLetters] = useState<Letter[] | null>(null);
  const [err, setErr] = useState('');
  const [open, setOpen] = useState<number | null>(null);
  const [flipKey, setFlipKey] = useState(0);
  const [menu, setMenu] = useState(false);
  const [toast, showToast] = useToast();

  const api = useCallback((path: string, body: object) =>
    fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key: p.ownerKey, slug: p.slug, ...body }) }), [p.ownerKey, p.slug]);

  useEffect(() => {
    api(`/api/boards/${p.slug}/letters`, {}).then(async (r) => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setLetters(d.letters);
    }).catch((e) => setErr(e.message || '편지를 불러오지 못했어요.'));
  }, [api, p.slug]);

  const openLetter = (i: number) => {
    setOpen(i); setFlipKey((k) => k + 1);
    setLetters((ls) => ls && ls.map((l, j) => (j === i ? { ...l, read: true } : l)));
    const l = letters?.[i];
    if (l && !l.read) api(`/api/memos/${l.id}`, { action: 'read' }).catch(() => undefined);
  };
  const next = () => {
    if (!letters || open === null) return;
    for (let j = 1; j <= letters.length; j++) {
      const idx = (open + j) % letters.length;
      if (!letters[idx].read) { openLetter(idx); return; }
    }
    setOpen(null);
    showToast('편지를 모두 읽었어요!');
  };
  async function act(action: 'hide' | 'report') {
    if (!letters || open === null) return;
    const l = letters[open];
    const r = await api(`/api/memos/${l.id}`, { action });
    if (!r.ok) { showToast('잠시 후 다시 시도해 주세요.'); return; }
    setLetters(letters.filter((_, j) => j !== open));
    setMenu(false); setOpen(null);
    showToast(action === 'hide' ? '편지를 숨겼어요.' : '신고했어요. 편지는 숨겨졌어요.');
  }
  async function saveLetter() {
    if (!letters || open === null) return;
    const l = letters[open];
    showToast('이미지를 만들고 있어요…');
    try { await saveLetterImage({ style: p.style, to: p.owner, from: l.from, message: l.message, kind: l.ornament }); } catch { showToast('이미지를 만들지 못했어요.'); }
  }
  async function saveTree() {
    showToast('이미지를 만들고 있어요…');
    try { await saveTreeImage({ style: p.style, owner: p.owner, kinds: (letters || []).map((l) => l.ornament), opened: true }); } catch { showToast('이미지를 만들지 못했어요.'); }
  }

  const total = letters?.length ?? p.ornaments.length;
  const readN = letters?.filter((l) => l.read).length ?? 0;
  const allRead = !!letters && letters.length > 0 && readN === letters.length;
  const items = letters
    ? letters.map((l) => ({ id: l.id, kind: l.ornament, read: l.read, unread: !l.read }))
    : p.ornaments.map((o) => ({ id: o.id, kind: o.ornament }));
  const cur = letters && open !== null ? letters[open] : null;

  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (menu) setMenu(false); else setOpen(null); } };
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open, menu]);

  return (
    <div className="screen" data-style={p.style}>
      <div className="col">
        <Header right={<button type="button" className="iconbtn end" aria-label="트리 이미지로 저장" onClick={saveTree}><Icon name="download" /></button>} />
        <section className="center">
          <p className="badge red" style={{ margin: 0 }}><Icon name="gift" size={14} />12월 25일 · 오픈!</p>
          <h1 className="h1" style={{ marginTop: 10 }}>메리 크리스마스, {p.owner}!</h1>
          {total > 0 && (
            <div style={{ width: 220, margin: '10px auto 0' }}>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--sub)' }}>편지 {total}장 중 <strong style={{ color: 'var(--fg)' }}>{readN}장</strong> 읽었어요</p>
              <div className="prog" style={{ height: 6, marginTop: 6 }}><div style={{ width: `${total ? (readN / total) * 100 : 0}%` }} /></div>
            </div>
          )}
        </section>
        <div style={{ paddingTop: 10 }}>
          <Tree style={p.style} items={items} onTap={letters ? openLetter : undefined} tapLabel="편지 뒤집기" label="트리" />
        </div>
        {err && <p className="err center" role="alert">{err}</p>}
        {letters && letters.length === 0 && <p className="sub center">올해는 트리에 걸린 편지가 없어요. 내년엔 링크를 더 많이 보내 봐요!</p>}
        {allRead ? (
          <p style={{ margin: '10px 0 0', padding: 10, borderRadius: 12, background: 'rgba(242,193,78,.16)', color: 'var(--bar)', textAlign: 'center', fontSize: 14 }}>편지를 모두 읽었어요! 트리를 이미지로 남겨 보세요</p>
        ) : letters && letters.length > 0 && (
          <p className="sub center" style={{ fontSize: 14, marginTop: 8 }}>반짝이는 장식을 눌러서 편지를 뒤집어 봐요</p>
        )}
        {hasAd('300x250') && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}><Ad size="300x250" /></div>}
        <div style={{ paddingTop: 18 }}><button type="button" className="btn2" onClick={saveTree}><Icon name="download" size={18} />트리 전체를 이미지로 저장</button></div>
        <p className="center" style={{ margin: '12px 0 0', fontSize: 12.5, color: 'var(--sub)' }}>편지는 1월 말에 모두 지워져요. 간직하고 싶은 편지는 이미지로 저장해 두세요.</p>
      </div>
      <AdBar house={false} />

      {cur && open !== null && (
        <div role="dialog" aria-modal="true" aria-label={`${cur.from}의 편지`} style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'rgba(28,5,10,.82)', overflowY: 'auto' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <div style={{ width: 'min(330px, calc(100vw - 32px))', margin: '0 auto', padding: 'calc(16px + env(safe-area-inset-top)) 0 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--cream)' }}>
              <span style={{ fontSize: 14, color: 'var(--pink)' }}>편지 {open + 1} / {letters!.length}</span>
              <div style={{ display: 'flex' }}>
                <button type="button" className="iconbtn" style={{ color: 'var(--cream)' }} aria-label="숨기기·신고 메뉴" onClick={() => setMenu(true)}><Icon name="kebab" /></button>
                <button type="button" className="iconbtn end" style={{ color: 'var(--cream)' }} aria-label="닫기" onClick={() => setOpen(null)}><Icon name="close" /></button>
              </div>
            </div>
            <div className="flip-wrap" style={{ marginTop: 10 }}>
              <div className="flip" key={flipKey}>
                <div className="back" aria-hidden="true"><Ornament kind={cur.ornament} size={200} /></div>
                <article className="letter front" style={{ minHeight: 380 }}>
                  <span className="tape2" aria-hidden="true" />
                  <span className="corner"><Ornament kind={cur.ornament} size={46} /></span>
                  <p className="to">To. {p.owner}</p>
                  <p className="msg">{cur.message}</p>
                  <p className="from">From. {cur.from}</p>
                </article>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button type="button" onClick={saveLetter} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 52, borderRadius: 16, border: 0, background: 'var(--cream)', color: 'var(--ink)', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                <Icon name="download" size={18} stroke={2.2} />이미지로 저장
              </button>
              <button type="button" className="btn gold" onClick={next} style={{ flex: 1, height: 52, fontSize: 17 }}>
                {allRead ? '닫기' : <>다음 편지<Icon name="arrow" size={18} stroke={2.4} /></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {menu && cur && (
        <>
          <div className="dim" style={{ zIndex: 35 }} onClick={() => setMenu(false)} />
          <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="menu-title" style={{ zIndex: 36 }}>
            <span className="grab" aria-hidden="true" />
            <h2 id="menu-title" style={{ marginTop: 16 }}>{cur.from}의 편지</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#7A5A58' }}>보낸 친구에게 알림은 가지 않아요</p>
            <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, borderTop: '1px solid #EFE4D3' }}>
              {([['hide', 'eyeoff', '이 편지 숨기기', '트리에서 장식도 함께 빠져요', '#4A1A22', '#F3EBDD'], ['report', 'flag', '신고하기', '욕설이나 괴롭힘이 담긴 편지를 알려 주세요', '#C8323C', '#FBE3E5']] as const).map(([a, ic, t, d, c, b]) => (
                <li key={a}>
                  <button type="button" onClick={() => act(a)} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '14px 4px', border: 0, background: 'transparent', textAlign: 'left', color: c, cursor: 'pointer' }}>
                    <span style={{ flex: 'none', width: 44, height: 44, borderRadius: 14, background: b, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} /></span>
                    <span><span style={{ display: 'block', fontSize: 16, fontWeight: 700 }}>{t}</span><span style={{ display: 'block', marginTop: 2, fontSize: 13, color: '#7A5A58' }}>{d}</span></span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setMenu(false)} style={{ width: '100%', height: 52, marginTop: 8, borderRadius: 16, border: 0, background: '#F3EBDD', color: '#4A1A22', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>취소</button>
          </section>
        </>
      )}
      {toast}
    </div>
  );
}
