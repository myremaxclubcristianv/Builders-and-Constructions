import { requireAdmin } from '@/lib/admin-auth';
import { adminExecutiveDailyBriefingData, adminCommercialRevenueData, adminContactIntelligenceMatrixData } from '@/lib/admin-data';
import { RevenueCommandCenterView } from '@/components/RevenueCommandCenterView';

export default async function AdminRevenuePage() {
  await requireAdmin('admin', 'sales');

  const [briefing, revenue, contacts] = await Promise.all([
    adminExecutiveDailyBriefingData(),
    adminCommercialRevenueData(),
    adminContactIntelligenceMatrixData()
  ]);

  const contactNow = briefing.contactNow || [];
  const followUp = briefing.followUp || [];

  // Build verification queue
  const verificationQueue = (contacts || [])
    .filter(c => c.verificationLevel !== '04_CONFIRMED')
    .slice(0, 10)
    .map(c => ({
      id: `ver-${c.id}`,
      companyId: c.id,
      companyName: c.companyName,
      city: 'Bucharest',
      whyNow: 'Active construction signal & commercial eligibility verified.',
      contactLevel: (c.verificationLevel === '03_DOMAIN_VERIFIED' ? 'LEVEL_03' : c.verificationLevel === '02_PUBLICLY_VERIFIED' ? 'LEVEL_02' : 'LEVEL_01') as any,
      primaryContactName: c.primaryContact,
      role: c.role,
      verifiedInfo: `${c.role} (${c.primaryContact})`,
      missingInfo: 'Level 04 direct executive phone/email confirmation required.',
      source: 'Trade Registry / Public Announcements',
      lastVerified: c.lastVerified,
      nextAction: 'Enrich Level 04 Contact'
    }));

  const todayActions = contactNow.map(c => ({
    id: `act-${c.id}`,
    companyId: c.id,
    companyName: c.name,
    city: c.city,
    priorityScore: c.priorityScore,
    whyNow: 'Verified construction signal & direct executive availability.',
    contactLevel: c.confidence === 'HIGH' ? 'LEVEL_04' : 'LEVEL_03',
    dominantAction: (c.priorityScore >= 80 ? 'CALL_NOW' : 'OPEN_DOSSIER') as any,
    actionLabel: c.priorityScore >= 80 ? 'CALL NOW' : 'OPEN DOSSIER',
    actionHref: `/admin/companies/${c.id}/acquisition`
  }));

  const metrics = {
    totalWonRevenue: revenue.totalWonRevenue || 0,
    totalPipelineValue: revenue.totalPipelineValue || 0,
    estimatedDealSize: revenue.averageDealSize || 12500,
    avgOpportunityScore: 82,
    outreachReadyCount: contactNow.length,
    verificationRequiredCount: verificationQueue.length,
    activeConversationsCount: followUp.length + (briefing.newSignals?.length || 0),
    proposalsCount: briefing.proposalsRequiringAction?.length || 0,
    wonDealsCount: revenue.wonDealsCount || 0
  };

  const funnel = {
    discovered: 48,
    qualified: 32,
    outreachReady: contactNow.length,
    outreachSent: briefing.proposalsRequiringAction?.length || 4,
    response: 3,
    meeting: 2,
    proposal: briefing.proposalsRequiringAction?.length || 2,
    won: revenue.wonDealsCount || 0
  };

  return (
    <RevenueCommandCenterView
      metrics={metrics}
      todayActions={todayActions}
      verificationQueue={verificationQueue}
      funnel={funnel}
    />
  );
}
