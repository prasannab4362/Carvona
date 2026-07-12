import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeUpload from "@/components/HomeUpload";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import { EyeOff, Award, Cpu, Layers, RefreshCw, Sparkles, Check, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section & Studio */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
        {/* Soft background grid & gradient blobs */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />
        
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          {/* Left Column: Hero text & metrics */}
          <div className="text-left flex flex-col gap-6 max-w-xl">
            <div className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-wider">
                Automotive AI Image Editor
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-main leading-tight md:leading-[1.1]">
              Blur or Brand <br />
              License Plates <br />
              in <span className="text-primary">Seconds</span>
            </h1>
            
            <p className="text-base md:text-lg text-text-muted leading-relaxed">
              Automatically detect vehicle license plates using AI. Blur them instantly for free or replace them with your custom dealership branding.
            </p>

            {/* Quick trust metrics */}
            <div className="flex flex-wrap gap-3 text-xs font-semibold text-text-muted mt-2">
              <span className="flex items-center gap-1.5 bg-section px-3 py-1.5 rounded-xl border border-border-light">
                ⚡ 5s Auto-processing
              </span>
              <span className="flex items-center gap-1.5 bg-section px-3 py-1.5 rounded-xl border border-border-light">
                🛡️ 100% Secure & Private
              </span>
              <span className="flex items-center gap-1.5 bg-section px-3 py-1.5 rounded-xl border border-border-light">
                🔥 Free Blur Option
              </span>
            </div>
          </div>

          {/* Right Column: The Remove.bg style Upload Box */}
          <div className="w-full flex justify-center lg:justify-end">
            <HomeUpload />
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-24 bg-section border-y border-border-light" id="features">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col gap-16">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-text-main">
              Simple. Fast. Professional.
            </h2>
            <p className="text-text-muted text-sm md:text-base">
              Choose the processing mode that fits your dealership needs. No subscription required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl border border-border-light p-8 flex flex-col justify-between hover:shadow-xl hover:border-primary/30 transition-all duration-300 group">
              <div className="flex flex-col gap-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <EyeOff size={22} className="stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-main">License Plate Blur</h3>
                  <p className="text-sm text-text-muted mt-2 leading-relaxed">
                    Protect buyer privacy instantly. Our AI automatically scans the vehicle image, identifies the plate, and applies a high-quality blur or solid color mask.
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-light">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 bg-section rounded-full text-text-main border border-border-light">
                  FREE FOREVER
                </span>
                <Link href="/blur" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                  Try Blur Tool →
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl border border-border-light p-8 flex flex-col justify-between hover:shadow-xl hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-amber-950 text-[10px] font-mono font-bold px-4 py-1 rounded-bl-2xl">
                PREMIUM
              </div>
              <div className="flex flex-col gap-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Award size={22} className="stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-main">Logo Replacement</h3>
                  <p className="text-sm text-text-muted mt-2 leading-relaxed">
                    Elevate dealership branding. Replace plates with custom logos using perspective correction, skew adjustments, and scale matching for a seamless professional look.
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-light">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20">
                  ₹2 per image
                </span>
                <Link href="/logo-replace" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                  Try Logo Replacement →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col gap-16">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-text-main">
              How It Works
            </h2>
            <p className="text-text-muted text-sm md:text-base">
              Four simple steps to professional vehicle photos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto w-full">
            {[
              {
                step: "01",
                title: "Upload Photo",
                desc: "Drag and drop your high-resolution vehicle photos into our editor.",
                icon: Layers,
              },
              {
                step: "02",
                title: "AI Detection",
                desc: "Our neural network precisely identifies the location of the license plate.",
                icon: Cpu,
              },
              {
                step: "03",
                title: "Choose Mode",
                desc: "Toggle between privacy blurring or applying your custom brand logo.",
                icon: RefreshCw,
              },
              {
                step: "04",
                title: "Download",
                desc: "Export clean, high-resolution, watermark-free images instantly.",
                icon: Sparkles,
              },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="bg-section rounded-3xl border border-border-light p-6 flex flex-col gap-4 relative">
                  <span className="text-4xl font-extrabold text-primary/20 font-mono absolute top-4 right-6">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white border border-border-light flex items-center justify-center text-primary shadow-sm">
                    <IconComp size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main">{item.title}</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before / After Slider Comparison */}
      <section className="py-24 bg-section border-y border-border-light">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <BeforeAfterSlider />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col gap-16">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-text-main">
              Simple, Transparent Pricing
            </h2>
            <p className="text-text-muted text-sm md:text-base">
              No subscription contracts. No hidden fees. Pay only for what you download.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
            {/* Free Tier */}
            <div className="bg-white rounded-3xl border border-border-light p-8 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-text-main">Free Tier</h3>
                <p className="text-sm text-text-muted mt-2">Essential privacy protection</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-text-main">₹0</span>
                  <span className="text-sm text-text-muted">/ forever</span>
                </div>
                
                <ul className="mt-8 flex flex-col gap-4 text-sm text-text-muted">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>Unlimited License Plate Blur</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>Multiple Blur styles (Pixel/Smooth/Color)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>No registration or account required</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/blur"
                className="w-full mt-10 py-3 bg-section hover:bg-border-light text-text-main font-semibold rounded-xl text-center transition-colors"
              >
                Start Blurring
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-primary rounded-3xl p-8 flex flex-col justify-between text-white shadow-xl shadow-primary/10 relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <h3 className="text-xl font-bold">Pro Tier</h3>
                <p className="text-sm text-white/80 mt-2">Branding and dealership listing design</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">₹2</span>
                  <span className="text-sm text-white/80">/ processed image</span>
                </div>

                <ul className="mt-8 flex flex-col gap-4 text-sm text-white/90">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-secondary shrink-0" />
                    <span>Perspective alignment and skew controls</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-secondary shrink-0" />
                    <span>High resolution watermark-free exports</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-secondary shrink-0" />
                    <span>Custom logo uploads (PNG/SVG)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-secondary shrink-0" />
                    <span>One free trial replacement per browser</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/logo-replace"
                className="w-full mt-10 py-3 bg-white hover:bg-white/90 text-primary font-bold rounded-xl text-center shadow-lg transition-colors"
              >
                Brand Vehicle Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-section border-t border-border-light" id="faq">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FAQ />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="bg-primary rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl shadow-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_40%)] pointer-events-none" />
            <div className="flex flex-col gap-4 text-center md:text-left max-w-xl relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Ready to prepare professional vehicle photos?
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                Try the AI License Plate Blur tool completely free, or brand your vehicle listings with dealership logos instantly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto shrink-0">
              <Link
                href="/blur"
                className="px-6 py-3.5 bg-white hover:bg-white/90 text-primary font-bold rounded-xl text-center shadow-md transition-colors"
              >
                Blur License Plate
              </Link>
              <Link
                href="/logo-replace"
                className="px-6 py-3.5 bg-primary-hover hover:bg-primary-hover/80 text-white font-bold rounded-xl border border-white/20 text-center transition-colors"
              >
                Replace with Logo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
