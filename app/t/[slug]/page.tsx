import { notFound } from 'next/navigation';
import type { Metadata, Viewport } from 'next';
import { getStore } from '@/lib/store';
import { isOpen, OPEN_AT } from '@/lib/config';
import { STYLE_INFO } from '@/lib/ornaments';
import TreeApp from '@/components/app/TreeApp';

export const dynamic = 'force-dynamic';
type P = { params: Promise<{ slug: string }>; searchParams: Promise<{ new?: string }> };

async function load(slug: string) {
  const store = getStore();
  const board = await store.getBoard(slug);
  if (!board) return null;
  const ornaments = await store.listOrnaments(board.id);
  return { board, ornaments };
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const d = await load((await params).slug);
  if (!d) return { title: '트리를 찾을 수 없어요' };
  const title = `${d.board.owner_name}의 트리 · 장식 ${d.ornaments.length}개`;
  const description = isOpen() ? `${d.board.owner_name}의 트리가 크리스마스에 열렸어요.` : '편지를 쓰면 트리에 장식이 하나 걸려요. 12월 25일 0시에 열려요!';
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, images: [{ url: `/og/${d.board.tree_style}.png`, width: 1200, height: 600 }] },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export async function generateViewport({ params }: P): Promise<Viewport> {
  const d = await load((await params).slug);
  return { themeColor: d ? STYLE_INFO[d.board.tree_style].theme : '#5A1220' };
}

export default async function TreePage({ params, searchParams }: P) {
  const { slug } = await params;
  const sp = await searchParams;
  const d = await load(slug);
  if (!d) notFound();
  return (
    <TreeApp slug={slug} owner={d.board.owner_name} style={d.board.tree_style} ornaments={d.ornaments}
      openAt={OPEN_AT.toISOString()} opened={isOpen()} isNew={sp.new === '1'} />
  );
}
