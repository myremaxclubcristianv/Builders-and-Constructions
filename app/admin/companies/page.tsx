import Link from 'next/link';
import {adminRows} from '@/lib/admin-data';
import {AdminList} from '@/components/AdminList';
import {requireAdmin} from '@/lib/admin-auth';

export default async function CompaniesAdmin(){
  await requireAdmin('admin','editor','sales');
  const rows = await adminRows('companies');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -50, position: 'relative', zIndex: 10 }}>
        <Link
          href="/admin/companies/research"
          className="btn fill"
          style={{ background: '#d4af37', color: '#000', fontWeight: 700 }}
        >
          + Research Mode Workstation
        </Link>
      </div>

      <AdminList
        title="COMPANIES"
        rows={rows}
        newHref="/admin/companies/new"
        itemHref="/admin/companies"
        columns={[
          {key:'name',label:'Name'},
          {key:'type',label:'Type'},
          {key:'location',label:'Location'},
          {key:'content_state',label:'Workflow'},
          {key:'website_status',label:'Website Status'},
          {key:'website_verification',label:'Verification'},
          {key:'is_featured',label:'Featured'}
        ]}
      />
    </div>
  );
}
