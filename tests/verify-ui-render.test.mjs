import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { DailyAcquisitionQueueView } from '../components/DailyAcquisitionQueueView.tsx';
import { ContactIntelligenceView } from '../components/ContactIntelligenceView.tsx';
import { RevenueCommandCenterView } from '../components/RevenueCommandCenterView.tsx';

test('1. Acquisition Today renders header and all 6 operational sections visibly', () => {
  const queueData = {
    overdue: [],
    callToday: [],
    emailToday: [],
    followUpToday: [],
    meetingToday: [],
    proposalToday: []
  };

  const html = renderToStaticMarkup(
    React.createElement(DailyAcquisitionQueueView, { initialData: queueData })
  );

  assert.match(html, /WHO SHOULD I CONTACT TODAY\?/i);
  assert.match(html, /A\. VERIFY FIRST/);
  assert.match(html, /B\. CALL NOW/);
  assert.match(html, /C\. APPROVAL REQUIRED/);
  assert.match(html, /D\. FOLLOW UP/);
  assert.match(html, /E\. COOLING/);
  assert.match(html, /F\. DO NOT CONTACT/);
});

test('2. Intelligence Coverage renders LEVEL 04 CONTACT ACQUISITION and 12-field grid', () => {
  const contactsData = [
    {
      id: 'c1',
      companyName: 'BOG\'ART SRL',
      primaryContact: 'Bogdan Doicescu',
      role: 'CEO',
      verificationLevel: '03_DOMAIN_VERIFIED',
      contactChannel: 'Domain Switchboard',
      lastVerified: '2026-08-22',
      contactReadiness: 'High',
      coolingPeriod: 'None'
    }
  ];

  const html = renderToStaticMarkup(
    React.createElement(ContactIntelligenceView, { contacts: contactsData })
  );

  assert.match(html, /LEVEL 04 CONTACT ACQUISITION/);
  assert.doesNotMatch(html, /MarketCoverageExecutiveView/i);
  assert.match(html, /Legal Name/i);
  assert.match(html, /CUI\/CIF/i);
  assert.match(html, /DECISION MAKER &amp; ROLE|DECISION MAKER/i);
  assert.match(html, /PHONE &amp; EMAIL STATUS|PHONE STATUS/i);
  assert.match(html, /LAST VERIFIED/i);
  assert.match(html, /PROVENANCE/i);
  assert.match(html, /WHAT IS MISSING/i);
  assert.match(html, /WHY IT MATTERS/i);
  assert.match(html, /DOMINANT NEXT ACTION/i);
});

test('3. Revenue renders CONTACT ACQUISITION FUNNEL with all 10 stages by default', () => {
  const revenueMetrics = {
    totalWonRevenue: 0,
    totalPipelineValue: 145000,
    estimatedDealSize: 250000,
    avgOpportunityScore: 82,
    outreachReadyCount: 3,
    verificationRequiredCount: 14,
    activeConversationsCount: 2,
    proposalsCount: 1,
    wonDealsCount: 0
  };

  const revenueFunnel = {
    discovered: 48,
    qualified: 32,
    outreachReady: 3,
    outreachSent: 4,
    response: 3,
    meeting: 2,
    proposal: 2,
    won: 0
  };

  const html = renderToStaticMarkup(
    React.createElement(RevenueCommandCenterView, {
      metrics: revenueMetrics,
      todayActions: [],
      verificationQueue: [],
      funnel: revenueFunnel
    })
  );

  assert.match(html, /CONTACT ACQUISITION FUNNEL|AUDITABLE CONVERSION PIPELINE/i);
  assert.match(html, /LEVEL 01 · IDENTIFIED ENTITIES/);
  assert.match(html, /LEVEL 02 · PUBLICLY VERIFIED ROLES/);
  assert.match(html, /LEVEL 03 · DOMAIN \/ SWITCHBOARD VERIFIED/);
  assert.match(html, /LEVEL 04 · CONFIRMED DIRECT CHANNEL/);
  assert.match(html, /OUTREACH READY \(PASSED FIREWALL\)/);
  assert.match(html, /OUTREACH SENT \(APPROVED DRAFTS\)/);
  assert.match(html, /RESPONSE CAPTURED/);
  assert.match(html, /MEETING BOOKED/);
  assert.match(html, /PROPOSAL SENT/);
  assert.match(html, /WON CONTRACT \(ATTRIBUTED REVENUE\)/);
});
