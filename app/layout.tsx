import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { metadataBase:new URL('https://constructions.aixluxury.com'), title:{default:'CONSTRUCTIONS by AiXLuxury',template:'%s | CONSTRUCTIONS by AiXLuxury'}, description:'Discover the developers, construction companies, engineers and projects shaping the built environment.', openGraph:{type:'website',siteName:'CONSTRUCTIONS by AiXLuxury',locale:'en_RO'}, robots:{index:true,follow:true} };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
