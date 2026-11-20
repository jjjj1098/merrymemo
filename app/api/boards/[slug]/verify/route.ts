import { getStore } from '@/lib/store';
import { fail, isOwner, json } from '@/lib/api';

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const { key } = await req.json().catch(() => ({}));
  const board = await getStore().getBoard(slug);
  if (!board) return fail('트리를 찾을 수 없어요.', 404);
  return json({ owner: isOwner(board, key) });
}
