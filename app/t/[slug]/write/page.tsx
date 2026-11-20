import { notFound, redirect } from 'next/navigation';
import type { Viewport } from 'next';
import { getStore } from '@/lib/store';
import { isOpen } from '@/lib/config';
import { STYLE_INFO } from '@/lib/ornaments';
import WriteForm from './WriteForm';

export const dynamic = 'force-dynamic';
type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P) {
  const b = await getStore().getBoard((await params).slug);
  return { title: b ? `${b.owner_name} 트리 꾸며주기` : '트리를 찾을 수 없어요', robots: { index: false } };
}
export async function generateViewport({ params }: P): Promise<Viewport> {
  const b = await getStore().getBoard((await params).slug);
  return { themeColor: b ? STYLE_INFO[b.tree_style].theme : '#5A1220' };
}

export default async function WritePage({ params }: P) {
  const { slug } = await params;
  const store = getStore();
  const board = await store.getBoard(slug);
  if (!board) notFound();
  if (isOpen()) redirect(`/t/${slug}`);
  const count = (await store.listOrnaments(board.id)).length;
  return <WriteForm slug={slug} owner={board.owner_name} style={board.tree_style} count={count} />;
}
