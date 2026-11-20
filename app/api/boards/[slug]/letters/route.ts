import { getStore } from '@/lib/store';
import { fail, isOwner, json } from '@/lib/api';
import { isOpen } from '@/lib/config';

/** 편지 내용은 오직 여기서만, 25일 0시(KST)가 지난 뒤, 열쇠 링크를 가진 주인에게만 나가요. */
export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const { key } = await req.json().catch(() => ({}));
  const store = getStore();
  const board = await store.getBoard(slug);
  if (!board) return fail('트리를 찾을 수 없어요.', 404);
  if (!isOwner(board, key)) return fail('열쇠 링크가 맞지 않아요.', 403);
  if (!isOpen()) return fail('아직 잠겨 있어요.', 423, { locked: true });
  const memos = await store.listMemos(board.id);
  return json({
    letters: memos.map((m) => ({ id: m.id, ornament: m.ornament, from: m.from_name, message: m.message, read: !!m.read_at })),
  });
}
