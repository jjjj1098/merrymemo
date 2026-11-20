import SitePage, { siteMeta } from '@/components/SitePage';
export const metadata = siteMeta('/about');
export default function Page() { return <SitePage path="/about" />; }
