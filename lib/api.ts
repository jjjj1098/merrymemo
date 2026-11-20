import 'server-only';
import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { hashKey } from './ids';
import type { Board } from './store';

export const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export const fail = (message: string, status = 400, extra: Record<string, unknown> = {}) => json({ error: message, ...extra }, status);

export function isOwner(board: Board, key: string | null | undefined) {
  if (!key || key.length > 100) return false;
  const a = Buffer.from(hashKey(key), 'hex');
  const b = Buffer.from(board.admin_token_hash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

export function cleanName(v: unknown, max = 10) {
  if (typeof v !== 'string') return '';
  return v.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);
}
export function cleanText(v: unknown, max = 150) {
  if (typeof v !== 'string') return '';
  return v.replace(/[\u0000-\u0009\u000b-\u001f]/g, '').replace(/\n{3,}/g, '\n\n').trim();
}
