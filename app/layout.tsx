import './globals.css';
import { Providers } from './providers';
import { PreloadRoutes } from './preload';

export const metadata = {
  title: "TRF - Textile Recovery Facility",
  description: "Complete textile recovery facility workflow management system",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <PreloadRoutes />
          {children}
        </Providers>
      </body>
    </html>
  );
}