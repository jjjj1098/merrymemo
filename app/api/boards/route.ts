import { getStore } from '@/lib/store';
import { newKey, newSlug, hashKey } from '@/lib/ids';
import { isStyle } from '@/lib/ornaments';
import { cleanName, fail, json } from '@/lib/api';
import { findBadWords } from '@/lib/badwords';
import { isOpen } from '@/lib/config';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = cleanName(body.name);
  if (!name) return fail('이름을 써 주세요.');
  if (findBadWords(name).length) return fail('이름에 쓸 수 없는 말이 있어요.');
  if (!isStyle(body.style)) return fail('트리 스타일을 골라 주세요.');
  if (isOpen()) return fail('올해 트리 만들기는 끝났어요. 내년에 다시 만나요!', 403);
  const store = getStore();
  const key = newKey();
  for (let i = 0; i < 4; i++) {
    try {
      const b = await store.createBoard({ slug: newSlug(), owner_name: name, tree_style: body.style, admin_token_hash: hashKey(key) });
      return json({ slug: b.slug, key });
    } catch (e) {
      if (i === 3) throw e; // slug 충돌이면 다시 시도
    }
  }
  return fail('잠시 후 다시 시도해 주세요.', 500);
}
