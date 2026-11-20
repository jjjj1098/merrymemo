import Header from '@/components/Header';
import Tree from '@/components/Tree';
import AdBar from '@/components/AdBar';
import Icon from '@/components/Icon';
import NameForm from './NameForm';
import SiteLinks from '@/components/SiteLinks';

const DEMO = (['star', 'ginger', 'reindeer', 'stocking', 'bauble'] as const).map((k, i) => ({ id: String(i), kind: k }));

export default function Home() {
  return (
    <div className="screen">
      <div className="col">
        <Header />
        <section className="center" style={{ paddingTop: 6 }}>
          <p className="badge" style={{ margin: 0 }}><Icon name="lock" size={13} stroke={2.5} />12월 25일 0시에 열려요</p>
          <h1 className="h1" style={{ marginTop: 12 }}>편지 한 장마다<br /><span className="accent">트리에 장식이 하나씩</span></h1>
          <p className="sub">친구들이 꾸며준 트리, 크리스마스에 열어 봐요</p>
        </section>
        <div style={{ paddingTop: 10 }}><Tree style="classic" items={DEMO} size="sm" label="장식 다섯 개가 걸린 크리스마스 트리" /></div>
        <ol style={{ listStyle: 'none', display: 'flex', gap: 8, margin: '6px 0 0', padding: 0 }}>
          {[['share', '링크 보내기'], ['pen', '친구가 장식 달기'], ['gift', '25일에 열어보기']].map(([ic, t], i) => (
            <li key={ic} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
              <span style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,247,236,.1)', border: '1px solid rgba(255,247,236,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                <Icon name={ic} size={18} />
              </span>
              <span style={{ fontSize: 12.5, color: 'var(--sub)' }}>{i + 1}. {t}</span>
            </li>
          ))}
        </ol>
        <NameForm />
        <SiteLinks />
      </div>
      <AdBar />
    </div>
  );
}
