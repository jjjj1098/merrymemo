'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

const ADFIT = { '320x50': process.env.NEXT_PUBLIC_ADFIT_UNIT_320x50, '300x250': process.env.NEXT_PUBLIC_ADFIT_UNIT_300x250 };
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const ADSENSE = { '320x50': process.env.NEXT_PUBLIC_ADSENSE_SLOT_320x50, '300x250': process.env.NEXT_PUBLIC_ADSENSE_SLOT_300x250 };

type Size = '320x50' | '300x250';
export const hasAd = (size: Size) => !!(ADFIT[size] || (ADSENSE_CLIENT && ADSENSE[size]));

/** 광고 하나. 카카오 애드핏 > 구글 애드센스 순서로 쓰고, 둘 다 없으면 아무것도 그리지 않아요. */
export function Ad({ size }: { size: Size }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, h] = size.split('x').map(Number);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (ADFIT[size]) {
      el.innerHTML = `<ins class="kakao_ad_area" style="display:none" data-ad-unit="${ADFIT[size]}" data-ad-width="${w}" data-ad-height="${h}"></ins>`;
      const s = document.createElement('script');
      s.async = true; s.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
      el.appendChild(s);
    } else if (ADSENSE_CLIENT && ADSENSE[size]) {
      el.innerHTML = `<ins class="adsbygoogle" style="display:inline-block;width:${w}px;height:${h}px" data-ad-client="${ADSENSE_CLIENT}" data-ad-slot="${ADSENSE[size]}"></ins>`;
      try { ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({}); } catch { /* noop */ }
    }
  }, [size, w, h]);
  if (!hasAd(size)) return null;
  return <div ref={ref} style={{ width: w, height: h, overflow: 'hidden' }} />;
}

function HouseBanner() {
  return (
    <Link href="/" className="house" aria-label="나도 트리 만들기">
      <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true"><polygon points="17,4 6,18 28,18" fill="#3FA16B" /><polygon points="17,11 3,30 31,30" fill="#2F7A4D" />
        <rect x="14" y="30" width="6" height="6" fill="#8A5A3B" /><circle cx="17" cy="4" r="3" fill="#F2C14E" /><circle cx="12" cy="22" r="2" fill="#E2323F" /><circle cx="22" cy="25" r="2" fill="#F2C14E" /></svg>
      <span style={{ flex: 1, minWidth: 0 }}><b>나도 트리 받아볼래?</b><small>이름만 쓰면 10초 만에 내 트리가 생겨요</small></span>
      <span className="go">만들기</span>
    </Link>
  );
}

/** 화면 아래 고정 320×50. 광고 승인 전에는 house=true 인 화면에서 자체 배너를 보여줘요. */
export default function AdBar({ house = true }: { house?: boolean }) {
  const ad = hasAd('320x50');
  if (!ad && !house) return null;
  return <div className="adbar">{ad ? <Ad size="320x50" /> : <HouseBanner />}</div>;
}
