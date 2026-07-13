import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Award } from "lucide-react";

export const metadata = {
  title: "About Us | Carvona",
  description: "Learn about Carvona, the AI-powered automotive image processing tool. We specialize in instant license plate blurring and high-quality dealership branding.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 md:py-24 bg-gradient-to-b from-white to-section">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-main mb-8">
            About Carvona
          </h1>
          
          <div className="prose prose-slate max-w-none text-text-muted flex flex-col gap-8 text-sm md:text-base leading-relaxed">
            <p>
              Welcome to <strong>Carvona</strong>, an AI-powered automotive image processing platform designed specifically for car dealerships, automotive bloggers, and vehicle privacy protection in India.
            </p>
            
            <p>
              We provide state-of-the-art tools to automatically identify license plates and apply either a clean privacy blur or a custom dealership logo in just seconds. By eliminating manual editing times, we help dealerships prepare their inventory for online listing channels instantly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="p-6 bg-white rounded-2xl border border-border-light shadow-sm flex gap-4">
                <Shield className="text-primary shrink-0 w-8 h-8" />
                <div>
                  <h3 className="font-bold text-text-main text-base">Privacy Shield</h3>
                  <p className="text-xs text-text-muted mt-1">Images are processed dynamically in temporary memory buffers and never permanently stored or shared.</p>
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-2xl border border-border-light shadow-sm flex gap-4">
                <Award className="text-primary shrink-0 w-8 h-8" />
                <div>
                  <h3 className="font-bold text-text-main text-base">Indian Auto Standard</h3>
                  <p className="text-xs text-text-muted mt-1">Our AI is specifically optimized to recognize and mask standard Indian RTO vehicle plate shapes.</p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-text-main mt-4">Our Mission</h2>
            <p>
              Our mission is to democratize advanced computer vision and image processing tools for local businesses. We aim to offer 100% free, high-performance web utilities with zero barriers to entry—meaning no logins, no credit card requirements, and no watermarks on outputs.
            </p>

            <h2 className="text-xl font-bold text-text-main mt-4">Corporate Ownership</h2>
            <p>
              Carvona is owned, maintained, and operated by <strong>Green Automation Solutions (GAS AI)</strong>. We focus on building tailored machine learning workflows and automated tools for businesses in India. You can learn more about our corporate parent at <a href="https://gasai.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">gasai.in</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
