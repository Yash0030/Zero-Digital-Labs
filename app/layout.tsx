import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Personal Health Record Organizer — Synthetic Labs', description: 'Synthetic lab portal demo for a hackathon.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}<footer>Synthetic demo data - not a real medical service</footer></body></html>; }
