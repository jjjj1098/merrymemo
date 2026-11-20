'use client';
import Icon from '../Icon';
import { countdown, useNow } from '@/lib/useCountdown';

export default function BoardTop({ owner, count, openAt }: { owner: string; count: number; openAt: string }) {
  const now = useNow(60000);
  const { dday } = countdown(openAt, now);
  return (
    <section className="center">
      <h1 className="h1">{owner}의 트리</h1>
      <div className="chips">
        <span className="chip">장식 {count}개 · 편지 {count}장</span>
        <span className="chip two"><Icon name="lock" size={14} stroke={2.5} />25일 0시 오픈{dday !== null && dday > 0 ? ` · D-${dday}` : ''}</span>
      </div>
    </section>
  );
}
