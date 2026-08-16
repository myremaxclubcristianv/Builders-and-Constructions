import {adminRows} from '@/lib/admin-data';
import {AdminList} from '@/components/AdminList';
import {requireAdmin} from '@/lib/admin-auth';

export default async function EditorialAdmin(){
  await requireAdmin('admin','editor');
  return (
    <AdminList
      title="EDITORIAL"
      rows={await adminRows('editorial_content')}
      newHref="/admin/editorial/new"
      itemHref="/admin/editorial"
      itemSuffix="/edit"
      itemAction="Edit →"
      columns={[
        {key:'title',label:'Title'},
        {key:'category',label:'Category'},
        {key:'content_state',label:'Status'},
        {key:'published_at',label:'Published'}
      ]}
    />
  );
}
