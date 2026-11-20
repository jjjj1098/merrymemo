import SitePage, { siteMeta } from '@/components/SitePage';
export const metadata = siteMeta('/terms');
export default function Page() { return <SitePage path="/terms" />; }
