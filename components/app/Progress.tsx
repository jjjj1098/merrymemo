import { tierInfo } from '@/lib/slots';
export default function Progress({ count }: { count: number }) {
  const { cap, left } = tierInfo(count);
  return (
    <div className="card">
      <div className="prog-row"><b>{left > 0 ? `장식 ${left}개 더 모이면 트리가 한 단 커져요` : '트리가 한 단 커졌어요!'}</b><span>{count}/{cap}</span></div>
      <div className="prog" role="progressbar" aria-label="다음 단까지" aria-valuenow={count} aria-valuemin={0} aria-valuemax={cap}><div style={{ width: `${Math.round((count / cap) * 100)}%` }} /></div>
    </div>
  );
}
