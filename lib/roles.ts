export const VALID_ROLES = [
  'developer',
  'general_contractor',
  'construction_company',
  'architect',
  'structural_engineer',
  'engineer',
  'mep',
  'project_manager',
  'supplier',
  'other'
] as const;

export type ValidRole = (typeof VALID_ROLES)[number];
