import { getStore } from '@/lib/store';
import { fail, json } from '@/lib/api';
import { PURGE_AT } from '@/lib/config';

/** Vercel 크론이 매일 호출해요. PURGE_AT 이 지나면 모든 트리·편지를 지워요. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) return fail('unauthorized', 401);
  if (Date.now() < PURGE_AT.getTime()) return json({ purged: 0, waitingUntil: PURGE_AT.toISOString() });
  const n = await getStore().purgeAll();
  return json({ purged: n });
}
