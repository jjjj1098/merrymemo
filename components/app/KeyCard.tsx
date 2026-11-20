'use client';
import Icon from '../Icon';
import { copyText } from './Toast';

export function keyUrl(slug: string, key: string) {
  return `${window.location.origin}/t/${slug}#k=${key}`;
}

export default function KeyCard({ slug, ownerKey, onToast }: { slug: string; ownerKey: string; onToast: (m: string) => void }) {
  const url = typeof window === 'undefined' ? '' : keyUrl(slug, ownerKey);
  const masked = url.replace(/^https?:\/\//, '').replace(/#k=(.{4}).*/, '#k=$1••••••');
  return (
    <div className="paper-card" style={{ marginTop: 10, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 32, height: 32, borderRadius: 10, background: '#FCE9B8', color: '#8A5A0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="key" size={18} /></span>
        <p style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 18 }}>내 트리 열쇠 링크</p>
      </div>
      <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.5, color: '#6E4A4E' }}>
        로그인이 없어서 이 링크가 있어야 다른 기기에서도 25일에 편지를 열 수 있어요. 나와의 채팅이나 메모에 꼭 저장해 두세요. <b>친구들한테는 보내지 마세요!</b>
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', height: 44, padding: '0 12px', borderRadius: 12, border: '1px solid #E5D6C0', background: '#fff', fontSize: 13, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{masked}</span>
        <button type="button" onClick={async () => { if (await copyText(url)) onToast('열쇠 링크를 복사했어요. 꼭 저장해 두세요!'); }}
          style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 5, height: 44, padding: '0 14px', borderRadius: 12, border: 0, background: '#4A1A22', color: '#FFF7EC', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          <Icon name="copy" size={16} />복사
        </button>
      </div>
    </div>
  );
}
