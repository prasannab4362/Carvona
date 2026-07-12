import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Workbench from "@/components/Workbench";
import { Award, Zap, Layers } from "lucide-react";

export const metadata = {
  title: "License Plate Logo Replacement - Dealership Branding | Carvona",
  description: "Brand your vehicle inventory with custom logos. High-quality perspective-corrected logo placement. 100% free and unlimited, no registration required.",
};

export default function LogoReplacePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col gap-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-main">
              Logo Replacement
            </h1>
            <p className="text-sm md:text-base text-text-muted">
              Brand your vehicle photos with your dealership logo. AI matches perspective, skew, and size for an integrated professional design.
            </p>
            
            {/* Quick stats / Features badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700">
                <Award size={14} /> Professional Dealership Look
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                <Zap size={14} /> AI Angle Matching
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700">
                <Layers size={14} /> Custom PNG/SVG Upload
              </span>
            </div>
          </div>

          {/* Workbench focused on Logo Replacement */}
          <div className="w-full">
            <Workbench defaultTool="logo" hideTabs={true} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
