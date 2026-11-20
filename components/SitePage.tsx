import Link from 'next/link';
import { SITE_PAGES } from '@/content/site';
import { CONTACT_EMAIL, OPERATOR, PURGE_AT, koDate } from '@/lib/config';
import { LogoIcon } from './Logo';
import { SITE_NAV } from './SiteLinks';
import AdBar from './AdBar';

function fill(html: string) {
  return html.replaceAll('{{OPERATOR}}', OPERATOR).replaceAll('{{EMAIL}}', CONTACT_EMAIL).replaceAll('{{PURGE_DATE}}', koDate(PURGE_AT));
}

export function siteMeta(path: string) {
  const p = SITE_PAGES[path];
  return { title: p.title, description: p.intro.replace(/<[^>]+>/g, '') };
}

export default function SitePage({ path }: { path: string }) {
  const p = SITE_PAGES[path];
  const nav = (
    <>
      {SITE_NAV.map(([h, t]) => (
        <Link key={h} href={h} aria-current={path === h || (h === '/guide' && path.startsWith('/guide')) ? 'page' : undefined}>{t}</Link>
      ))}
    </>
  );
  return (
    <div className="site">
      <div className="site-hero">
        <div className="site-hero-in">
          <header className="hdr">
            <Link href="/" className="logo" style={{ color: 'var(--cream)' }}><LogoIcon />메리메모</Link>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', height: 34, padding: '0 12px', borderRadius: 999, background: 'var(--gold)', color: '#3A1A0A', fontFamily: 'var(--display)', fontSize: 14, textDecoration: 'none' }}>내 트리 만들기</Link>
          </header>
          <nav aria-label="사이트" className="site-nav">{nav}</nav>
          <section style={{ paddingTop: 22 }}>
            <p style={{ margin: 0, fontSize: 12.5, letterSpacing: 0.5, color: 'var(--gold)' }}>{p.crumb}</p>
            <h1 style={{ margin: '8px 0 0', fontFamily: 'var(--display)', fontWeight: 400, fontSize: 29, lineHeight: 1.3 }} dangerouslySetInnerHTML={{ __html: p.h1 }} />
            <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.6, color: 'var(--pink)' }}>{p.intro}</p>
            {p.updated && <p style={{ margin: '10px 0 0', fontSize: 12.5, color: 'rgba(240,205,210,.9)' }}>{p.updated}</p>}
            {p.hero_extra && <div dangerouslySetInnerHTML={{ __html: fill(p.hero_extra) }} />}
          </section>
        </div>
      </div>
      <span className="site-scallop" aria-hidden="true" />
      <main className="site-main" dangerouslySetInnerHTML={{ __html: fill(p.content) }} />
      <footer className="site-foot">
        <div className="site-foot-in">
          <div className="logo" style={{ fontSize: 19, color: 'var(--cream)' }}><LogoIcon size={22} />메리메모</div>
          <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.6, color: 'rgba(240,205,210,.85)' }}>편지 한 장마다 트리에 장식이 하나씩. 크리스마스 0시에 열어 봐요.</p>
          <nav aria-label="푸터">{nav}</nav>
          <p style={{ margin: '16px 0 0', fontSize: 12, color: 'rgba(240,205,210,.7)' }}>© 2026 메리메모 · 운영 {OPERATOR} · {CONTACT_EMAIL}</p>
        </div>
      </footer>
      <AdBar />
    </div>
  );
}
