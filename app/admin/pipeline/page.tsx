import { requireAdmin } from '@/lib/admin-auth';
import { OperationalPipelineView } from '@/components/OperationalPipelineView';

export const metadata = {
  title: 'Level 3 Operational Pipeline | Admin Console | CONSTRUCTIONS by AiXLuxury'
};

export default async function AdminPipelinePage() {
  await requireAdmin('admin', 'editor');
  return <OperationalPipelineView />;
}
