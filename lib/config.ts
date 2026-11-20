export const OPEN_AT = new Date(process.env.OPEN_AT || '2026-12-25T00:00:00+09:00');
export const PURGE_AT = new Date(process.env.PURGE_AT || '2027-01-31T00:00:00+09:00');
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const OPERATOR = process.env.NEXT_PUBLIC_OPERATOR_NAME || '[운영자]';
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '[문의 이메일]';

export const MAX_MESSAGE = 150;
export const MAX_NAME = 10;

export function isOpen(now = new Date()) {
  return now.getTime() >= OPEN_AT.getTime();
}

/** "2027년 1월 31일" in KST */
export function koDate(d: Date) {
  return new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}
