'use client';
import { useEffect, useState } from 'react';
import type { PublicOrnament } from '@/lib/store';
import type { TreeStyle } from '@/lib/ornaments';
import OwnerBoard from './OwnerBoard';
import FriendBoard from './FriendBoard';
import OwnerOpen from './OwnerOpen';
import FriendClosed from './FriendClosed';
import Header from '../Header';
import Tree from '../Tree';
import BoardTop from './BoardTop';

export type TreeProps = { slug: string; owner: string; style: TreeStyle; ornaments: PublicOrnament[]; openAt: string; opened: boolean; isNew: boolean };

/** 열쇠 링크(#k=…)나 이 기기에 저장된 열쇠로 주인인지 확인해요. 열쇠는 서버 주소창에 남지 않게 #으로만 다녀요. */
function useOwnerKey(slug: string) {
  const [state, setState] = useState<{ role: 'checking' | 'owner' | 'friend'; key: string | null }>({ role: 'checking', key: null });
  useEffect(() => {
    const storeKey = `mm:key:${slug}`;
    let key: string | null = null;
    const m = window.location.hash.match(/k=([\w-]+)/);
    if (m) {
      key = m[1];
      try { localStorage.setItem(storeKey, key); } catch { /* noop */ }
      // 주소창에서 열쇠를 지워서 실수로 친구에게 공유되지 않게 해요
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } else {
      try { key = localStorage.getItem(storeKey); } catch { /* noop */ }
    }
    if (!key) { setState({ role: 'friend', key: null }); return; }
    setState({ role: 'owner', key }); // 일단 주인으로 보여주고 서버에서 확인
    fetch(`/api/boards/${slug}/verify`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key }) })
      .then((r) => r.json())
      .then((d) => {
        if (!d.owner) {
          try { localStorage.removeItem(storeKey); } catch { /* noop */ }
          setState({ role: 'friend', key: null });
        }
      })
      .catch(() => { /* 오프라인이면 그대로 둬요 */ });
  }, [slug]);
  return state;
}

export default function TreeApp(p: TreeProps) {
  const { role, key } = useOwnerKey(p.slug);
  if (role === 'checking') {
    return (
      <div className="screen" data-style={p.style}>
        <div className="col">
          <Header />
          <BoardTop owner={p.owner} count={p.ornaments.length} openAt={p.openAt} />
          <div style={{ paddingTop: 12 }}><Tree style={p.style} items={p.ornaments.map((o) => ({ id: o.id, kind: o.ornament }))} label="트리" /></div>
        </div>
      </div>
    );
  }
  if (role === 'owner' && key) return p.opened ? <OwnerOpen {...p} ownerKey={key} /> : <OwnerBoard {...p} ownerKey={key} />;
  return p.opened ? <FriendClosed {...p} /> : <FriendBoard {...p} />;
}
