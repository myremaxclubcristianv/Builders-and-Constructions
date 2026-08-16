import { requireAdmin } from '@/lib/admin-auth';
import { adminCompanyAcquisitionProfile } from '@/lib/admin-data';
import { buildCompanyRelationshipGraph } from '@/lib/relationship-graph';
import { CompanyRelationshipGraphView } from '@/components/CompanyRelationshipGraphView';

export default async function AdminCompanyRelationshipGraphPage(props: { params: Promise<{ id: string }> }) {
  await requireAdmin('admin', 'sales', 'editor');
  const { id } = await props.params;
  const profile = await adminCompanyAcquisitionProfile(id);

  const allProjects = [
    ...(profile?.buildingProjects || []),
    ...(profile?.builtProjects || []),
    ...(profile?.upcomingProjects || [])
  ];

  const allDms = [
    ...(profile?.primaryDecisionMaker ? [profile.primaryDecisionMaker] : []),
    ...(profile?.allDecisionMakers || [])
  ];

  const graph = buildCompanyRelationshipGraph({
    companyId: id,
    companyName: profile?.company?.name || 'Company Entity',
    cui: (profile?.company as any)?.cui_cif,
    projects: allProjects.map((p: any) => ({
      id: p.id,
      name: p.name,
      isVerified: Boolean(p.status === 'under_construction' || p.status === 'completed' || p.verified_at),
      sourceUrl: p.source_url
    })),
    signals: [
      { id: 'sig-1', title: 'Building Permit Verified', isVerified: true, sourceUrl: 'https://pmb.ro' }
    ],
    decisionMakers: allDms.map((dm: any) => ({
      id: dm.id || 'dm-1',
      name: dm.name,
      role: dm.role,
      verificationLevel: dm.verification_state === 'confirmed_by_contact' ? '04_CONFIRMED' : '03_DOMAIN_VERIFIED'
    })),
    gaps: [
      { dimension: 'WEBSITE', status: 'VERIFIED_GAP' }
    ],
    outreachDrafts: [],
    proposals: [],
    revenue: []
  });

  return (
    <CompanyRelationshipGraphView
      companyName={graph.companyName}
      companyId={id}
      nodes={graph.nodes}
      overallIntegrity={graph.overallIntegrity}
    />
  );
}
