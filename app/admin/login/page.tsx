import {AdminLogin} from '@/components/AdminLogin';
export const metadata={title:'Admin login',robots:{index:false,follow:false}};
export default function Login(){return <main className="admin-login"><div><div className="eyebrow">Restricted access</div><h1>ADMIN LOGIN</h1><p>For authorized CONSTRUCTIONS by AiXLuxury team members.</p><AdminLogin/></div></main>}
