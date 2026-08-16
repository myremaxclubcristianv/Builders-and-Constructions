import Link from 'next/link';

export function SiteFooter(){
  return (
    <footer className="footer shell">
      <div className="rule"/>
      <div className="footergrid" style={{paddingTop:35}}>
        <div>
          <div className="brand">CONSTRUCTIONS<small>by AiXLuxury</small></div>
          <p style={{fontSize:13,lineHeight:1.6,maxWidth:290}}>
            A premium institutional platform documenting the companies, projects and people shaping the built environment.
          </p>
        </div>
        <div>
          <h4>Discover</h4>
          <Link href="/companies">Companies</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/industry">Industry</Link>
          <Link href="/search">Global Search</Link>
        </div>
        <div>
          <h4>For Business</h4>
          <Link href="/promote-company">Promote Your Company</Link>
          <Link href="/promote-project">Promote A Project</Link>
          <Link href="/work-with-us">Work With A Company</Link>
        </div>
        <div>
          <h4>AiXLuxury</h4>
          <a href="https://aixluxury.com" target="_blank" rel="noreferrer">aixluxury.com ↗</a>
          <span style={{fontSize:11,color:'#777'}}>Bucharest, Romania</span>
        </div>
      </div>
    </footer>
  );
}
