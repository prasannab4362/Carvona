import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Workbench from "@/components/Workbench";
import { EyeOff, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "License Plate Blur - Free AI Privacy Tool | Carvona",
  description: "Automatically blur vehicle license plates to protect privacy. 100% free, unlimited usage, no registration required.",
};

export default function BlurPage() {
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
              License Plate Blur
            </h1>
            <p className="text-sm md:text-base text-text-muted">
              Automatically identify and blur license plates. Free forever, unlimited use, zero login.
            </p>
            
            {/* Quick stats / Features badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-semibold text-green-700">
                <ShieldCheck size={14} /> 100% Secure & Private
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                <Zap size={14} /> Instant AI Processing
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700">
                <EyeOff size={14} /> No Watermarks
              </span>
            </div>
          </div>

          {/* Workbench focused on Blur */}
          <div className="w-full">
            <Workbench defaultTool="blur" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
