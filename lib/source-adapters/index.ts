import crypto from 'crypto';

/**
 * Domain Allowlist & SSRF Security Guard for Source Ingestion
 */
const ALLOWED_SOURCE_DOMAINS = [
  'constructions.cristianvaduva.com',
  'youtube.com',
  'www.youtube.com',
  'googleapis.com',
  'seap.ro',
  'ancpi.ro',
  'mfinante.gov.ro',
  'onrc.ro',
  'bvb.ro'
];

export type RawObservationInput = {
  sourceName: string;
  sourceType: 'OFFICIAL' | 'PUBLIC_REGISTRY' | 'NEWS' | 'COMPANY_DISCLOSURE' | 'FORM_SUBMISSION';
  sourceUrl: string;
  rawPayload: Record<string, any>;
  observedAt?: string;
};

export type ProcessedSourceObservation = {
  isValid: boolean;
  contentHash: string;
  sourceUrl: string;
  sourceName: string;
  sourceType: string;
  retrievedAt: string;
  observedAt: string;
  rawPayload: Record<string, any>;
  rejectionReason?: string;
};

/**
 * Validates source URL for SSRF protection and allowlist alignment
 */
export function validateSourceUrl(urlStr: string): { isValid: boolean; reason?: string } {
  try {
    const url = new URL(urlStr);

    // Reject non-http(s)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { isValid: false, reason: 'Unsupported protocol' };
    }

    const host = url.hostname.toLowerCase();

    // Prevent local/private IP SSRF
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('172.16.')
    ) {
      return { isValid: false, reason: 'Private network destination prohibited (SSRF Guard)' };
    }

    // Domain allowlist check
    const isAllowed = ALLOWED_SOURCE_DOMAINS.some(allowed => host === allowed || host.endsWith('.' + allowed));
    if (!isAllowed) {
      return { isValid: false, reason: `Domain ${host} is not in the explicit source allowlist` };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, reason: 'Malformed URL format' };
  }
}

/**
 * Computes deterministic SHA256 content hash of raw payload for idempotency
 */
export function computeContentHash(payload: Record<string, any>): string {
  const jsonString = JSON.stringify(payload, Object.keys(payload).sort());
  return crypto.createHash('sha256').update(jsonString).digest('hex');
}

/**
 * Ingests raw source payload through security & hashing adapter
 */
export function processRawSourcePayload(input: RawObservationInput): ProcessedSourceObservation {
  const urlCheck = validateSourceUrl(input.sourceUrl);
  if (!urlCheck.isValid) {
    return {
      isValid: false,
      contentHash: '',
      sourceUrl: input.sourceUrl,
      sourceName: input.sourceName,
      sourceType: input.sourceType,
      retrievedAt: new Date().toISOString(),
      observedAt: input.observedAt || new Date().toISOString(),
      rawPayload: input.rawPayload,
      rejectionReason: urlCheck.reason
    };
  }

  const hash = computeContentHash(input.rawPayload);
  const nowIso = new Date().toISOString();

  return {
    isValid: true,
    contentHash: hash,
    sourceUrl: input.sourceUrl,
    sourceName: input.sourceName,
    sourceType: input.sourceType,
    retrievedAt: nowIso,
    observedAt: input.observedAt || nowIso,
    rawPayload: input.rawPayload
  };
}
