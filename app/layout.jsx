import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'PD-Blog - My Personal Development Journey',
    template: '%s | PD-Blog',
  },
  description: 'A blog about personal development, coding, and life lessons.',
};

function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
          PD-Blog
        </Link>

        <nav aria-label="Main Navigation" className="space-x-6 text-gray-700">
          <Link
            href="/"
            className="hover:text-blue-600 font-medium transition-colors">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-100 mt-12 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-semibold">PD-Blog</span>. All rights reserved.
        </p>
        <p className="mt-1">Built with ❤️ using Next.js and Sanity.io</p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-gray-50 text-gray-800 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          <div className="max-w-6xl mx-auto px-4 py-10">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
