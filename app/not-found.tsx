import Link from 'next/link';
import Header from '@/components/Header';
import Ornament from '@/components/Ornament';

export default function NotFound() {
  return (
    <div className="screen">
      <div className="col no-ad">
        <Header />
        <div className="center" style={{ paddingTop: 60 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><Ornament kind="snowman" size={120} /></div>
          <h1 className="h1" style={{ marginTop: 20 }}>트리를 찾을 수 없어요</h1>
          <p className="sub">링크가 잘렸거나, 시즌이 끝나 트리가 정리됐을 수 있어요.</p>
          <div style={{ marginTop: 24 }}><Link href="/" className="btn">내 트리 만들기</Link></div>
        </div>
      </div>
    </div>
  );
}
