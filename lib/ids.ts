import { createHash, randomBytes } from 'crypto';

const ALPHA = 'abcdefghijkmnpqrstuvwxyz23456789';
export function newSlug(len = 8) {
  const b = randomBytes(len);
  let s = '';
  for (let i = 0; i < len; i++) s += ALPHA[b[i] % ALPHA.length];
  return s;
}
export function newKey() {
  return randomBytes(24).toString('base64url');
}
export function hashKey(key: string) {
  return createHash('sha256').update(key).digest('hex');
}
