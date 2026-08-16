import {redirect} from 'next/navigation'; import {getAdminIdentity} from '@/lib/admin-auth'; import {AdminNav} from '@/components/AdminNav';
export const metadata={title:'Admin',robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){const identity=await getAdminIdentity();if(!identity)redirect('/admin/login');return <><AdminNav identity={identity}/><main className="admin-main">{children}</main></>}
