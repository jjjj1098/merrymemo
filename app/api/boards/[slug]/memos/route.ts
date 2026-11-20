import { getStore } from '@/lib/store';
import { isOrnament } from '@/lib/ornaments';
import { cleanName, cleanText, fail, json } from '@/lib/api';
import { findBadWords, hasContactOrLink } from '@/lib/badwords';
import { isOpen, MAX_MESSAGE } from '@/lib/config';

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  if (body.website) return json({ ok: true, count: 0 }); // 봇용 함정 칸
  const store = getStore();
  const board = await store.getBoard(slug);
  if (!board) return fail('트리를 찾을 수 없어요.', 404);
  if (isOpen()) return fail('편지 쓰기는 12월 24일 자정에 마감됐어요.', 403, { closed: true });
  if (!isOrnament(body.ornament)) return fail('걸어줄 장식을 골라 주세요.', 400, { field: 'ornament' });
  const message = cleanText(body.message);
  const from = cleanName(body.from);
  if (!message) return fail('편지를 써 주세요.', 400, { field: 'message' });
  if ([...message].length > MAX_MESSAGE) return fail(`편지는 ${MAX_MESSAGE}자까지 쓸 수 있어요.`, 400, { field: 'message' });
  if (!from) return fail('보내는 이름을 써 주세요.', 400, { field: 'from' });
  const bad = [...new Set([...findBadWords(message), ...findBadWords(from)])];
  if (bad.length) return fail('쓸 수 없는 말이 있어요.', 400, { field: 'message', words: bad });
  if (hasContactOrLink(message)) return fail('전화번호, 이메일, 링크는 편지에 넣을 수 없어요.', 400, { field: 'message' });
  const r = await store.addMemo({ board_id: board.id, ornament: body.ornament, from_name: from, message });
  return json({ ok: true, count: r.count });
}
