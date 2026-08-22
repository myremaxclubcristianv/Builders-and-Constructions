import {AdminLogin} from '@/components/AdminLogin';
export const metadata={title:'Admin login',robots:{index:false,follow:false}};
export default function Login(){
  return (
    <main className="admin-login">
      <div>
        <div className="eyebrow">Restricted access</div>
        <h1>ADMIN LOGIN</h1>
        <p>For authorized CONSTRUCTIONS by AiXLuxury team members.</p>
        <AdminLogin/>
      </div>
      <div style={{ position: 'fixed', bottom: 8, right: 8, background: '#c7a675', color: '#000', padding: '3px 8px', borderRadius: 4, fontSize: '0.62rem', fontWeight: 900, zIndex: 9999, fontFamily: 'monospace' }}>
        PHASE_51_BROWSER_REALITY
      </div>
    </main>
  );
}
