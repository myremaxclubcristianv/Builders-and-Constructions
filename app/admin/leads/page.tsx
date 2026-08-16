import {adminRows} from '@/lib/admin-data';
import {AdminList} from '@/components/AdminList';
import {requireAdmin} from '@/lib/admin-auth';

export default async function LeadsAdmin(){
  await requireAdmin('admin','sales');
  return (
    <AdminList
      title="LEADS"
      rows={await adminRows('leads')}
      itemHref="/admin/leads"
      itemAction="View / Manage →"
      columns={[
        {key:'name',label:'Name'},
        {key:'email',label:'Email'},
        {key:'lead_type',label:'Type'},
        {key:'source',label:'Source'},
        {key:'status',label:'Status'}
      ]}
    />
  );
}
