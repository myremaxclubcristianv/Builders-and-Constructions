/**
 * Production Relationship Graph Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 19
 *
 * Builds the comprehensive 8-node provenance graph for any company:
 * Company → Project → Signal → Decision Maker → Commercial Gap → Outreach → Proposal → Revenue
 */

export type GraphEdgeStatus = 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNKNOWN' | 'REJECTED';

export type GraphNode = {
  id: string;
  type: 'COMPANY' | 'PROJECT' | 'SIGNAL' | 'DECISION_MAKER' | 'COMMERCIAL_GAP' | 'OUTREACH' | 'PROPOSAL' | 'REVENUE';
  label: string;
  sublabel?: string;
  status: GraphEdgeStatus;
  evidenceUrl?: string;
};

export type RelationshipGraphResult = {
  companyId: string;
  companyName: string;
  nodes: GraphNode[];
  overallIntegrity: 'VERIFIED_CHAIN' | 'PARTIAL_CHAIN' | 'INSUFFICIENT_EVIDENCE';
};

export function buildCompanyRelationshipGraph(data: {
  companyId: string;
  companyName: string;
  cui?: string | null;
  projects: Array<{ id: string; name: string; isVerified: boolean; sourceUrl?: string }>;
  signals: Array<{ id: string; title: string; isVerified: boolean; sourceUrl?: string }>;
  decisionMakers: Array<{ id: string; name: string; role: string; verificationLevel: string }>;
  gaps: Array<{ dimension: string; status: string }>;
  outreachDrafts: Array<{ id: string; status: string }>;
  proposals: Array<{ id: string; totalAmount: number; status: string }>;
  revenue: Array<{ id: string; dealAmount: number }>;
}): RelationshipGraphResult {
  const nodes: GraphNode[] = [];

  // 1. Company Node
  nodes.push({
    id: `co-${data.companyId}`,
    type: 'COMPANY',
    label: data.companyName,
    sublabel: data.cui ? `CUI: ${data.cui}` : 'Trade Entity',
    status: data.cui ? 'VERIFIED' : 'PARTIALLY_VERIFIED'
  });

  // 2. Project Nodes
  for (const p of data.projects) {
    nodes.push({
      id: `proj-${p.id}`,
      type: 'PROJECT',
      label: p.name,
      status: p.isVerified ? 'VERIFIED' : 'UNKNOWN',
      evidenceUrl: p.sourceUrl
    });
  }

  // 3. Signal Nodes
  for (const s of data.signals) {
    nodes.push({
      id: `sig-${s.id}`,
      type: 'SIGNAL',
      label: s.title,
      status: s.isVerified ? 'VERIFIED' : 'UNKNOWN',
      evidenceUrl: s.sourceUrl
    });
  }

  // 4. Decision Maker Nodes
  for (const dm of data.decisionMakers) {
    const isConfirmed = dm.verificationLevel === '04_CONFIRMED' || dm.verificationLevel === '03_DOMAIN_VERIFIED';
    nodes.push({
      id: `dm-${dm.id}`,
      type: 'DECISION_MAKER',
      label: dm.name,
      sublabel: dm.role,
      status: isConfirmed ? 'VERIFIED' : dm.verificationLevel === '02_PUBLICLY_VERIFIED' ? 'PARTIALLY_VERIFIED' : 'UNKNOWN'
    });
  }

  // 5. Commercial Gap Nodes
  for (const g of data.gaps) {
    nodes.push({
      id: `gap-${g.dimension}`,
      type: 'COMMERCIAL_GAP',
      label: g.dimension,
      status: g.status === 'VERIFIED_GAP' ? 'VERIFIED' : 'UNKNOWN'
    });
  }

  // 6. Outreach Nodes
  for (const o of data.outreachDrafts) {
    nodes.push({
      id: `out-${o.id}`,
      type: 'OUTREACH',
      label: `Outreach (${o.status})`,
      status: o.status === 'sent' || o.status === 'approved' ? 'VERIFIED' : 'PARTIALLY_VERIFIED'
    });
  }

  // 7. Proposal Nodes
  for (const pr of data.proposals) {
    nodes.push({
      id: `prop-${pr.id}`,
      type: 'PROPOSAL',
      label: `€${pr.totalAmount.toLocaleString()} (${pr.status})`,
      status: 'VERIFIED'
    });
  }

  // 8. Revenue Nodes
  for (const r of data.revenue) {
    nodes.push({
      id: `rev-${r.id}`,
      type: 'REVENUE',
      label: `€${r.dealAmount.toLocaleString()} Won`,
      status: 'VERIFIED'
    });
  }

  const hasVerifiedProject = data.projects.some(p => p.isVerified);
  const hasVerifiedContact = data.decisionMakers.some(dm => dm.verificationLevel === '03_DOMAIN_VERIFIED' || dm.verificationLevel === '04_CONFIRMED');

  const overallIntegrity = hasVerifiedProject && hasVerifiedContact ? 'VERIFIED_CHAIN' : 'PARTIAL_CHAIN';

  return {
    companyId: data.companyId,
    companyName: data.companyName,
    nodes,
    overallIntegrity
  };
}
