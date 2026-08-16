import {adminOpportunitiesDashboard} from '@/lib/admin-data';
import {OpportunitiesDashboardView} from '@/components/OpportunitiesDashboardView';
import {requireAdmin} from '@/lib/admin-auth';

export default async function OpportunitiesAdmin(){
  await requireAdmin('admin','sales');
  const {metrics, opportunities} = await adminOpportunitiesDashboard();

  return (
    <OpportunitiesDashboardView
      metrics={metrics}
      opportunities={opportunities}
    />
  );
}
