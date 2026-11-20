'use client';
import { useEffect } from 'react';
import Icon from '../Icon';
import { copyText } from './Toast';
import type { TreeStyle } from '@/lib/ornaments';

const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
type KakaoSDK = { isInitialized(): boolean; init(k: string): void; Share: { sendDefault(o: unknown): void } };

function loadKakao(): Promise<KakaoSDK | null> {
  if (!KAKAO_KEY) return Promise.resolve(null);
  const w = window as unknown as { Kakao?: KakaoSDK };
  if (w.Kakao) return Promise.resolve(w.Kakao);
  return new Promise((res) => {
    const s = document.createElement('script');
    s.src = process.env.NEXT_PUBLIC_KAKAO_SDK_URL || 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    s.crossOrigin = 'anonymous';
    s.onload = () => res(w.Kakao || null);
    s.onerror = () => res(null);
    document.head.appendChild(s);
  });
}

export default function ShareSheet({ slug, owner, count, style, onClose, onToast, onStoryImage }: {
  slug: string; owner: string; count: number; style: TreeStyle; onClose: () => void; onToast: (m: string) => void; onStoryImage: () => void;
}) {
  const url = typeof window === 'undefined' ? '' : `${window.location.origin}/t/${slug}`;
  const title = `${owner}의 트리 · 장식 ${count}개`;
  const desc = '편지를 쓰면 트리에 장식이 하나 걸려요. 25일 0시에 열려요!';
  useEffect(() => { loadKakao(); }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  async function kakao() {
    const K = await loadKakao();
    if (K) {
      if (!K.isInitialized()) K.init(KAKAO_KEY!);
      K.Share.sendDefault({
        objectType: 'feed',
        content: { title, description: desc, imageUrl: `${window.location.origin}/og/${style}.png`, imageWidth: 1200, imageHeight: 600, link: { mobileWebUrl: url, webUrl: url } },
        buttons: [{ title: '장식 달러 가기', link: { mobileWebUrl: url, webUrl: url } }],
      });
      return;
    }
    await system();
  }
  async function system() {
    if (navigator.share) {
      try { await navigator.share({ title, text: desc, url }); } catch { /* 취소 */ }
    } else { await copy(); }
  }
  async function copy() {
    if (await copyText(url)) onToast('링크를 복사했어요. 단체방에 붙여 넣어 보세요!');
  }

  const targets: [string, string, string, string, () => void][] = [
    ['chat', '카카오톡', '#FEE500', '#3A1D1D', kakao],
    ['download', '스토리 이미지', '#F6E0E6', '#B0234F', onStoryImage],
    ['link', '링크 복사', '#EFE6D6', '#4A1A22', copy],
    ['more', '더보기', '#EFE6D6', '#4A1A22', system],
  ];
  return (
    <>
      <div className="dim" onClick={onClose} />
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="share-title">
        <span className="grab" aria-hidden="true" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <h2 id="share-title">친구들한테 링크 보내기</h2>
          <button type="button" className="iconbtn end" aria-label="닫기" onClick={onClose}><Icon name="close" /></button>
        </div>
        <p style={{ margin: '2px 0 0', fontSize: 13.5, color: '#7A5A58' }}>친구가 받으면 이렇게 보여요</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 12, padding: 14, borderRadius: 18, background: '#BACEE0' }}>
          <span aria-hidden="true" style={{ flex: 'none', width: 34, height: 34, borderRadius: 13, background: '#F2C14E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', color: '#5A1220', fontSize: 15 }}>{owner.slice(0, 1)}</span>
          <div style={{ flex: 1, maxWidth: 270, borderRadius: '4px 16px 16px 16px', background: '#fff', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,.08)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/og/${style}.png`} alt="" style={{ display: 'block', width: '100%', aspectRatio: '2 / 1', objectFit: 'cover' }} />
            <div style={{ padding: '10px 12px 12px' }}>
              <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: '#1F1F1F' }}>{title}</p>
              <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#666' }}>{desc}</p>
            </div>
          </div>
        </div>
        <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8, margin: '18px 0 0', padding: 0 }}>
          {targets.map(([ic, t, b, f, fn]) => (
            <li key={t}>
              <button type="button" onClick={fn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, width: '100%', padding: 0, border: 0, background: 'transparent', color: '#4A1A22', fontSize: 12.5, cursor: 'pointer' }}>
                <span style={{ width: 56, height: 56, borderRadius: 18, background: b, color: f, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={26} /></span>{t}
              </button>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, padding: '0 6px 0 14px', height: 50, borderRadius: 14, background: '#F3EBDD' }}>
          <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: '#6E4A4E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url.replace(/^https?:\/\//, '')}</span>
          <button type="button" onClick={copy} style={{ height: 38, padding: '0 14px', borderRadius: 10, border: 0, background: '#4A1A22', color: '#FFF7EC', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>복사</button>
        </div>
      </section>
    </>
  );
}
