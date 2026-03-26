import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';


const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Transit Demand Balancer',
  description: 'AI-driven public transportation demand engine UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono bg-background text-foreground h-screen w-screen flex flex-col overflow-hidden">
        {children}
      </body>
    </html>
  );
}
