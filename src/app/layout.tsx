import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import Animations from './animations';
import Header from '@/components/layout/header';
import { ThemeProvider } from '@/components/jay/ThemeProvider';
import Terminal from '@/components/jay/Terminal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap'
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Jay Raval - CS Engineer & AI Researcher',
  description:
    'Jay Raval. CS Engineer at Ahmedabad University. LLM reasoning, formal methods, complex systems.',
  openGraph: {
    title: 'Jay Raval',
    description: 'CS Engineer · AI Researcher · Builder',
    type: 'website'
  }
};

const themeInitScript = `
  (function() {
    try {
      var t = localStorage.getItem('jr-theme') || 'dark';
      document.documentElement.setAttribute('data-theme', t);
    } catch(e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="overflow-x-hidden bg-[var(--bg)] font-body text-[var(--fg)] antialiased">
        <ThemeProvider>
          <Animations>
            <Header />
            {children}
            <Terminal />
          </Animations>
        </ThemeProvider>
      </body>
    </html>
  );
}
