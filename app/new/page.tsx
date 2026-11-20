import Header from '@/components/Header';
import AdBar from '@/components/AdBar';
import PickForm from './PickForm';

export const metadata = { title: '트리 고르기', robots: { index: false } };

export default async function NewPage({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  const { name = '' } = await searchParams;
  const n = name.trim().slice(0, 10);
  return (
    <div className="screen" data-style="paper">
      <div className="col">
        <Header back="/" />
        <PickForm name={n} />
      </div>
      <AdBar house={false} />
    </div>
  );
}
