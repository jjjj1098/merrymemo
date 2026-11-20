import Link from 'next/link';
import Icon from './Icon';
import { LogoIcon } from './Logo';

export default function Header({ back, right }: { back?: string; right?: React.ReactNode }) {
  return (
    <header className="hdr">
      <div className="hdr-l">
        {back && (
          <Link href={back} aria-label="뒤로" className="iconbtn back"><Icon name="back" /></Link>
        )}
        <Link href="/" className="logo"><LogoIcon />메리메모</Link>
      </div>
      {right}
    </header>
  );
}
