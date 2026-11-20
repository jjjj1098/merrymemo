import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Viewport } from 'next';
import { getStore } from '@/lib/store';
import { isOrnament, STYLE_INFO } from '@/lib/ornaments';
import Header from '@/components/Header';
import Tree from '@/components/Tree';
import AdBar from '@/components/AdBar';
import { josa } from '@/lib/josa';

export const dynamic = 'force-dynamic';
type P = { params: Promise<{ slug: string }>; searchParams: Promise<{ o?: string; from?: string }> };

export const metadata = { title: '장식이 걸렸어요', robots: { index: false } };
export async function generateViewport({ params }: P): Promise<Viewport> {
  const b = await getStore().getBoard((await params).slug);
  return { themeColor: b ? STYLE_INFO[b.tree_style].theme : '#5A1220' };
}

export default async function SentPage({ params, searchParams }: P) {
  const { slug } = await params;
  const { o, from = '' } = await searchParams;
  const store = getStore();
  const board = await store.getBoard(slug);
  if (!board) notFound();
  const orns = await store.listOrnaments(board.id);
  // 방금 단 장식 = 같은 종류 중 가장 마지막
  let newIdx = -1;
  if (isOrnament(o)) for (let i = orns.length - 1; i >= 0; i--) if (orns[i].ornament === o) { newIdx = i; break; }
  const items = orns.map((x, i) => ({ id: x.id, kind: x.ornament, isNew: i === newIdx }));
  const name = from.trim().slice(0, 10);
  return (
    <div className="screen" data-style={board.tree_style}>
      <div className="col">
        <Header />
        <section className="center">
          <h1 className="h1" style={{ fontSize: 'clamp(24px, 7vw, 28px)' }}>{board.owner_name} 트리에 장식이 걸렸어요!</h1>
          <p className="sub" style={{ fontSize: 14.5 }}>{orns.length}번째 장식이에요. 25일 0시에 {josa(board.owner_name, '이가')} 뒤집어 볼 거예요</p>
        </section>
        <div style={{ paddingTop: 8 }}><Tree style={board.tree_style} items={items} size="md" label="방금 단 장식이 걸린 트리" /></div>
        <div className="paper-card center" style={{ marginTop: 16, padding: '22px 18px 14px' }}>
          <span className="tape" aria-hidden="true" />
          <h2 style={{ margin: 0, fontFamily: 'var(--display)', fontWeight: 400, fontSize: 23 }}>{name ? `${name}도 트리 받아볼래요?` : '나도 트리 받아볼래요?'}</h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: '#7A5A58' }}>이름만 쓰면 10초 만에 내 트리가 생겨요</p>
          <div style={{ marginTop: 14 }}><Link href="/" className="btn red">나도 트리 만들기</Link></div>
          <Link href={`/t/${slug}`} style={{ display: 'inline-block', marginTop: 6, padding: 10, fontSize: 13.5, color: '#7A5A58', textUnderlineOffset: 3 }}>{board.owner_name} 트리 다시 보기</Link>
        </div>
      </div>
      <AdBar />
    </div>
  );
}
