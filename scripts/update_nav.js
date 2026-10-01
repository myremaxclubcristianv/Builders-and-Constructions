const fs = require('fs');
const path = require('path');

// Update SiteHeader.tsx with comprehensive knowledge links
let header = fs.readFileSync(path.join(__dirname, '../components/SiteHeader.tsx'), 'utf-8');

// In Desktop Mega Menu knowledge dropdown:
const desktopKnowledgeLinks = `                    <div className="space-y-1 text-xs">
                      <Link
                        href="/knowledge"
                        className="block p-2 hover:bg-[#151515] rounded text-white hover:text-[#C9A227] transition-colors font-bold flex items-center justify-between"
                      >
                        <span>Knowledge Hub Overview</span>
                        <span className="text-[10px] font-mono text-[#C9A227]">INDEX</span>
                      </Link>
                      <Link
                        href="/knowledge/materials"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Materials & Products Catalog</span>
                        <span className="text-[10px] font-mono text-[#888888]">12 FAMILIES</span>
                      </Link>
                      <Link
                        href="/knowledge/concrete"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Concrete & Cement Intelligence</span>
                        <span className="text-[10px] font-mono text-[#10B981]">SR EN 206</span>
                      </Link>
                      <Link
                        href="/knowledge/systems"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Structural Systems & P100-1</span>
                        <span className="text-[10px] font-mono text-[#888888]">SEISMIC</span>
                      </Link>
                      <Link
                        href="/knowledge/infrastructure"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Civil Infrastructure & Roads</span>
                        <span className="text-[10px] font-mono text-[#888888]">HIGHWAYS</span>
                      </Link>
                      <Link
                        href="/knowledge/engineering"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Building Physics & Fire</span>
                        <span className="text-[10px] font-mono text-[#888888]">PHYSICS</span>
                      </Link>
                      <Link
                        href="/knowledge/processes"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>15-Stage Execution Guide</span>
                        <span className="text-[10px] font-mono text-[#888888]">PVLA</span>
                      </Link>
                      <Link
                        href="/knowledge/standards"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Eurocodes & CPR 2024</span>
                        <span className="text-[10px] font-mono text-[#888888]">REGISTRY</span>
                      </Link>
                      <Link
                        href="/knowledge/glossary"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Technical Glossary (POT, CUT)</span>
                        <span className="text-[10px] font-mono text-[#888888]">TERMS</span>
                      </Link>
                      <Link
                        href="/knowledge/compare"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between border-t border-[#1A1D1B] pt-2"
                      >
                        <span>Material Comparison Matrix</span>
                        <span className="text-[10px] font-mono text-[#C9A227]">MATRIX</span>
                      </Link>
                    </div>`;

// Replace desktop knowledge block
header = header.replace(
  /<span className="text-\[10px\] font-mono uppercase tracking-widest text-\[#C9A227\] block mb-2">\s*TECHNICAL KNOWLEDGE & MATERIALS\s*<\/span>\s*<div className="space-y-1 text-xs">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*<\/div>/,
  `<span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-2">\n                      TECHNICAL KNOWLEDGE & MATERIALS\n                    </span>\n${desktopKnowledgeLinks}\n                  </div>\n                </div>\n              )}\n            </div>`
);

// In Mobile Drawer:
const mobileKnowledgeLinks = `                <div className="space-y-1.5">
                  <Link
                    href="/knowledge"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0E0F0E] border border-[#C9A227]/40 rounded-xl text-xs font-bold text-[#C9A227] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Knowledge Hub Main</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/knowledge/materials"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Materials Catalog (12 Families)</span>
                    <span className="text-[10px] font-mono text-[#888888]">SPECS</span>
                  </Link>
                  <Link
                    href="/knowledge/concrete"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Concrete & Cement Intelligence</span>
                    <span className="text-[10px] font-mono text-[#10B981]">SR EN 206</span>
                  </Link>
                  <Link
                    href="/knowledge/systems"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Structural Systems & P100-1</span>
                    <span className="text-[10px] font-mono text-[#888888]">SEISMIC</span>
                  </Link>
                  <Link
                    href="/knowledge/infrastructure"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Civil Infrastructure & Roads</span>
                    <span className="text-[10px] font-mono text-[#888888]">HIGHWAYS</span>
                  </Link>
                  <Link
                    href="/knowledge/engineering"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Building Physics & Fire Safety</span>
                    <span className="text-[10px] font-mono text-[#888888]">PHYSICS</span>
                  </Link>
                  <Link
                    href="/knowledge/processes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>15-Stage Execution Lifecycle</span>
                    <span className="text-[10px] font-mono text-[#888888]">PVLA</span>
                  </Link>
                  <Link
                    href="/knowledge/standards"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Eurocodes (EN 1990-1999) & CPR</span>
                    <span className="text-[10px] font-mono text-[#888888]">NORMS</span>
                  </Link>
                  <Link
                    href="/knowledge/glossary"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Glossary (POT, CUT, U-value)</span>
                    <span className="text-[10px] font-mono text-[#888888]">TERMS</span>
                  </Link>
                  <Link
                    href="/knowledge/compare"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Material Comparison Matrix</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">MATRIX</span>
                  </Link>
                </div>`;

header = header.replace(
  /<h4 className="text-\[10px\] font-mono uppercase tracking-widest text-\[#C9A227\]">\s*CONSTRUCTION KNOWLEDGE BASE\s*<\/h4>\s*<span className="text-\[9px\] font-mono bg-\[#C9A227\]\/20 text-\[#C9A227\] px-1\.5 py-0\.5 rounded">\s*EXPANDED\s*<\/span>\s*<\/div>\s*<div className="space-y-1\.5">[\s\S]*?<\/div>\s*<\/div>/,
  `<h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">\n                    CONSTRUCTION KNOWLEDGE BASE\n                  </h4>\n                  <span className="text-[9px] font-mono bg-[#C9A227]/20 text-[#C9A227] px-1.5 py-0.5 rounded">\n                    EXPANDED\n                  </span>\n                </div>\n${mobileKnowledgeLinks}\n              </div>`
);

fs.writeFileSync(path.join(__dirname, '../components/SiteHeader.tsx'), header);

// Update SiteFooter.tsx
let footer = fs.readFileSync(path.join(__dirname, '../components/SiteFooter.tsx'), 'utf-8');
const footerKnowledgeLinks = `            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Knowledge & Materials</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/knowledge" className="hover:text-white transition-colors font-semibold text-white">Knowledge Hub</Link></li>
              <li><Link href="/knowledge/materials" className="hover:text-white transition-colors">Materials & Products</Link></li>
              <li><Link href="/knowledge/concrete" className="hover:text-white transition-colors">Concrete & Cement Matrix</Link></li>
              <li><Link href="/knowledge/systems" className="hover:text-white transition-colors">Structural Systems & P100-1</Link></li>
              <li><Link href="/knowledge/infrastructure" className="hover:text-white transition-colors">Civil Infrastructure</Link></li>
              <li><Link href="/knowledge/engineering" className="hover:text-white transition-colors">Building Physics & Fire</Link></li>
              <li><Link href="/knowledge/standards" className="hover:text-white transition-colors">Eurocodes & CPR 2024</Link></li>
              <li><Link href="/knowledge/glossary" className="hover:text-white transition-colors">Construction Glossary</Link></li>
              <li><Link href="/knowledge/sources" className="hover:text-white transition-colors">Official Sources Registry</Link></li>
            </ul>`;

footer = footer.replace(
  /<h4 className="text-\[10px\] font-mono uppercase tracking-widest text-\[#C9A227\] mb-4">Knowledge & Materials<\/h4>\s*<ul className="space-y-2 text-xs">[\s\S]*?<\/ul>/,
  footerKnowledgeLinks
);

fs.writeFileSync(path.join(__dirname, '../components/SiteFooter.tsx'), footer);
console.log("Updated SiteHeader and SiteFooter navigation links!");
