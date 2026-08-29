'use client';

import React, { useState, useEffect } from 'react';

export interface DossierNavTab {
  id: string;
  label: string;
}

export function DossierNav({ tabs }: { tabs: DossierNavTab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (const tab of tabs) {
        const el = document.getElementById(tab.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(tab.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tabs]);

  const scrollToTab = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'rgba(12, 14, 12, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #262927',
        borderTop: '1px solid #1a1e1c',
        padding: '0 16px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none'
      }}
    >
      <div
        className="shell"
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          height: 48,
          margin: '0 auto',
          padding: 0
        }}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => scrollToTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? '#c7a675' : '#888880',
                borderBottom: isActive ? '2px solid #c7a675' : '2px solid transparent',
                height: '100%',
                fontWeight: isActive ? 800 : 600,
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                padding: '0 4px',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
