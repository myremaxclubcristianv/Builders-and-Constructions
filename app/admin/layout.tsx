import {redirect} from 'next/navigation';
import {headers} from 'next/headers';
import {getAdminIdentity} from '@/lib/admin-auth';
import {AdminNav} from '@/components/AdminNav';
import {Executive3DGrid} from '@/components/Executive3DGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata={title:'Executive Intelligence Terminal | CONSTRUCTIONS',robots:{index:false,follow:false}};

export default async function AdminLayout({children}:{children:React.ReactNode}){
  const headerList = await headers();
  const matchedPath = headerList.get('x-matched-path') || headerList.get('next-url') || '';
  const isLoginPage = matchedPath.includes('/admin/login');

  const identity = await getAdminIdentity();
  if (!identity && !isLoginPage) redirect('/admin/login');

  return (
    <>
      <Executive3DGrid />
      {identity && <AdminNav identity={identity} />}
      <main className="admin-main" style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </main>
      <div style={{ position: 'fixed', bottom: 8, right: 8, background: '#c7a675', color: '#000', padding: '3px 8px', borderRadius: 4, fontSize: '0.62rem', fontWeight: 900, zIndex: 9999, fontFamily: 'monospace' }}>
        PHASE_51_BROWSER_REALITY
      </div>
    </>
  );
}

