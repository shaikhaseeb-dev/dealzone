import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'DealZone — Best Deals on Trending Products',
    template: '%s | DealZone',
  },
  description: 'Discover the best deals on electronics, fashion, kitchen, and more. Hand-picked products with verified discounts.',
  keywords: ['deals', 'affiliate', 'discount', 'electronics', 'fashion', 'amazon', 'flipkart'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'DealZone',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#161616',
                color: '#f5f5f5',
                border: '1px solid #262626',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
