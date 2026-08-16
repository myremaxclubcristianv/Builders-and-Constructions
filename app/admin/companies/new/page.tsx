import {requireAdmin} from '@/lib/admin-auth'; import {AdminIntakeForm} from '@/components/AdminIntakeForm';
export default async function NewCompany(){await requireAdmin('admin','editor');return <AdminIntakeForm kind="company"/>}
