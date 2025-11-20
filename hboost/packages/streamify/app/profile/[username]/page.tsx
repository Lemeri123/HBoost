import CreatorProfilePage from '@/components/CreatorProfilePage';

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}) {
  const { username } = await params;
  return <CreatorProfilePage username={username} />;
}
