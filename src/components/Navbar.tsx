"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Car, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Plate Blur", href: "/blur" },
    { name: "Logo Replacement", href: "/logo-replace" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "glass-panel border-b border-border-light shadow-sm py-4"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-primary/10 group-hover:scale-105 transition-transform duration-300">
            <img src="/logo.jpg" alt="Carvona Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-mono text-xl font-bold tracking-tight text-text-main">
            CARVONA<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-all duration-200 relative py-1 ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/blur"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200"
          >
            Start Free
            <ArrowRight size={14} className="stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-text-muted hover:text-text-main hover:bg-black/5 rounded-xl transition-all duration-200"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-panel border-b border-border-light shadow-xl animate-fade-in py-6 px-6 flex flex-col gap-5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className={`text-base font-semibold py-2 transition-all duration-200 ${
                  isActive
                    ? "text-primary pl-2 border-l-2 border-primary"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/blur"
            onClick={handleLinkClick}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl shadow-md transition-all duration-200"
          >
            Start Free
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </nav>
  );
}
