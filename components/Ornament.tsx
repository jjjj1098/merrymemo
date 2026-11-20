import type { OrnamentKind } from '@/lib/ornaments';

export default function Ornament({ kind, size, className, style }: { kind: OrnamentKind; size?: number | string; className?: string; style?: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/ornaments/${kind}.svg`} alt="" draggable={false} width={typeof size === 'number' ? size : undefined}
      height={typeof size === 'number' ? size : undefined} className={className} style={{ display: 'block', ...style }} />
  );
}
