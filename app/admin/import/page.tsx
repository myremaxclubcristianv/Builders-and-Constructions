import { requireAdmin } from '@/lib/admin-auth';
import { CsvImportWorkstation } from '@/components/CsvImportWorkstation';

export default async function CsvImportPage() {
  await requireAdmin('admin', 'editor');
  return <CsvImportWorkstation />;
}
