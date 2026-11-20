import { getStore } from '@/lib/store';
import { fail, isOwner, json } from '@/lib/api';
import { isOpen } from '@/lib/config';

/** 주인 전용: read | hide | report */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { key, slug, action } = await req.json().catch(() => ({}));
  const store = getStore();
  const board = typeof slug === 'string' ? await store.getBoard(slug) : null;
  if (!board) return fail('트리를 찾을 수 없어요.', 404);
  if (!isOwner(board, key)) return fail('열쇠 링크가 맞지 않아요.', 403);
  if (!isOpen()) return fail('아직 잠겨 있어요.', 423);
  const patch =
    action === 'read' ? { read_at: new Date().toISOString() } :
    action === 'hide' ? { hidden: true } :
    action === 'report' ? { hidden: true, reported: true } : null;
  if (!patch) return fail('알 수 없는 요청이에요.');
  const ok = await store.updateMemo(board.id, id, patch);
  return ok ? json({ ok: true }) : fail('편지를 찾을 수 없어요.', 404);
}
