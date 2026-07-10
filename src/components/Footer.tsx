import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border-light bg-section py-12 md:py-20 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow">
              <img src="/logo.jpg" alt="Carvona Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-mono text-lg font-bold tracking-tight text-text-main">
              CARVONA
            </span>
          </Link>
          <p className="text-sm text-text-muted max-w-sm">
            AI-powered automotive image processing. Blur license plates for free or brand them with your custom dealership logo instantly.
          </p>
          <p className="text-xs text-text-muted mt-2">
            © {currentYear} CARVONA AI. All rights reserved.
          </p>
        </div>

        {/* Product links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-main">
            Product
          </h4>
          <ul className="flex flex-col gap-2 text-sm text-text-muted">
            <li>
              <Link href="/blur" className="hover:text-primary transition-colors">
                License Plate Blur
              </Link>
            </li>
            <li>
              <Link href="/logo-replace" className="hover:text-primary transition-colors">
                Logo Replacement
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-main">
            Legal
          </h4>
          <ul className="flex flex-col gap-2 text-sm text-text-muted">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
