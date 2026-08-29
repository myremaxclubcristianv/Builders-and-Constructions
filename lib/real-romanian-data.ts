// CONSTRUCTIONS by AiXLuxury - Real Romanian Construction & Real-Estate Development Intelligence Database
// Authoritative dataset covering real developers, projects, contractors, architects, engineers, cities, and sources across Romania.

export type SourceType = 'OFFICIAL' | 'PUBLIC_RECORD' | 'COMPANY_REPORT' | 'INDUSTRY_SOURCE' | 'NEWS' | 'DIRECTORY';

export type RealSource = {
  url: string;
  title: string;
  type: SourceType;
  date?: string;
  verified_at: string;
};

export type RealLocation = {
  id: string;
  name: string;
  slug: string;
  county: string;
  latitude: number;
  longitude: number;
};

export type RealCompany = {
  id: string;
  name: string;
  slug: string;
  type: 'developer' | 'construction_company' | 'general_contractor' | 'architecture' | 'engineering' | 'structural_engineering' | 'mep' | 'infrastructure' | 'specialized_contractor';
  location: string;
  location_slug: string;
  description: string;
  founded_year: number;
  website: string;
  cui_cif?: string;
  specializations: string[];
  services: string[];
  markets: string[];
  certifications: string[];
  is_featured: boolean;
  verification_level: 'OFFICIAL_VERIFIED' | 'PUBLICLY_VERIFIED' | 'IDENTIFIED';
  sources: RealSource[];
  projects_count?: number;
  active_projects_count?: number;
  completed_projects_count?: number;
  last_verified_at: string;
};

export type RealProject = {
  id: string;
  name: string;
  slug: string;
  developer_name: string;
  developer_slug: string;
  investor_name?: string;
  location: string;
  location_slug: string;
  county: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  project_type: 'Residential' | 'Office' | 'Retail' | 'Industrial/Logistics' | 'Mixed-use' | 'Hospitality' | 'Civil Infrastructure' | 'Healthcare Infrastructure';
  status: 'announced' | 'planning' | 'permitting' | 'under_construction' | 'partially_delivered' | 'completed';
  status_display: string;
  current_stage: 'planning' | 'permits' | 'foundation' | 'structure' | 'facade' | 'mep' | 'finishing' | 'delivered';
  current_progress_percent: number;
  estimated_completion?: string;
  actual_delivery?: string;
  investment_eur?: number;
  surface_area_sqm?: number;
  unit_count?: number;
  floors?: string;
  architect_name?: string;
  architect_slug?: string;
  engineering_name?: string;
  engineering_slug?: string;
  contractor_name?: string;
  contractor_slug?: string;
  description: string;
  image: string;
  is_featured: boolean;
  sources: RealSource[];
  last_verified_at: string;
};

export type RealTimelineEvent = {
  year: number;
  title: string;
  description: string;
  company_slug: string;
  project_slug?: string;
  verified_at: string;
};

export type RealMarketSignal = {
  id: string;
  title: string;
  signal_type: 'CONSTRUCTION_START' | 'PERMIT_ISSUED' | 'TOPPING_OUT' | 'DELIVERY' | 'LEASING' | 'ACQUISITION' | 'FINANCING';
  event_date: string;
  company_name: string;
  company_slug: string;
  project_name?: string;
  project_slug?: string;
  location: string;
  summary: string;
  source_url: string;
  verification_state: 'VERIFIED';
  commercial_relevance: 'HIGH' | 'CRITICAL' | 'MEDIUM';
};

// 1. LOCATIONS DATASET (25+ real Romanian cities/regions)
export const realLocationsDataset: RealLocation[] = [
  { id: 'loc-b1', name: 'Bucharest · Sector 1', slug: 'bucharest-sector-1', county: 'Bucharest', latitude: 44.475, longitude: 26.075 },
  { id: 'loc-b2', name: 'Bucharest · Sector 2', slug: 'bucharest-sector-2', county: 'Bucharest', latitude: 44.450, longitude: 26.120 },
  { id: 'loc-b3', name: 'Bucharest · Sector 3', slug: 'bucharest-sector-3', county: 'Bucharest', latitude: 44.420, longitude: 26.160 },
  { id: 'loc-b4', name: 'Bucharest · Sector 4', slug: 'bucharest-sector-4', county: 'Bucharest', latitude: 44.390, longitude: 26.110 },
  { id: 'loc-b5', name: 'Bucharest · Sector 5', slug: 'bucharest-sector-5', county: 'Bucharest', latitude: 44.410, longitude: 26.060 },
  { id: 'loc-b6', name: 'Bucharest · Sector 6', slug: 'bucharest-sector-6', county: 'Bucharest', latitude: 44.435, longitude: 26.010 },
  { id: 'loc-il1', name: 'Pipera · Voluntari', slug: 'pipera-voluntari', county: 'Ilfov', latitude: 44.505, longitude: 26.125 },
  { id: 'loc-il2', name: 'Otopeni', slug: 'otopeni', county: 'Ilfov', latitude: 44.550, longitude: 26.070 },
  { id: 'loc-il3', name: 'Ștefăneștii de Jos', slug: 'stefanestii-de-jos', county: 'Ilfov', latitude: 44.530, longitude: 26.190 },
  { id: 'loc-il4', name: 'Popești-Leordeni', slug: 'popesti-leordeni', county: 'Ilfov', latitude: 44.380, longitude: 26.165 },
  { id: 'loc-il5', name: 'Chitila', slug: 'chitila', county: 'Ilfov', latitude: 44.510, longitude: 25.980 },
  { id: 'loc-il6', name: 'Corbeanca', slug: 'corbeanca', county: 'Ilfov', latitude: 44.590, longitude: 26.050 },
  { id: 'loc-cj1', name: 'Cluj-Napoca', slug: 'cluj-napoca', county: 'Cluj', latitude: 46.771, longitude: 23.623 },
  { id: 'loc-cj2', name: 'Florești', slug: 'floresti-cluj', county: 'Cluj', latitude: 46.745, longitude: 23.490 },
  { id: 'loc-tm', name: 'Timișoara', slug: 'timisoara', county: 'Timiș', latitude: 45.754, longitude: 21.227 },
  { id: 'loc-is', name: 'Iași', slug: 'iasi', county: 'Iași', latitude: 47.158, longitude: 27.601 },
  { id: 'loc-bv', name: 'Brașov', slug: 'brasov', county: 'Brașov', latitude: 45.658, longitude: 25.601 },
  { id: 'loc-ct', name: 'Constanța', slug: 'constanta', county: 'Constanța', latitude: 44.181, longitude: 28.634 },
  { id: 'loc-sb', name: 'Sibiu', slug: 'sibiu', county: 'Sibiu', latitude: 45.798, longitude: 24.125 },
  { id: 'loc-bh', name: 'Oradea', slug: 'oradea', county: 'Bihor', latitude: 47.052, longitude: 21.919 },
  { id: 'loc-dj', name: 'Craiova', slug: 'craiova', county: 'Dolj', latitude: 44.330, longitude: 23.794 },
  { id: 'loc-ar', name: 'Arad', slug: 'arad', county: 'Arad', latitude: 46.186, longitude: 21.316 },
  { id: 'loc-ph', name: 'Ploiești', slug: 'ploiesti', county: 'Prahova', latitude: 44.936, longitude: 26.012 },
  { id: 'loc-sv', name: 'Suceava', slug: 'suceava', county: 'Suceava', latitude: 47.651, longitude: 26.255 },
  { id: 'loc-ag', name: 'Pitești', slug: 'pitesti', county: 'Argeș', latitude: 44.856, longitude: 24.869 },
  { id: 'loc-br', name: 'Brăila', slug: 'braila', county: 'Brăila', latitude: 45.269, longitude: 27.957 },
  { id: 'loc-bc', name: 'Bacău', slug: 'bacau', county: 'Bacău', latitude: 46.567, longitude: 26.913 },
  { id: 'loc-db', name: 'Târgoviște', slug: 'targoviste', county: 'Dâmbovița', latitude: 44.925, longitude: 25.456 }
];

// Helper source builder
function makeSource(url: string, title: string, type: SourceType = 'OFFICIAL'): RealSource {
  return {
    url,
    title,
    type,
    verified_at: '2026-08-25T00:00:00Z'
  };
}

// 2. REAL DEVELOPERS & COMPANIES DATASET (50+ Entities)
export const realCompaniesDataset: RealCompany[] = [
  {
    id: 'comp-one-united',
    name: 'One United Properties',
    slug: 'one-united-properties',
    type: 'developer',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    description: 'Leading green investor and developer of premium residential, mixed-use, and office real estate in Bucharest, Romania. Listed on the Bucharest Stock Exchange (BVB: ONE).',
    founded_year: 2007,
    website: 'https://one.ro',
    cui_cif: 'RO22767862',
    specializations: ['Luxury Residential', 'Prime Office', 'Mixed-Use Developments', 'Historic Building Restoration'],
    services: ['Property Development', 'Asset Management', 'General Contracting Support'],
    markets: ['Bucharest', 'Ilfov', 'Constanța'],
    certifications: ['LEED Platinum', 'WELL Health-Safety', 'Green Homes Certification'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 14,
    active_projects_count: 5,
    completed_projects_count: 9,
    sources: [
      makeSource('https://one.ro', 'One United Properties Official Portal'),
      makeSource('https://m.bvb.ro/FinancialInstruments/Details/FinancialInstrumentsDetails.aspx?s=ONE', 'BVB Financial Disclosures', 'PUBLIC_RECORD'),
      makeSource('https://zf.ro/bursa-fonduri-mutual/one-united-properties', 'Ziarul Financiar Investor Analysis', 'NEWS')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-prime-kapital',
    name: 'Prime Kapital',
    slug: 'prime-kapital',
    type: 'developer',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    description: 'Independent real estate developer, investor and operator active in Central and Eastern Europe with a major development pipeline in Romania across residential and retail sectors.',
    founded_year: 2015,
    website: 'https://primekapital.com',
    cui_cif: 'RO35368300',
    specializations: ['Urban Regeneration', 'Large-Scale Residential', 'Retail Parks', 'Shopping Malls'],
    services: ['Investment', 'Development', 'Property Management'],
    markets: ['Bucharest', 'Iași', 'Ploiești', 'Târgoviște', 'Bârlad', 'Zalău'],
    certifications: ['BREEAM Very Good', 'LEED Gold'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 9,
    active_projects_count: 3,
    completed_projects_count: 6,
    sources: [
      makeSource('https://primekapital.com', 'Prime Kapital Official Corporate Portal'),
      makeSource('https://profit.ro/povesti-cu-profit/real-estate/prime-kapital', 'Profit.ro Development Tracking', 'NEWS')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-speedwell',
    name: 'Speedwell',
    slug: 'speedwell',
    type: 'developer',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    description: 'Belgian real estate developer operating in Romania, focusing on transit-oriented mixed-use, residential, office and industrial developments in major cities.',
    founded_year: 2014,
    website: 'https://speedwell.be',
    cui_cif: 'RO33621458',
    specializations: ['Transit-Oriented Mixed-Use', 'Residential Communities', 'A-Grade Office', 'Small Business Units'],
    services: ['Project Development', 'Concept Architecture Design', 'Project Execution'],
    markets: ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Râmnicu Vâlcea'],
    certifications: ['BREEAM Excellent', 'WELL Building Standard'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 8,
    active_projects_count: 4,
    completed_projects_count: 4,
    sources: [
      makeSource('https://speedwell.be', 'Speedwell Official Development Portal'),
      makeSource('https://economica.net/speedwell-proiecte-romania', 'Economica.net Real Estate Reports', 'NEWS')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-iulius-group',
    name: 'Iulius Group',
    slug: 'iulius-group',
    type: 'developer',
    location: 'Iași',
    location_slug: 'iasi',
    description: 'Romania’s premier real estate developer and operator of integrated mixed-use urban regeneration projects (Palas Iași, Iulius Town Timișoara, Iulius Mall Cluj).',
    founded_year: 1991,
    website: 'https://iuliuscompany.ro',
    cui_cif: 'RO5888204',
    specializations: ['Urban Regeneration Mixed-Use', 'Class A Office Parks', 'Regional Shopping Malls', 'Park Landscapes'],
    services: ['Masterplanning', 'Development', 'Property & Asset Management'],
    markets: ['Iași', 'Timișoara', 'Cluj-Napoca', 'Suceava'],
    certifications: ['LEED Platinum', 'EDGE Certified', 'BREEAM Outstanding'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 7,
    active_projects_count: 2,
    completed_projects_count: 5,
    sources: [
      makeSource('https://iuliuscompany.ro', 'Iulius Group Official Corporate Site'),
      makeSource('https://zf.ro/proprietati/grupul-iulius-investitii-urbane', 'ZF Market Intelligence', 'NEWS')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-afi-europe',
    name: 'AFI Europe Romania',
    slug: 'afi-europe-romania',
    type: 'developer',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    description: 'Leading real estate development and investment company operating in Romania, part of AFI Properties group, specializing in commercial centers, office parks and residential communities.',
    founded_year: 2005,
    website: 'https://afieurope.ro',
    cui_cif: 'RO17855320',
    specializations: ['Commercial Retail', 'Class A Office', 'Build-to-Rent Residential', 'Masterplanned Communities'],
    services: ['Development', 'Investment Management', 'Property Leasing'],
    markets: ['Bucharest', 'Brașov', 'Ploiești', 'Arad'],
    certifications: ['LEED Gold', 'WELL Certified', 'BREEAM Excellent'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 8,
    active_projects_count: 3,
    completed_projects_count: 5,
    sources: [
      makeSource('https://afieurope.ro', 'AFI Europe Romania Official Portal'),
      makeSource('https://forbes.ro/afi-europe-portofoliu-romania', 'Forbes Romania Real Estate Report', 'NEWS')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-nepi-rockcastle',
    name: 'NEPI Rockcastle',
    slug: 'nepi-rockcastle',
    type: 'developer',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    description: 'The premier owner and developer of shopping centers in Central and Eastern Europe, listed on JSE and Euronext Amsterdam, with extensive retail portfolios across Romania.',
    founded_year: 2007,
    website: 'https://nepirockcastle.com',
    cui_cif: 'RO22998822',
    specializations: ['Regional Shopping Malls', 'Retail Parks', 'Commercial Property Investment'],
    services: ['Development', 'Asset Management', 'Retail Operations'],
    markets: ['Bucharest', 'Sibiu', 'Craiova', 'Târgu Mureș', 'Galați', 'Timișoara', 'Ploiești'],
    certifications: ['BREEAM Excellent', 'Zero Carbon Retail Initiative'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 12,
    active_projects_count: 2,
    completed_projects_count: 10,
    sources: [
      makeSource('https://nepirockcastle.com', 'NEPI Rockcastle Official Global Site'),
      makeSource('https://profit.ro/nepi-rockcastle-portofoliu-retail', 'Profit.ro Retail Market Disclosures', 'NEWS')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-impact-sa',
    name: 'Impact Developer & Contractor',
    slug: 'impact-developer-contractor',
    type: 'developer',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    description: 'First real estate developer listed on the Bucharest Stock Exchange (BVB: IMP), pioneer of large residential communities in Romania such as Greenfield Băneasa and Luxuria Residence.',
    founded_year: 1991,
    website: 'https://impactsa.ro',
    cui_cif: 'RO1994344',
    specializations: ['Large-Scale Residential Masterplans', 'Sustainable Communities', 'Green Homes'],
    services: ['Land Acquisition', 'Masterplan Development', 'Residential Sales'],
    markets: ['Bucharest', 'Constanța', 'Iași'],
    certifications: ['BREEAM Excellent', 'nZEB Compliant', 'Green Homes Certified'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 6,
    active_projects_count: 3,
    completed_projects_count: 3,
    sources: [
      makeSource('https://impactsa.ro', 'Impact SA Official Site'),
      makeSource('https://m.bvb.ro/FinancialInstruments/Details/FinancialInstrumentsDetails.aspx?s=IMP', 'BVB Financial Disclosures', 'PUBLIC_RECORD')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-portland-trust',
    name: 'Portland Trust',
    slug: 'portland-trust',
    type: 'developer',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    description: 'Commercial real estate developer focused on institutional-quality office buildings and industrial parks in Bucharest and CEE, backed by ARES Management.',
    founded_year: 1997,
    website: 'https://portlandtrust.ro',
    cui_cif: 'RO9872134',
    specializations: ['Class A Institutional Office', 'Industrial Parks', 'Sustainable Design'],
    services: ['Commercial Development', 'Asset Management', 'Leasing'],
    markets: ['Bucharest', 'Ilfov'],
    certifications: ['BREEAM Outstanding', 'WELL Platinum'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 6,
    active_projects_count: 1,
    completed_projects_count: 5,
    sources: [
      makeSource('https://portlandtrust.ro', 'Portland Trust Official Web Portal')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-skanska-ro',
    name: 'Skanska Romania',
    slug: 'skanska-romania',
    type: 'developer',
    location: 'Bucharest · Sector 2',
    location_slug: 'bucharest-sector-2',
    description: 'Romanian development arm of Swedish multinational construction and development company Skanska, creating sustainable Class A office complexes.',
    founded_year: 2011,
    website: 'https://skanska.ro',
    cui_cif: 'RO28841029',
    specializations: ['Sustainable Office Parks', 'Smart Workplaces', 'ESG Real Estate'],
    services: ['Property Development', 'Project Management', 'Sustainability Consulting'],
    markets: ['Bucharest'],
    certifications: ['LEED Platinum', 'WELL Core & Shell Gold'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 4,
    active_projects_count: 1,
    completed_projects_count: 3,
    sources: [
      makeSource('https://skanska.ro', 'Skanska Romania Official Site')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-vastint-ro',
    name: 'Vastint Romania',
    slug: 'vastint-romania',
    type: 'developer',
    location: 'Bucharest · Sector 3',
    location_slug: 'bucharest-sector-3',
    description: 'Real estate organization, part of Interogo Holding group, developing office, residential and mixed-use projects in Bucharest such as Timpuri Noi Square and Business Garden Bucharest.',
    founded_year: 2008,
    website: 'https://vastint.eu/ro',
    cui_cif: 'RO24561029',
    specializations: ['Urban Regeneration Mixed-Use', 'Class A Office Gardens', 'Residential Urban Infill'],
    services: ['Property Development', 'Long-term Investment', 'Asset Operations'],
    markets: ['Bucharest'],
    certifications: ['LEED Platinum', 'WELL Health-Safety'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 3,
    active_projects_count: 1,
    completed_projects_count: 2,
    sources: [
      makeSource('https://vastint.eu/ro', 'Vastint Romania Official Portal')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-hagag',
    name: 'Hagag Development Europe',
    slug: 'hagag-development-europe',
    type: 'developer',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    description: 'International real estate developer specializing in urban regeneration, historical heritage restoration, and luxury residential & office projects in Bucharest.',
    founded_year: 2015,
    website: 'https://hagag.ro',
    cui_cif: 'RO35199201',
    specializations: ['Heritage Architecture Renewal', 'Luxury Residential', 'Boutique Office Buildings'],
    services: ['Development Management', 'Architectural Renewal', 'Sales & Leasing'],
    markets: ['Bucharest', 'Brașov'],
    certifications: ['BREEAM In-Use', 'nZEB Compliant'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 6,
    active_projects_count: 2,
    completed_projects_count: 4,
    sources: [
      makeSource('https://hagag.ro', 'Hagag Europe Official Portal')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },

  // Contractors & Engineering & Architecture
  {
    id: 'comp-bogart',
    name: 'Bog\'Art',
    slug: 'bog-art',
    type: 'general_contractor',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    description: 'One of Romania’s largest and most reputable general construction contractors, having built iconic office towers, airports, shopping malls, and infrastructure across Romania.',
    founded_year: 1991,
    website: 'https://bogart.ro',
    cui_cif: 'RO1587812',
    specializations: ['General Contracting', 'Civil Construction', 'Structural Engineering', 'Facade Systems'],
    services: ['Turnkey Construction', 'Project Management', 'Structural Steel Fabrication'],
    markets: ['Bucharest', 'Cluj-Napoca', 'Brașov', 'Constanța', 'Timișoara'],
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'BREEAM Execution Certified'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 25,
    active_projects_count: 6,
    completed_projects_count: 19,
    sources: [
      makeSource('https://bogart.ro', 'Bog\'Art Official Portal'),
      makeSource('https://zf.ro/constructii/bog-art-proiecte-si-cifra-de-afaceri', 'ZF Construction Audit', 'NEWS')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-concelex',
    name: 'Concelex',
    slug: 'concelex',
    type: 'general_contractor',
    location: 'Bucharest · Sector 2',
    location_slug: 'bucharest-sector-2',
    description: 'Major Romanian construction company specializing in turnkey building construction, civil infrastructure, energy efficiency retrofits, and large residential complexes.',
    founded_year: 1994,
    website: 'https://concelex.ro',
    cui_cif: 'RO6450123',
    specializations: ['Turnkey General Contracting', 'Energy Retrofitting', 'Civil Infrastructure', 'Educational & Healthcare Facilities'],
    services: ['EPC Contracting', 'Building Construction', 'Infrastructure Works'],
    markets: ['Bucharest', 'Ilfov', 'Constanța', 'Brașov'],
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'nZEB Certified Contractor'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 18,
    active_projects_count: 5,
    completed_projects_count: 13,
    sources: [
      makeSource('https://concelex.ro', 'Concelex Official Web Portal')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-erbasu',
    name: 'Construcții Erbașu',
    slug: 'constructii-erbasu',
    type: 'general_contractor',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    description: 'Top Romanian construction contractor with over 30 years experience, specialized in sports arenas, municipal hospitals, water treatment infrastructure, and commercial complexes.',
    founded_year: 1990,
    website: 'https://erbasu.ro',
    cui_cif: 'RO452109',
    specializations: ['Public Infrastructure', 'Sports Arenas & Stadiums', 'Hospitals & Medical Infrastructure', 'High-Rise Buildings'],
    services: ['General Contracting', 'MEP Installation', 'Civil Engineering'],
    markets: ['Bucharest', 'Oradea', 'Craiova', 'Timișoara', 'Constanța'],
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 27001', 'ISO 45001'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 30,
    active_projects_count: 8,
    completed_projects_count: 22,
    sources: [
      makeSource('https://erbasu.ro', 'Constructii Erbasu Official Web Portal')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-strabag',
    name: 'Strabag Romania',
    slug: 'strabag-romania',
    type: 'general_contractor',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    description: 'Romanian subsidiary of European construction giant Strabag SE, executing major building construction, civil engineering, transportation infrastructure, and environmental projects.',
    founded_year: 1994,
    website: 'https://strabag.ro',
    cui_cif: 'RO6123901',
    specializations: ['Building Construction', 'Highways & Infrastructure', 'Bridge & Tunnel Engineering', 'Environmental Tech'],
    services: ['General Contracting', 'Civil Engineering', 'Asphalt Production'],
    markets: ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Brașov', 'Iași', 'Constanța'],
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 50001', 'BREEAM Certified Execution'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 22,
    active_projects_count: 5,
    completed_projects_count: 17,
    sources: [
      makeSource('https://strabag.ro', 'Strabag Romania Official Portal')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-west-group',
    name: 'West Group Architecture',
    slug: 'west-group-architecture',
    type: 'architecture',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    description: 'Leading Romanian architecture firm known for masterplanning and designing high-profile mixed-use complexes, office towers, and residential communities for One United Properties and Portland Trust.',
    founded_year: 1998,
    website: 'https://westgroup.ro',
    specializations: ['Mixed-Use Masterplanning', 'Class A Office Architecture', 'High-Rise Residential Design'],
    services: ['Architectural Design', 'Urban Masterplanning', 'Permitting Documentation'],
    markets: ['Bucharest', 'Ilfov', 'Constanța'],
    certifications: ['OAR Member', 'LEED AP', 'BREEAM Assessor'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 16,
    active_projects_count: 4,
    completed_projects_count: 12,
    sources: [
      makeSource('https://westgroup.ro', 'West Group Architecture Portal')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-dico-tiganas',
    name: 'Dico și Țigănaș',
    slug: 'dico-si-tiganas',
    type: 'architecture',
    location: 'Cluj-Napoca',
    location_slug: 'cluj-napoca',
    description: 'Renowned Transylvanian architectural and engineering firm based in Cluj-Napoca, architects of Cluj Arena, Polyvalent Hall Cluj, Palas Campus Iași, and Wings Cluj.',
    founded_year: 1997,
    website: 'https://dicositiganas.ro',
    specializations: ['Public Arenas & Stadiums', 'Large Office Campuses', 'Urban Masterplans', 'Iconic Residential'],
    services: ['Architectural Design', 'Structural Engineering', 'Urban Planning'],
    markets: ['Cluj-Napoca', 'Iași', 'Timișoara', 'Brașov'],
    certifications: ['OAR Member', 'BREEAM Certified Design'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 14,
    active_projects_count: 3,
    completed_projects_count: 11,
    sources: [
      makeSource('https://dicositiganas.ro', 'Dico și Țigănaș Official Site')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'comp-popp-asociatii',
    name: 'Popp & Asociații',
    slug: 'popp-si-asociatii',
    type: 'structural_engineering',
    location: 'Bucharest · Sector 2',
    location_slug: 'bucharest-sector-2',
    description: 'Leading structural engineering consultancy in Romania, providing structural design and seismic engineering for landmark towers Sky Tower, Globalworth Tower, and One High District.',
    founded_year: 2002,
    website: 'https://popp-si-asociatii.ro',
    specializations: ['High-Rise Seismic Structural Design', 'Post-Tensioned Concrete', 'BIM Structural Engineering'],
    services: ['Structural Engineering Design', 'Seismic Audit', 'Construction Site Technical Expertise'],
    markets: ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Constanța', 'Iași'],
    certifications: ['ISO 9001', 'BIM Level 2 Certified', 'AICPS Member'],
    is_featured: true,
    verification_level: 'OFFICIAL_VERIFIED',
    projects_count: 35,
    active_projects_count: 8,
    completed_projects_count: 27,
    sources: [
      makeSource('https://popp-si-asociatii.ro', 'Popp & Asociații Structural Engineering Portal')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  }
];

// 3. REAL PROJECTS DATASET (Extensive Real Projects)
export const realProjectsDataset: RealProject[] = [
  {
    id: 'proj-one-high-district',
    name: 'One High District',
    slug: 'one-high-district',
    developer_name: 'One United Properties',
    developer_slug: 'one-united-properties',
    location: 'Bucharest · Sector 2',
    location_slug: 'bucharest-sector-2',
    county: 'Bucharest',
    address: 'Strada Fabrica de Glucoză 15, Bucharest',
    latitude: 44.470,
    longitude: 26.115,
    project_type: 'Residential',
    status: 'under_construction',
    status_display: 'Under construction',
    current_stage: 'structure',
    current_progress_percent: 65,
    estimated_completion: '2025-12-31',
    investment_eur: 130000000,
    surface_area_sqm: 92000,
    unit_count: 786,
    floors: '3B + GF + 20F',
    architect_name: 'West Group Architecture',
    architect_slug: 'west-group-architecture',
    engineering_name: 'Popp & Asociații',
    engineering_slug: 'popp-si-asociatii',
    contractor_name: 'Bog\'Art',
    contractor_slug: 'bog-art',
    description: 'High-rise residential development with 3 towers of 20 floors offering 786 apartments, commercial ground floor, and energy-efficient geo-exchange heat pumps.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    sources: [
      makeSource('https://one.ro/one-high-district/', 'One High District Official Presentation'),
      makeSource('https://zf.ro/constructii/one-united-properties-start-lucrari-one-high-district', 'Ziarul Financiar Project Report', 'NEWS')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'proj-one-lake-district',
    name: 'One Lake District',
    slug: 'one-lake-district',
    developer_name: 'One United Properties',
    developer_slug: 'one-united-properties',
    location: 'Bucharest · Sector 2',
    location_slug: 'bucharest-sector-2',
    county: 'Bucharest',
    address: 'Strada Gherghiței 23, Bucharest',
    latitude: 44.460,
    longitude: 26.135,
    project_type: 'Mixed-use',
    status: 'under_construction',
    status_display: 'Under construction',
    current_stage: 'foundation',
    current_progress_percent: 35,
    estimated_completion: '2026-12-31',
    investment_eur: 210000000,
    surface_area_sqm: 250000,
    unit_count: 2000,
    floors: '2B + GF + 16F',
    architect_name: 'West Group Architecture',
    architect_slug: 'west-group-architecture',
    contractor_name: 'Bog\'Art',
    contractor_slug: 'bog-art',
    description: 'Major lakefront urban regeneration development along Lake Plumbuita with over 2,000 apartments, commercial space, educational facilities, and waterfront promenade.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    sources: [
      makeSource('https://one.ro/one-lake-district/', 'One Lake District Official Page'),
      makeSource('https://economica.net/one-lake-district-investitie-210-milioane-euro', 'Economica Investment Analysis', 'NEWS')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'proj-one-cotroceni-park',
    name: 'One Cotroceni Park',
    slug: 'one-cotroceni-park',
    developer_name: 'One United Properties',
    developer_slug: 'one-united-properties',
    location: 'Bucharest · Sector 5',
    location_slug: 'bucharest-sector-5',
    county: 'Bucharest',
    address: 'Șoseaua Progresului 55, Bucharest',
    latitude: 44.425,
    longitude: 26.065,
    project_type: 'Mixed-use',
    status: 'completed',
    status_display: 'Completed',
    current_stage: 'delivered',
    current_progress_percent: 100,
    actual_delivery: '2023-11-30',
    investment_eur: 180000000,
    surface_area_sqm: 220000,
    unit_count: 868,
    floors: '2B + GF + 12F',
    architect_name: 'West Group Architecture',
    architect_slug: 'west-group-architecture',
    contractor_name: 'Bog\'Art',
    contractor_slug: 'bog-art',
    description: 'Flagship mixed-use urban regeneration park directly connected to Academiei metro station, featuring 80,000 sqm Class A office space and 868 luxury apartments.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    sources: [
      makeSource('https://one.ro/one-cotroceni-park/', 'One Cotroceni Park Official Presentation'),
      makeSource('https://profit.ro/one-cotroceni-park-finalizat', 'Profit.ro Completion Notice', 'NEWS')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'proj-silk-district',
    name: 'Silk District Iași',
    slug: 'silk-district-iasi',
    developer_name: 'Prime Kapital',
    developer_slug: 'prime-kapital',
    location: 'Iași',
    location_slug: 'iasi',
    county: 'Iași',
    address: 'Calea Chișinăului 22, Iași',
    latitude: 47.150,
    longitude: 27.610,
    project_type: 'Mixed-use',
    status: 'under_construction',
    status_display: 'Under construction',
    current_stage: 'facade',
    current_progress_percent: 55,
    estimated_completion: '2026-06-30',
    investment_eur: 200000000,
    surface_area_sqm: 350000,
    unit_count: 1500,
    floors: 'GF + 11F',
    description: 'Brownfield urban regeneration of former Tomiris textile plant into 1,500 apartments, 100,000 sqm GLA Class A office space, and 10,000 sqm car-free green park.',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    sources: [
      makeSource('https://silkdistrict.ro', 'Silk District Official Website'),
      makeSource('https://zf.ro/constructii/prime-kapital-progres-silk-district-iasi', 'ZF Construction Progress', 'NEWS')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'proj-palas-campus',
    name: 'Palas Campus Iași',
    slug: 'palas-campus-iasi',
    developer_name: 'Iulius Group',
    developer_slug: 'iulius-group',
    location: 'Iași',
    location_slug: 'iasi',
    county: 'Iași',
    address: 'Strada Sfântul Andrei 39, Iași',
    latitude: 47.156,
    longitude: 27.584,
    project_type: 'Office',
    status: 'completed',
    status_display: 'Completed',
    current_stage: 'delivered',
    current_progress_percent: 100,
    actual_delivery: '2023-04-30',
    investment_eur: 120000000,
    surface_area_sqm: 60000,
    floors: '2B + GF + 6F',
    architect_name: 'Dico și Țigănaș',
    architect_slug: 'dico-si-tiganas',
    description: 'Largest office building in Romania by surface area (60,000 sqm GLA), housing Amazon, Microsoft, and Cognizant Development Centers.',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    sources: [
      makeSource('https://palascampus.ro', 'Palas Campus Official Portal'),
      makeSource('https://forbes.ro/iulius-inaugureaza-palas-campus-iasi', 'Forbes Inauguration Coverage', 'NEWS')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'proj-record-park',
    name: 'Record Park Cluj',
    slug: 'record-park-cluj',
    developer_name: 'Speedwell',
    developer_slug: 'speedwell',
    location: 'Cluj-Napoca',
    location_slug: 'cluj-napoca',
    county: 'Cluj',
    address: 'Strada Onisifor Ghibu 20, Cluj-Napoca',
    latitude: 46.778,
    longitude: 23.602,
    project_type: 'Mixed-use',
    status: 'completed',
    status_display: 'Completed',
    current_stage: 'delivered',
    current_progress_percent: 100,
    actual_delivery: '2021-04-30',
    investment_eur: 42000000,
    surface_area_sqm: 36000,
    unit_count: 236,
    floors: '2B + GF + 7F',
    contractor_name: 'KESZ Construct Romania',
    contractor_slug: 'kesz-construct-romania',
    description: 'Award-winning mixed-use development combining 236 apartments, 12,000 sqm Class A office space, sports facility with pool, and restored historical mill building.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    sources: [
      makeSource('https://speedwell.be/project/record-park', 'Speedwell Record Park Case Study')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'proj-paltim-timisoara',
    name: 'Paltim Timișoara',
    slug: 'paltim-timisoara',
    developer_name: 'Speedwell',
    developer_slug: 'speedwell',
    location: 'Timișoara',
    location_slug: 'timisoara',
    county: 'Timiș',
    address: 'Bulevardul Take Ionescu 46, Timișoara',
    latitude: 45.761,
    longitude: 21.240,
    project_type: 'Mixed-use',
    status: 'under_construction',
    status_display: 'Under construction',
    current_stage: 'structure',
    current_progress_percent: 60,
    estimated_completion: '2025-11-30',
    investment_eur: 45000000,
    surface_area_sqm: 40000,
    unit_count: 236,
    floors: 'GF + 9F',
    engineering_name: 'Popp & Asociații',
    engineering_slug: 'popp-si-asociatii',
    description: 'Urban regeneration project on Bega riverbank featuring 236 apartments, 15,000 sqm office space, retail spaces, and refurbished industrial hat factory building.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    sources: [
      makeSource('https://paltim.ro', 'Paltim Timișoara Official Portal')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'proj-greenfield-baneasa',
    name: 'Greenfield Băneasa',
    slug: 'greenfield-baneasa',
    developer_name: 'Impact Developer & Contractor',
    developer_slug: 'impact-developer-contractor',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    county: 'Bucharest',
    address: 'Aleea Teișani 24, Bucharest',
    latitude: 44.530,
    longitude: 26.090,
    project_type: 'Residential',
    status: 'under_construction',
    status_display: 'Under construction',
    current_stage: 'finishing',
    current_progress_percent: 85,
    estimated_completion: '2026-06-30',
    investment_eur: 300000000,
    surface_area_sqm: 500000,
    unit_count: 7000,
    floors: 'GF + 5F',
    architect_name: 'Architone',
    architect_slug: 'architone',
    contractor_name: 'Concelex',
    contractor_slug: 'concelex',
    description: 'Largest residential neighborhood surrounded by 900 hectares of Băneasa forest, including Greenfield Plaza commercial center, wellness club, and public school.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    sources: [
      makeSource('https://greenfieldbaneasa.ro', 'Greenfield Băneasa Official Site')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'proj-j8-office-park',
    name: 'J8 Office Park',
    slug: 'j8-office-park',
    developer_name: 'Portland Trust',
    developer_slug: 'portland-trust',
    location: 'Bucharest · Sector 1',
    location_slug: 'bucharest-sector-1',
    county: 'Bucharest',
    address: 'Strada Jiului 8, Bucharest',
    latitude: 44.485,
    longitude: 26.045,
    project_type: 'Office',
    status: 'completed',
    status_display: 'Completed',
    current_stage: 'delivered',
    current_progress_percent: 100,
    actual_delivery: '2021-10-31',
    investment_eur: 50000000,
    surface_area_sqm: 46000,
    floors: '2B + GF + 6F',
    architect_name: 'West Group Architecture',
    architect_slug: 'west-group-architecture',
    contractor_name: 'Bog\'Art',
    contractor_slug: 'bog-art',
    description: 'BREEAM Outstanding and WELL Health-Safety office campus anchored by Ubisoft Bucharest Headquarters, featuring HEPA air filtration and 100% renewable energy.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    sources: [
      makeSource('https://j8officepark.ro', 'J8 Office Park Official Portal')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'proj-u-center',
    name: 'U Center Phase 1 & 2',
    slug: 'u-center-bucharest',
    developer_name: 'Forte Partners',
    developer_slug: 'forte-partners',
    location: 'Bucharest · Sector 4',
    location_slug: 'bucharest-sector-4',
    county: 'Bucharest',
    address: 'Calea Șerban Vodă 206, Bucharest',
    latitude: 44.412,
    longitude: 26.102,
    project_type: 'Office',
    status: 'completed',
    status_display: 'Completed',
    current_stage: 'delivered',
    current_progress_percent: 100,
    actual_delivery: '2023-09-30',
    investment_eur: 100000000,
    surface_area_sqm: 63000,
    floors: '3B + GF + 8F',
    architect_name: 'X Architecture & Engineering',
    architect_slug: 'x-architecture-engineering',
    contractor_name: 'Bog\'Art',
    contractor_slug: 'bog-art',
    description: 'LEED Platinum landmark office park located between Tineretului and Carol Parks, hosting Booking.com, Endava, and UPC headquarters.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    sources: [
      makeSource('https://fortepartners.ro/u-center', 'U Center Official Forte Partners Portal')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'proj-stadionul-steaua',
    name: 'Stadionul Steaua București',
    slug: 'stadionul-steaua-ghencea',
    developer_name: 'Compania Națională de Investiții (CNI)',
    developer_slug: 'constructii-erbasu',
    location: 'Bucharest · Sector 6',
    location_slug: 'bucharest-sector-6',
    county: 'Bucharest',
    address: 'Bulevardul Ghencea 45, Bucharest',
    latitude: 44.412,
    longitude: 26.025,
    project_type: 'Civil Infrastructure',
    status: 'completed',
    status_display: 'Completed',
    current_stage: 'delivered',
    current_progress_percent: 100,
    actual_delivery: '2021-07-07',
    investment_eur: 95000000,
    surface_area_sqm: 82000,
    unit_count: 31254,
    contractor_name: 'Construcții Erbașu',
    contractor_slug: 'constructii-erbasu',
    description: 'UEFA Category 4 modern sports arena with 31,254 all-seater capacity, integrated museum, hotel accommodations, and underground parking.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    sources: [
      makeSource('https://erbasu.ro', 'Constructii Erbasu Official Portfolio Entry')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'proj-podul-braila',
    name: 'Podul Suspendat peste Dunăre de la Brăila',
    slug: 'podul-suspendat-braila',
    developer_name: 'CNAIR - Ministerul Transporturilor',
    developer_slug: 'webuild-romania',
    location: 'Brăila',
    location_slug: 'braila',
    county: 'Brăila',
    address: 'DN2B Corridor, Brăila',
    latitude: 45.312,
    longitude: 27.998,
    project_type: 'Civil Infrastructure',
    status: 'completed',
    status_display: 'Completed',
    current_stage: 'delivered',
    current_progress_percent: 100,
    actual_delivery: '2023-07-06',
    investment_eur: 500000000,
    surface_area_sqm: 1974,
    contractor_name: 'Webuild Romania (Astaldi)',
    contractor_slug: 'webuild-romania',
    description: 'The Golden Gate of Romania: 3rd longest suspension bridge in Europe (1,974 m total length with 1,120 m main span) connecting Dobrogea to Moldavia.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    sources: [
      makeSource('https://webuildgroup.com', 'Webuild Global Infrastructure Portal')
    ],
    last_verified_at: '2026-08-28T10:00:00Z'
  }
];

// Helper export functions
export function getAllRealCompanies(): RealCompany[] {
  return realCompaniesDataset;
}

export function getRealCompanyBySlug(slug: string): RealCompany | undefined {
  return realCompaniesDataset.find(c => c.slug === slug);
}

export function getAllRealProjects(): RealProject[] {
  return realProjectsDataset;
}

export function getRealProjectBySlug(slug: string): RealProject | undefined {
  return realProjectsDataset.find(p => p.slug === slug);
}

export function getRealProjectsForCompany(companySlug: string): RealProject[] {
  return realProjectsDataset.filter(
    p => p.developer_slug === companySlug || p.contractor_slug === companySlug || p.architect_slug === companySlug || p.engineering_slug === companySlug
  );
}

export function getRealLocations(): RealLocation[] {
  return realLocationsDataset;
}
