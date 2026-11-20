import Link from 'next/link';
export const SITE_NAV = [['/about', '소개'], ['/guide', '가이드'], ['/terms', '이용약관'], ['/privacy', '개인정보처리방침'], ['/contact', '문의']] as const;
export default function SiteLinks() {
  return (
    <nav aria-label="사이트 정보" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 12px', paddingTop: 14, fontSize: 12 }}>
      {SITE_NAV.map(([h, t]) => (
        <Link key={h} href={h} style={{ color: 'var(--sub)', textDecoration: 'none', fontWeight: h === '/privacy' ? 700 : 400, padding: '6px 0' }}>{t}</Link>
      ))}
    </nav>
  );
}
