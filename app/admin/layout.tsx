import {redirect} from 'next/navigation';
import {getAdminIdentity} from '@/lib/admin-auth';
import {AdminNav} from '@/components/AdminNav';
import {Executive3DGrid} from '@/components/Executive3DGrid';

export const metadata={title:'Executive Intelligence Terminal | CONSTRUCTIONS',robots:{index:false,follow:false}};

export default async function AdminLayout({children}:{children:React.ReactNode}){
  const identity = await getAdminIdentity();
  if (!identity) redirect('/admin/login');
  return (
    <>
      <Executive3DGrid />
      <AdminNav identity={identity} />
      <main className="admin-main" style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </main>
    </>
  );
}

