import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css'; // Make sure you have this file for global styles

const inter = Inter({ subsets: ['latin'] });

// Metadata for SEO
export const metadata = {
  title: {
    default: 'PD-Blog - My Personal Development Journey',
    template: '%s | PD-Blog', // Used by child pages
  },
  description: 'A blog about personal development, coding, and life lessons.',
};

// Reusable Header Component
function Header() {
  return (
    <header className="main-header">
      <div className="container">
        <Link href="/" className="logo">
          PD-Blog
        </Link>
        <nav>
          {/* You can add more links here later */}
          <Link href="/">Home</Link>
          {/* Example: <Link href="/about">About</Link> */}
        </nav>
      </div>
    </header>
  );
}

// Reusable Footer Component
function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} PD-Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="main-content">
          <div className="container">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
