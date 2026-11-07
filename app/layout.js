import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import './globals.css';

export const metadata = {
  title: 'Md. Shahedur Rahman (Shohagh) | International Sales & Client Success',
  description:
    'International sales professional: client communication, requirement scoping, proposals and deal closing, supported by n8n automation and video content.',
  openGraph: {
    title: 'Md. Shahedur Rahman (Shohagh) | International Sales & Client Success',
    description: 'Client communication, proposals and deal closing, supported by n8n automation and video content.',
    type: 'website',
  },
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
