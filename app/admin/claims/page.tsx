import {adminRows} from '@/lib/admin-data';
import {AdminList} from '@/components/AdminList';
import {requireAdmin} from '@/lib/admin-auth';

export default async function ClaimsAdmin(){
  await requireAdmin('admin','sales');
  return (
    <AdminList
      title="PROFILE CLAIMS"
      rows={await adminRows('profile_claims')}
      itemHref="/admin/claims"
      itemAction="Review →"
      columns={[
        {key:'company_slug',label:'Company'},
        {key:'claimant_name',label:'Claimant'},
        {key:'email',label:'Email'},
        {key:'role',label:'Role'},
        {key:'claim_status',label:'Status'}
      ]}
    />
  );
}
