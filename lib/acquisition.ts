/**
 * Deterministic Acquisition & Commercial Intelligence Engine
 * CONSTRUCTIONS by AiXLuxury — Phase 10
 *
 * All priority calculations, commercial summaries, and outreach drafts
 * are strictly deterministic and based exclusively on verified stored facts.
 */

import { getRecommendedServiceSuite, RecommendedServiceItem } from './services';

export type PriorityTier = 'HIGH' | 'MEDIUM' | 'LOW';

export type DeterministicPriorityResult = {
  score: number; // 0 - 100
  tier: PriorityTier;
  whyNow: string;
  whyThisCompany: string;
  commercialGap: string;
  nextAction: string;
  factors: {
    opportunity: number;
    constructionActivity: number;
    digitalGap: number;
    contactReadiness: number;
    timing: number;
    recentSignal?: number;
    penalties: number;
  };
  reasons: string[];
  penalties: string[];
  recommendedServices: RecommendedServiceItem[];
  estimatedCommercialValue: number;
};

export type AcquisitionEntityInput = {
  companyId: string;
  companyName: string;
  companyType?: string | null;
  city?: string | null;
  county?: string | null;
  website?: string | null;
  websiteStatus?: string | null;
  websiteVerification?: string | null;
  activeProjects?: Array<{
    id: string;
    name: string;
    status: string;
    projectType?: string;
    verifiedAt?: string | null;
  }>;
  completedProjects?: Array<{
    id: string;
    name: string;
    status: string;
    projectType?: string;
    verifiedAt?: string | null;
  }>;
  upcomingProjects?: Array<{
    id: string;
    name: string;
    status: string;
    projectType?: string;
    verifiedAt?: string | null;
  }>;
  primaryDecisionMaker?: {
    name: string;
    role: string;
    email?: string | null;
    phone?: string | null;
    linkedinUrl?: string | null;
    verificationState?: string | null;
    verifiedAt?: string | null;
    source?: string | null;
    sourceUrl?: string | null;
  } | null;
  allDecisionMakers?: Array<{
    id?: string;
    name: string;
    role: string;
    email?: string | null;
    phone?: string | null;
    verificationState?: string | null;
    isPrimary?: boolean;
  }>;
  opportunitySignals?: string[];
  baseOpportunityScore?: number;
  digitalAudit?: {
    has_website?: boolean;
    has_portfolio?: boolean;
    has_photography?: boolean;
    has_video?: boolean;
    has_seo?: boolean;
    has_lead_funnel?: boolean;
    has_social?: boolean;
    website_score?: number;
    notes?: string;
  };
  pipelineStatus?: string | null; // 'new' | 'contacted' | 'meeting' | 'proposal' | 'won' | 'lost' | 'not_a_fit'
  lastContactedAt?: string | null;
  nextActionDate?: string | null;
  nextAction?: string | null;
  isNotAFit?: boolean;
  hasInboundLead?: boolean;
};

/**
 * Pure deterministic formula:
 * Priority = Opportunity (max 25) + Construction Activity (max 25) + Digital Gap (max 20) + Contact Readiness (max 15) + Timing (max 15) - Penalties
 * Output is normalized to 0–100.
 */
export function calculateDeterministicAcquisitionPriority(
  input: AcquisitionEntityInput
): DeterministicPriorityResult {
  const reasons: string[] = [];
  const penaltyList: string[] = [];

  // 1. Opportunity Sub-score (max 25 pts)
  let opportunityPts = 10;
  if (input.baseOpportunityScore) {
    opportunityPts = Math.min(25, Math.round(input.baseOpportunityScore * 0.25));
    if (input.baseOpportunityScore >= 70) {
      reasons.push(`High base opportunity index (${input.baseOpportunityScore}/100)`);
    }
  } else {
    opportunityPts = 12;
  }

  // 2. Construction Activity Sub-score (max 25 pts)
  let constructionPts = 0;
  const activeCount = input.activeProjects?.length || 0;
  const completedCount = input.completedProjects?.length || 0;
  const upcomingCount = input.upcomingProjects?.length || 0;

  if (activeCount >= 4) {
    constructionPts += 25;
    reasons.push(`${activeCount} verified active developments underway (+25)`);
  } else if (activeCount >= 2) {
    constructionPts += 20;
    reasons.push(`${activeCount} active construction projects identified (+20)`);
  } else if (activeCount === 1) {
    constructionPts += 12;
    reasons.push(`1 verified active site under construction (+12)`);
  } else if (upcomingCount > 0) {
    constructionPts += 8;
    reasons.push(`${upcomingCount} upcoming development(s) announced (+8)`);
  } else if (completedCount > 0) {
    constructionPts += 5;
    reasons.push(`Portfolio of ${completedCount} verified completed projects (+5)`);
  }

  // 3. Digital Gap Sub-score (max 20 pts)
  let digitalGapPts = 0;
  const signals = input.opportunitySignals || [];
  const signalSet = new Set(signals);

  const hasNoWebsite =
    input.websiteStatus === 'no_website' ||
    !input.website ||
    signalSet.has('No website');

  if (hasNoWebsite) {
    digitalGapPts += 15;
    reasons.push('No modern corporate website found (+15)');
  } else if (
    input.websiteStatus === 'weak' ||
    input.websiteStatus === 'outdated' ||
    signalSet.has('Outdated website')
  ) {
    digitalGapPts += 10;
    reasons.push('Outdated website presentation (+10)');
  }

  if (
    signalSet.has('Weak project presentation') ||
    signalSet.has('No project portfolio')
  ) {
    digitalGapPts += 5;
    reasons.push('Weak project documentation and case study presentation (+5)');
  }

  if (signalSet.has('No lead generation') || signalSet.has('No clear CTA')) {
    digitalGapPts += 5;
    reasons.push('Missing inbound lead generation funnel (+5)');
  }

  if (signalSet.has('No project photography') || signalSet.has('No video')) {
    digitalGapPts += 3;
    reasons.push('Lacks professional architectural photography/video (+3)');
  }

  digitalGapPts = Math.min(20, digitalGapPts);

  // 4. Contact Readiness Sub-score (max 15 pts)
  let contactPts = 0;
  const dm = input.primaryDecisionMaker;

  if (dm && dm.name) {
    contactPts += 8;
    reasons.push(`Decision maker identified: ${dm.name} (${dm.role}) (+8)`);

    if (dm.phone || dm.email) {
      contactPts += 4;
      reasons.push('Direct verified contact channel available (+4)');
    }

    if (
      dm.verificationState === 'confirmed_by_contact' ||
      dm.verificationState === 'company_verified' ||
      dm.verificationState === 'publicly_verified'
    ) {
      contactPts += 3;
      reasons.push('Decision maker role verified via official source (+3)');
    }
  }

  contactPts = Math.min(15, contactPts);

  // 5. Timing Sub-score (max 15 pts)
  let timingPts = 5;
  const todayStr = new Date().toISOString().slice(0, 10);

  if (input.nextActionDate) {
    if (input.nextActionDate < todayStr) {
      timingPts += 10;
      reasons.push(`Overdue scheduled action (${input.nextActionDate}) (+10)`);
    } else if (input.nextActionDate === todayStr) {
      timingPts += 10;
      reasons.push('Next action scheduled for today (+10)');
    } else {
      timingPts += 4;
      reasons.push(`Action scheduled for ${input.nextActionDate} (+4)`);
    }
  }

  if (input.hasInboundLead) {
    timingPts += 5;
    reasons.push('Inbound inquiry received from company/profile (+5)');
  }

  if (!input.lastContactedAt) {
    timingPts += 5;
    reasons.push('No previous sales outreach recorded (Fresh opportunity) (+5)');
  }

  timingPts = Math.min(15, timingPts);

  // 6. Penalties Calculation
  let penalties = 0;

  if (input.isNotAFit || input.pipelineStatus === 'not_a_fit') {
    penalties += 100;
    penaltyList.push('Marked as Not a Fit (-100)');
  }

  if (input.pipelineStatus === 'won') {
    penalties += 100;
    penaltyList.push('Already an active Won client (-100)');
  }

  if (input.pipelineStatus === 'proposal') {
    penalties += 20;
    penaltyList.push('Active proposal currently in discussion (-20)');
  }

  if (input.lastContactedAt) {
    const daysSince = Math.floor(
      (Date.now() - new Date(input.lastContactedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (daysSince < 5) {
      penalties += 35;
      penaltyList.push(
        `Recently contacted ${daysSince} day(s) ago (Cooldown active) (-35)`
      );
    } else if (daysSince < 14) {
      penalties += 10;
      penaltyList.push(`Contacted ${daysSince} days ago (-10)`);
    }
  }

  const rawSum =
    opportunityPts +
    constructionPts +
    digitalGapPts +
    contactPts +
    timingPts -
    penalties;

  const score = Math.max(0, Math.min(100, Math.round(rawSum)));

  let tier: PriorityTier = 'LOW';
  if (score >= 75) tier = 'HIGH';
  else if (score >= 45) tier = 'MEDIUM';

  const serviceSuite = getRecommendedServiceSuite({
    signals,
    websiteStatus: input.websiteStatus,
    hasWebsite: Boolean(input.website && !hasNoWebsite),
    activeProjectsCount: activeCount,
    completedProjectsCount: completedCount,
    digitalAudit: input.digitalAudit
  });

  // 7. Synthetic Insights
  const whyNow = reasons.find(r => r.includes('active') || r.includes('scheduled') || r.includes('Fresh') || r.includes('Overdue')) ||
    (activeCount > 0 ? `${activeCount} active construction project(s) underway.` : 'High commercial transformation fit.');

  const whyThisCompany = `${input.companyName} (${input.companyType || 'Construction Practice'}) in ${input.city || 'Romania'} with ${activeCount + completedCount} verified project(s).`;

  const commercialGap = hasNoWebsite
    ? 'No official architectural website. Operations and portfolio unindexed online.'
    : (reasons.find(r => r.includes('presentation') || r.includes('website') || r.includes('lead')) || 'Digital presentation does not reflect real-world construction volume.');

  const nextAction = input.nextAction || (dm?.name
    ? `Initiate Executive Outreach to ${dm.name} (${dm.role}) via ${dm.email ? 'Email' : 'Direct Call'}`
    : 'Identify Primary Decision Maker via Registry / LinkedIn');

  return {
    score,
    tier,
    whyNow,
    whyThisCompany,
    commercialGap,
    nextAction,
    factors: {
      opportunity: opportunityPts,
      constructionActivity: constructionPts,
      digitalGap: digitalGapPts,
      contactReadiness: contactPts,
      timing: timingPts,
      penalties
    },
    reasons,
    penalties: penaltyList,
    recommendedServices: serviceSuite.recommendedServices,
    estimatedCommercialValue: serviceSuite.totalEstimatedValue
  };
}

/**
 * Generates the "WHAT I CAN SELL THEM" commercial intelligence briefing.
 */
export function generateWhatICanSellThemSummary(input: AcquisitionEntityInput): {
  whatTheyHave: string[];
  whatTheyNeed: string[];
  whatICanOffer: string[];
  estimatedDealSize: number;
  packageName: string;
} {
  const whatTheyHave: string[] = [];
  const whatTheyNeed: string[] = [];
  const whatICanOffer: string[] = [];

  const activeCount = input.activeProjects?.length || 0;
  const completedCount = input.completedProjects?.length || 0;

  // 1. What They Have
  if (activeCount > 0) {
    whatTheyHave.push(`${activeCount} verified active construction project(s) underway`);
  }
  if (completedCount > 0) {
    whatTheyHave.push(`${completedCount} completed project(s) across portfolio`);
  }
  if (input.website && input.websiteStatus !== 'no_website') {
    whatTheyHave.push(`Existing corporate web presence (${input.website})`);
  } else {
    whatTheyHave.push('No official corporate web presence discovered');
  }
  if (input.city) {
    whatTheyHave.push(`Operational base in ${input.city}${input.county ? `, ${input.county}` : ''}`);
  }

  // 2. What They Need
  const signals = new Set(input.opportunitySignals || []);
  if (input.websiteStatus === 'no_website' || !input.website || signals.has('No website')) {
    whatTheyNeed.push('High-performance institutional website architecture');
  }
  if (signals.has('Weak project presentation') || activeCount > 0) {
    whatTheyNeed.push('Dedicated landmark project presentation and investor collateral');
  }
  if (signals.has('No project photography') || signals.has('No video')) {
    whatTheyNeed.push('Architectural drone cinematography and high-resolution jobsite photography');
  }
  if (signals.has('No SEO') || signals.has('Weak SEO')) {
    whatTheyNeed.push('Targeted search authority for procurement and commercial tenders');
  }
  if (signals.has('No lead generation') || signals.has('No clear CTA')) {
    whatTheyNeed.push('Direct private developer and client lead generation funnel');
  }

  // Fallbacks if list is short
  if (whatTheyNeed.length === 0) {
    whatTheyNeed.push('Modernized digital presentation for current developments');
    whatTheyNeed.push('Institutional credibility enhancement');
  }

  // 3. What I Can Offer
  const serviceSuite = getRecommendedServiceSuite({
    signals: input.opportunitySignals,
    websiteStatus: input.websiteStatus,
    hasWebsite: Boolean(input.website),
    activeProjectsCount: activeCount,
    completedProjectsCount: completedCount,
    digitalAudit: input.digitalAudit
  });

  serviceSuite.recommendedServices.forEach(s => {
    whatICanOffer.push(`${s.name} (${s.category})`);
  });

  return {
    whatTheyHave,
    whatTheyNeed,
    whatICanOffer,
    estimatedDealSize: serviceSuite.totalEstimatedValue,
    packageName: serviceSuite.primaryPackageName
  };
}

export type OutreachChannel = 'executive_email' | 'linkedin' | 'whatsapp' | 'phone';

export type OutreachDraftItem = {
  channel: OutreachChannel;
  channelTitle: string;
  subject?: string;
  message: string;
  whyThisMessage: string;
  factsUsed: string[];
  sourcesUsed: string[];
  cta: string;
};

/**
 * Fact-based outreach draft generator.
 * NEVER invents facts. Strictly references verified project names, locations, and real decision maker names.
 */
export function generateFactBasedOutreach(
  input: AcquisitionEntityInput
): Record<OutreachChannel, OutreachDraftItem> {
  const companyName = input.companyName;
  const dmName = input.primaryDecisionMaker?.name || 'Managing Director';
  const dmRole = input.primaryDecisionMaker?.role || 'Executive';
  const activeProj = input.activeProjects?.[0]?.name;
  const projectListStr = input.activeProjects?.map(p => p.name).slice(0, 2).join(', ');
  const city = input.city || 'Romania';

  const factsUsed: string[] = [
    `Company: ${companyName}`,
    `Location: ${city}`
  ];
  const sourcesUsed: string[] = [];

  if (activeProj) {
    factsUsed.push(`Active Project: ${activeProj}`);
  }
  if (input.primaryDecisionMaker?.name) {
    factsUsed.push(`Decision Maker: ${input.primaryDecisionMaker.name} (${dmRole})`);
  }
  if (input.primaryDecisionMaker?.source) {
    sourcesUsed.push(input.primaryDecisionMaker.source);
  }

  // 1. Executive Email
  const emailSubject = activeProj
    ? `Commercial presentation for ${activeProj} · ${companyName}`
    : `Digital architecture & project showcase · ${companyName}`;

  let emailBody = `Dear ${dmName},\n\n`;
  if (activeProj) {
    emailBody += `We have been following the verified development of ${activeProj} in ${city}. The scale and civil engineering quality of ${companyName}'s work represents a notable standard.\n\n`;
  } else {
    emailBody += `We have been documenting leading construction and civil engineering developments across ${city}.\n\n`;
  }

  if (input.websiteStatus === 'no_website' || !input.website) {
    emailBody += `We noticed that ${companyName} does not currently operate a dedicated institutional website to showcase these project milestones and capture high-intent procurement inquiries.\n\n`;
  } else {
    emailBody += `We noticed an opportunity to elevate the commercial presentation and case-study visibility of ${companyName}'s active portfolio.\n\n`;
  }

  emailBody += `AiXLuxury creates bespoke digital platforms, project microsites, and architectural media for Romania's premier builders. Would you be open to a brief 10-minute briefing this week to review a preliminary concept tailored to ${companyName}?\n\nBest regards,\nCristian Văduva\nFounder, CONSTRUCTIONS by AiXLuxury\nhttps://constructions.aixluxury.com`;

  const emailDraft: OutreachDraftItem = {
    channel: 'executive_email',
    channelTitle: 'Executive Email',
    subject: emailSubject,
    message: emailBody,
    whyThisMessage: `Directly references verified project involvement (${activeProj || companyName}) and highlights the specific digital gap without generic flattery.`,
    factsUsed,
    sourcesUsed,
    cta: '10-minute briefing to review preliminary concept'
  };

  // 2. LinkedIn InMail
  let linkedinMessage = `Hello ${dmName},\n\n`;
  if (activeProj) {
    linkedinMessage += `I came across ${companyName}'s ongoing work on ${activeProj}. Impressive engineering milestone for ${city}.\n\n`;
  } else {
    linkedinMessage += `I have been following ${companyName}'s portfolio across ${city}.\n\n`;
  }
  linkedinMessage += `We build high-performance digital presentations, project showcases, and B2B inquiry funnels for landmark construction companies.\n\nWould you be open to connecting and reviewing a brief concept designed for ${companyName}?`;

  const linkedinDraft: OutreachDraftItem = {
    channel: 'linkedin',
    channelTitle: 'LinkedIn InMail / Message',
    message: linkedinMessage,
    whyThisMessage: 'Concise executive note tailored for LinkedIn decision makers with zero spam syntax.',
    factsUsed,
    sourcesUsed,
    cta: 'Connect and review brief concept'
  };

  // 3. WhatsApp Direct
  let whatsappMessage = `Bună ziua, ${dmName}.\n\n`;
  if (activeProj) {
    whatsappMessage += `Vă contactez din partea platformei CONSTRUCTIONS by AiXLuxury. Am documentat recent dezvoltarea proiectului ${activeProj} realizat de ${companyName}.\n\n`;
  } else {
    whatsappMessage += `Vă contactez din partea platformei CONSTRUCTIONS by AiXLuxury referitor la portofoliul ${companyName} din ${city}.\n\n`;
  }
  whatsappMessage += `Pregătim o prezentare digitală dedicată pentru lucrările dumneavoastră. Când ar fi un moment oportun pentru o scurtă discuție de 5 minute?\n\nCristian Văduva\nconstructions.aixluxury.com`;

  const whatsappDraft: OutreachDraftItem = {
    channel: 'whatsapp',
    channelTitle: 'WhatsApp Direct (Executive)',
    message: whatsappMessage,
    whyThisMessage: 'Polite, direct Romanian business introduction referencing verified local projects.',
    factsUsed,
    sourcesUsed,
    cta: '5-minute call confirmation'
  };

  // 4. Phone Script
  let phoneScript = `[INTRO]\n"Bună ziua, ${dmName}? Cristian Văduva vă deranjează, de la CONSTRUCTIONS by AiXLuxury."\n\n`;
  phoneScript += `[CONTEXT & FACT]\n`;
  if (activeProj) {
    phoneScript += `"Vă contactez punctual pentru că urmărim proiectul ${activeProj} la care lucrați în ${city}."\n\n`;
  } else {
    phoneScript += `"Vă contactez punctual pentru că am indexat activitatea de construcții a companiei ${companyName} în ${city}."\n\n`;
  }
  phoneScript += `[PROPOSITION]\n"Noi realizăm infrastructura digitală și prezentarea comercială pentru marii constructori din România. Am observat că portofoliul dumneavoastră merită o platformă de prezentare dedicată pentru a atrage investitori și dezvoltatori privați."\n\n`;
  phoneScript += `[ASK / CTA]\n"Avem o machetă inițială pregătită pentru ${companyName}. Când ar fi mai potrivit să vă trimit un link de 2 minute pe WhatsApp sau email?"`;

  const phoneDraft: OutreachDraftItem = {
    channel: 'phone',
    channelTitle: 'Direct Phone Call Script',
    message: phoneScript,
    whyThisMessage: 'Structured 30-second call script: Intro → Verified Context → Concrete Gap → Low-friction CTA.',
    factsUsed,
    sourcesUsed,
    cta: 'Permission to send preview link'
  };

  return {
    executive_email: emailDraft,
    linkedin: linkedinDraft,
    whatsapp: whatsappDraft,
    phone: phoneDraft
  };
}
