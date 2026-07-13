import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | Carvona",
  description: "Read our terms of service. Understand the guidelines and usage agreements for using Carvona.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-main mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-slate max-w-none text-text-muted flex flex-col gap-6 text-sm md:text-base leading-relaxed">
            <p><strong>Last Updated: July 2026</strong></p>
            
            <h2 className="text-xl font-bold text-text-main mt-4">1. Agreement to Terms</h2>
            <p>
              By accessing our website at carvona.in, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>

            <h2 className="text-xl font-bold text-text-main mt-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily use the image processing tools on Carvona for personal or commercial automotive vehicle photo editing. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Use the website features for any unlawful or unauthorized vehicle identification modifications;</li>
              <li>Attempt to decompile, reverse engineer, or hack any backend models or scripts;</li>
              <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server without consent.</li>
            </ul>

            <h2 className="text-xl font-bold text-text-main mt-4">3. Disclaimer</h2>
            <p>
              The materials on Carvona are provided on an &apos;as is&apos; basis. Carvona makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 className="text-xl font-bold text-text-main mt-4">4. Limitations</h2>
            <p>
              In no event shall Carvona or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Carvona, even if Carvona authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h2 className="text-xl font-bold text-text-main mt-4">5. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
