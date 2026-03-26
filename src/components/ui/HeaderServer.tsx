import { fetchUserProfile } from '@/services/homepage-service';
import { Header } from './Header';

export async function HeaderServer(): Promise<React.ReactElement> {
  const profile = await fetchUserProfile().catch(() => ({
    avatarUrl: null,
    fullName: null,
    isAdmin: false,
  }));

  return <Header avatarUrl={profile.avatarUrl} fullName={profile.fullName} isAdmin={profile.isAdmin} />;
}
