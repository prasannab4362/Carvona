"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <head>
        <title>Contact Us | Carvona</title>
        <meta name="description" content="Get in touch with the Carvona support team for API access, bug reports, custom logo requests, or corporate opportunities." />
      </head>
      <Navbar />
      <main className="flex-1 py-16 md:py-24 bg-gradient-to-b from-white to-section">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-main mb-8">
            Contact Us
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mt-6">
            {/* Contact details */}
            <div className="md:col-span-2 flex flex-col gap-8 text-text-muted">
              <p className="text-sm md:text-base leading-relaxed">
                Have questions about our AI plate detection tool, feature suggestions, or business inquiries? Reach out directly and our support team will respond within 24-48 business hours.
              </p>
              
              <div className="flex flex-col gap-6 text-sm">
                <div className="flex gap-4 items-start">
                  <Mail className="text-primary shrink-0 w-5 h-5 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-text-main">Email Support</h4>
                    <a href="mailto:edadmin@gasai.in" className="text-primary hover:underline mt-1 block">
                      edadmin@gasai.in
                    </a>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <Globe className="text-primary shrink-0 w-5 h-5 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-text-main">Corporate Head</h4>
                    <p className="mt-1">Green Automation Solutions (GAS AI)</p>
                    <a href="https://gasai.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-0.5 block">
                      gasai.in
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <MapPin className="text-primary shrink-0 w-5 h-5 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-text-main">Office Address</h4>
                    <p className="mt-1 leading-relaxed">
                      Green Automation Solutions,<br />
                      Chennai, Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Contact Form Mock */}
            <div className="md:col-span-3 bg-white p-6 md:p-8 rounded-3xl border border-border-light shadow-sm">
              <h3 className="text-lg font-bold text-text-main mb-6">Send a Message</h3>
              <form className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-semibold text-text-muted">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your Name"
                      className="px-4 py-2 text-sm border border-border-light rounded-xl focus:border-primary outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-text-muted">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className="px-4 py-2 text-sm border border-border-light rounded-xl focus:border-primary outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-xs font-semibold text-text-muted">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="Feedback / Inquiry"
                    className="px-4 py-2 text-sm border border-border-light rounded-xl focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-semibold text-text-muted">Message Details</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Describe your request..."
                    className="px-4 py-3 text-sm border border-border-light rounded-xl focus:border-primary outline-none transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  onClick={(e) => e.preventDefault()}
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-md transition-all mt-2"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
