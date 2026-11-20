'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import AdBar from '@/components/AdBar';
import Ornament from '@/components/Ornament';
import { ORNAMENTS, ORNAMENT_LABEL, type OrnamentKind, type TreeStyle } from '@/lib/ornaments';
import { MAX_MESSAGE, MAX_NAME } from '@/lib/config';
import { josa } from '@/lib/josa';

const DRAFT = (slug: string) => `mm:draft:${slug}`;

export default function WriteForm({ slug, owner, style, count }: { slug: string; owner: string; style: TreeStyle; count: number }) {
  const [kind, setKind] = useState<OrnamentKind>('ginger');
  const [message, setMessage] = useState('');
  const [from, setFrom] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ text: string; field?: string; words?: string[] } | null>(null);
  const router = useRouter();
  const len = [...message].length;

  // 쓰다 만 편지는 이 기기에 잠깐 보관해요
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT(slug)) || 'null');
      if (d) { setMessage(d.message || ''); setFrom(d.from || ''); if (d.kind) setKind(d.kind); }
      else setFrom(localStorage.getItem('mm:myname') || '');
    } catch { /* noop */ }
  }, [slug]);
  useEffect(() => {
    try { localStorage.setItem(DRAFT(slug), JSON.stringify({ message, from, kind })); } catch { /* noop */ }
  }, [slug, message, from, kind]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) { setError({ text: '편지를 써 주세요.', field: 'message' }); return; }
    if (!from.trim()) { setError({ text: '보내는 이름을 써 주세요.', field: 'from' }); return; }
    setBusy(true); setError(null);
    try {
      const r = await fetch(`/api/boards/${slug}/memos`, { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ornament: kind, message, from, website: (document.getElementById('website') as HTMLInputElement)?.value }) });
      const d = await r.json();
      if (!r.ok) { setError({ text: d.error, field: d.field, words: d.words }); setBusy(false); if (d.closed) router.refresh(); return; }
      try { localStorage.removeItem(DRAFT(slug)); localStorage.setItem('mm:myname', from.trim()); } catch { /* noop */ }
      router.replace(`/t/${slug}/sent?o=${kind}&n=${d.count}&from=${encodeURIComponent(from.trim())}`);
    } catch {
      setError({ text: '인터넷 연결을 확인하고 다시 눌러 주세요.' }); setBusy(false);
    }
  }

  const msgErr = error?.field === 'message';
  return (
    <div className="screen" data-style={style}>
      <form className="col" onSubmit={submit} noValidate>
        <Header back={`/t/${slug}`} />
        <section style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, padding: '10px 14px', borderRadius: 18, background: 'var(--card)', border: '1px solid var(--cardbd)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/trees/${style}.svg`} alt="" width={56} height={66} style={{ flex: 'none' }} />
          <div>
            <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontWeight: 400, fontSize: 24, lineHeight: 1.25 }}>{owner} 트리 꾸며주기</h1>
            <p style={{ margin: '3px 0 0', fontSize: 13.5, color: 'var(--sub)' }}>{count === 0 ? '첫 번째 장식을 걸어 줘요!' : `벌써 장식 ${count}개가 걸렸어요. ${count + 1}번째는 너야!`}</p>
          </div>
        </section>

        <fieldset style={{ border: 0, margin: 0, padding: '18px 0 0', minWidth: 0 }}>
          <legend style={{ padding: 0, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Step n={1} />걸어줄 장식 고르기</legend>
          <div role="radiogroup" aria-label="장식" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8, marginTop: 12 }}>
            {ORNAMENTS.map((k) => {
              const sel = k === kind;
              return (
                <button key={k} type="button" role="radio" aria-checked={sel} onClick={() => setKind(k)}
                  style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: 76, padding: '8px 0 0', borderRadius: 16, cursor: 'pointer', fontSize: 11, letterSpacing: -0.3,
                    border: sel ? '2.5px solid var(--gold)' : '1px solid var(--tilebd)', background: sel ? 'rgba(242,193,78,.18)' : 'var(--tile)', color: sel ? 'var(--fg)' : 'var(--sub)' }}>
                  <Ornament kind={k} size={40} /><span style={{ whiteSpace: 'nowrap' }}>{ORNAMENT_LABEL[k]}</span>
                  {sel && <span aria-hidden="true" style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: 'var(--gold)', color: '#3A1A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={12} stroke={3.4} /></span>}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div style={{ paddingTop: 20 }}>
          <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Step n={2} />장식 뒤에 숨길 편지 쓰기</p>
          <div className="letter" style={{ padding: '20px 18px 14px 32px', boxShadow: '0 10px 24px rgba(0,0,0,.28)', outline: msgErr ? '3px solid #FF8A8A' : undefined, outlineOffset: 2 }}>
            <span className="tape2" aria-hidden="true" style={{ background: 'rgba(242,167,181,.85)' }} />
            <span className="corner" style={{ width: 42, height: 42 }}><Ornament kind={kind} size={42} /></span>
            <p className="to" style={{ fontSize: 22 }}>To. {owner}</p>
            <label htmlFor="msg" className="sr">편지 내용</label>
            <textarea id="msg" rows={5} value={message} placeholder={`${josa(owner, '아야')}! 올해 고마웠던 일 하나, 내년에 같이 하고 싶은 일 하나를 써 보세요`}
              onChange={(e) => { setMessage([...e.target.value].slice(0, MAX_MESSAGE).join('')); if (msgErr) setError(null); }}
              aria-invalid={msgErr} aria-describedby={msgErr ? 'formerr' : undefined}
              style={{ display: 'block', width: '100%', marginTop: 6, border: 0, padding: 0, background: 'transparent', color: 'var(--ink)', fontFamily: 'var(--hand)', fontSize: 21, lineHeight: '34px', resize: 'none', outline: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, gap: 8 }}>
              <span style={{ fontSize: 12, color: len >= MAX_MESSAGE ? '#C8323C' : '#9A7A70' }} aria-live="polite">{len} / {MAX_MESSAGE}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <label htmlFor="from" style={{ fontFamily: 'var(--hand)', fontWeight: 700, fontSize: 21, color: '#C8323C' }}>From.</label>
                <input id="from" value={from} maxLength={MAX_NAME} placeholder="내 이름" autoComplete="nickname" onChange={(e) => { setFrom(e.target.value); if (error?.field === 'from') setError(null); }}
                  aria-invalid={error?.field === 'from'}
                  style={{ width: 110, height: 36, border: 0, borderBottom: `1.5px solid ${error?.field === 'from' ? '#C8323C' : 'var(--ink)'}`, background: 'transparent', color: 'var(--ink)', fontFamily: 'var(--hand)', fontSize: 21, padding: '0 4px', borderRadius: 0 }} />
              </div>
            </div>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 12.5, color: 'var(--sub)' }}>이름은 별명이나 ‘비밀 산타’도 괜찮아요. 한 번 걸면 고칠 수 없어요.</p>
        </div>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1 }} />

        {error && (
          <p id="formerr" role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, margin: '12px 0 0', padding: '10px 12px', borderRadius: 12, background: '#FFE1E1', color: '#8E1622', fontSize: 13.5, lineHeight: 1.45 }}>
            <span style={{ flex: 'none', width: 20, height: 20, borderRadius: '50%', background: '#C8323C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>!</span>
            <span>{error.words?.length
              ? <><strong>{error.words.map((w) => `‘${w}’`).join(', ')}</strong>{josa(error.words[error.words.length - 1], '은는').slice(-1)} 쓸 수 없는 말이에요. {owner}{josa(owner, '이가').slice(-1)} 25일에 웃으면서 읽을 수 있게 바꿔 줄래요?</>
              : error.text}</span>
          </p>
        )}
        <div style={{ paddingTop: 16 }}>
          <button type="submit" className="btn" disabled={busy || !!error?.words?.length}>{busy ? '장식 다는 중…' : '트리에 장식 달기'}</button>
        </div>
        <p className="center" style={{ margin: '12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 13, color: 'var(--sub)' }}>
          <Icon name="lock" size={13} stroke={2.4} />편지는 25일 0시 전까지 {owner}도 못 봐요
        </p>
      </form>
      <AdBar />
    </div>
  );
}

function Step({ n }: { n: number }) {
  return <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--gold)', color: '#3A1A0A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontSize: 13 }}>{n}</span>;
}
