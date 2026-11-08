import React from 'react';
import {
  ShieldIcon,
  SearchIcon,
  BriefcaseIcon,
  BookIcon,
  HardHatIcon,
  RulerIcon,
  LandmarkIcon,
  MegaphoneIcon,
  TruckIcon,
  DocumentCheckIcon,
  CreditCardIcon,
  BuildingIcon,
  TargetIcon,
  StarIcon
} from './NavIcons';

interface ServiceIconRendererProps {
  slug?: string;
  id?: string;
  className?: string;
  size?: number;
}

export function ServiceIconRenderer({
  slug = '',
  id = '',
  className = 'w-5 h-5 text-[#C9A227]',
  size = 20
}: ServiceIconRendererProps) {
  const key = (slug || id).toLowerCase();

  switch (key) {
    case 'calitate-constructii':
      return <ShieldIcon className={className} size={size} />;
    case 'controlul-calitatii':
      return <SearchIcon className={className} size={size} />;
    case 'dirigentie-santier':
      return <BriefcaseIcon className={className} size={size} />;
    case 'responsabil-tehnic-executie':
    case 'rte':
      return <BookIcon className={className} size={size} />;
    case 'protectia-muncii':
    case 'ssm':
      return <HardHatIcon className={className} size={size} />;
    case 'proiectare-arhitectura':
      return <RulerIcon className={className} size={size} />;
    case 'autorizare-avize':
      return <LandmarkIcon className={className} size={size} />;
    case 'promovare-imobiliara':
      return <MegaphoneIcon className={className} size={size} />;
    case 'utilaje-echipamente':
      return <TruckIcon className={className} size={size} />;
    case 'asigurari-garantii':
      return <DocumentCheckIcon className={className} size={size} />;
    case 'finantare-credite':
      return <CreditCardIcon className={className} size={size} />;
    case 'dezvoltare-imobiliara':
      return <BuildingIcon className={className} size={size} />;
    case 'achizitii-investitii':
      return <TargetIcon className={className} size={size} />;
    default:
      return <StarIcon className={className} size={size} />;
  }
}
