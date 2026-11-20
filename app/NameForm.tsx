'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import { MAX_NAME } from '@/lib/config';

export default function NameForm() {
  const [name, setName] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16 }}
      onSubmit={(e) => {
        e.preventDefault();
        const n = name.trim();
        if (!n) { setErr('친구들이 부르는 이름을 써 주세요.'); return; }
        router.push(`/new?name=${encodeURIComponent(n)}`);
      }}>
      <label htmlFor="nick" className="field-label">내 이름<span>로그인 없이 이름만 있으면 돼요</span></label>
      <input id="nick" className="input" placeholder="친구들이 부르는 이름 (예: 민지)" maxLength={MAX_NAME} value={name} autoComplete="nickname"
        enterKeyHint="next" onChange={(e) => { setName(e.target.value); setErr(''); }} aria-invalid={!!err} aria-describedby={err ? 'nickerr' : undefined} />
      {err && <p id="nickerr" className="err" role="alert" style={{ margin: 0 }}>{err}</p>}
      <button type="submit" className="btn" style={{ marginTop: 4 }}>내 트리 만들기<Icon name="arrow" size={20} stroke={2.2} /></button>
    </form>
  );
}
