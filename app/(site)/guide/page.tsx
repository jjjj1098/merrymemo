import SitePage, { siteMeta } from '@/components/SitePage';
export const metadata = siteMeta('/guide');
export default function Page() { return <SitePage path="/guide" />; }
