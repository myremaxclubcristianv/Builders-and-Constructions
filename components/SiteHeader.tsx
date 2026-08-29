import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="nav shell">
      <Link className="brand" href="/">
        CONSTRUCTIONS<small>by AiXLuxury</small>
      </Link>
      <nav className="navlinks" aria-label="Primary navigation">
        <Link href="/companies">Developers</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/pipeline">Pipeline</Link>
        <Link href="/cities">Cities</Link>
        <Link href="/rankings">Rankings</Link>
        <Link href="/map">Map</Link>
        <Link href="/contractors">Contractors</Link>
        <Link href="/architects">Architects</Link>
        <Link href="/search" style={{ color: '#c7a675', fontWeight: 600 }}>🔍 Search</Link>
        <Link className="nav-cta" href="/promote">Promote Entity</Link>
      </nav>
      <Link className="mobile-menu" href="/search" aria-label="Search the platform">
        Search
      </Link>
    </header>
  );
}
