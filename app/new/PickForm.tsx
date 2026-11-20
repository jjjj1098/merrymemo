'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import { STYLES, STYLE_INFO, type TreeStyle } from '@/lib/ornaments';
import { MAX_NAME } from '@/lib/config';
import { josa } from '@/lib/josa';

export default function PickForm({ name: initial }: { name: string }) {
  const [style, setStyle] = useState<TreeStyle>('classic');
  const [name, setName] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();

  async function create() {
    const n = name.trim();
    if (!n) { setErr('이름을 먼저 써 주세요.'); return; }
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/boards', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: n, style }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || '잠시 후 다시 시도해 주세요.');
      try { localStorage.setItem(`mm:key:${d.slug}`, d.key); } catch { /* 사파리 개인정보 보호 모드 */ }
      window.location.replace(`/t/${d.slug}?new=1#k=${d.key}`);
    } catch (e) {
      setErr((e as Error).message); setBusy(false);
    }
  }

  return (
    <>
      <section style={{ paddingTop: 8 }}>
        <p style={{ margin: 0, fontSize: 13, color: '#2E7A4F', fontWeight: 700 }}>2 / 2 단계</p>
        {initial ? (
          <h1 className="h1" style={{ marginTop: 6 }}>{josa(initial, '은는')} 어떤 트리로<br />꾸며볼까?</h1>
        ) : (
          <>
            <h1 className="h1" style={{ marginTop: 6 }}>어떤 트리로 꾸며볼까?</h1>
            <label htmlFor="nick2" className="sr">내 이름</label>
            <input id="nick2" className="input" style={{ marginTop: 12, border: '2px solid #E5D6C0' }} placeholder="친구들이 부르는 이름" maxLength={MAX_NAME} value={name} onChange={(e) => setName(e.target.value)} />
          </>
        )}
        <p className="sub" style={{ marginTop: 6, fontSize: 14 }}>배경색도 트리를 따라 바뀌어요</p>
      </section>
      <div role="radiogroup" aria-label="트리 스타일" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, paddingTop: 18 }}>
        {STYLES.map((k) => {
          const sel = k === style;
          const info = STYLE_INFO[k];
          return (
            <button key={k} type="button" role="radio" aria-checked={sel} onClick={() => setStyle(k)}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: 0, borderRadius: 22, background: '#fff', overflow: 'hidden', textAlign: 'left', color: '#4A1A22', cursor: 'pointer',
                border: `3px solid ${sel ? '#D7263D' : 'transparent'}`, boxShadow: sel ? '0 10px 24px rgba(215,38,61,.22)' : '0 6px 16px rgba(74,26,34,.10)', transition: 'border-color .15s' }}>
              <span style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: 140,
                background: k === 'knit' ? `url(/bg/knit.svg) 0 0 / 12px 14px, ${info.bg}` : info.bg }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/trees/${k}.svg`} alt="" style={{ width: 112, height: 132, marginBottom: 4 }} />
                {sel && (
                  <span style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%', background: '#D7263D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 3px rgba(255,255,255,.9)' }}>
                    <Icon name="check" size={16} stroke={3} />
                  </span>
                )}
              </span>
              <span style={{ display: 'block', padding: '12px 14px 14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--display)', fontSize: 19 }}>{info.name}
                  <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: '50%', background: info.bg, border: '1px solid rgba(74,26,34,.25)' }} /></span>
                <span style={{ display: 'block', marginTop: 3, fontSize: 12.5, color: '#7A5A58' }}>{info.desc}</span>
              </span>
            </button>
          );
        })}
      </div>
      {err && <p role="alert" style={{ margin: '12px 0 0', color: '#B3261E', fontSize: 14 }}>{err}</p>}
      <div style={{ paddingTop: 18 }}>
        <button type="button" className="btn red" onClick={create} disabled={busy} style={busy ? { background: '#E89AA4', color: '#fff' } : undefined}>
          {busy ? '트리를 세우는 중…' : `${STYLE_INFO[style].name} 트리로 시작`}
        </button>
      </div>
    </>
  );
}
