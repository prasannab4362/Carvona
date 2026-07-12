import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | Carvona",
  description: "Read our privacy policy to understand how we protect your data. Carvona processes all image transformations securely.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-main mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-slate max-w-none text-text-muted flex flex-col gap-6 text-sm md:text-base leading-relaxed">
            <p><strong>Last Updated: July 2026</strong></p>
            
            <p>
              At Carvona, accessible from carvona.vercel.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Carvona and how we use it.
            </p>

            <h2 className="text-xl font-bold text-text-main mt-4">1. Data Processing and Image Uploads</h2>
            <p>
              Carvona is built to process vehicle images to blur license plates and apply brand logos.
              All core image analysis is processed using secure cloud APIs and temporary memory buffers. We do not store, retain, or share your uploaded images. Once your download is complete or you close the browser tab, the temporary image cache is permanently deleted.
            </p>

            <h2 className="text-xl font-bold text-text-main mt-4">2. Cookies and Web Beacons</h2>
            <p>
              Like any other website, Carvona uses cookies to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
            </p>

            <h2 className="text-xl font-bold text-text-main mt-4">3. Google DoubleClick DART Cookie</h2>
            <p>
              Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.
            </p>

            <h2 className="text-xl font-bold text-text-main mt-4">4. Advertising Partners Privacy Policies</h2>
            <p>
              Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Carvona, which are sent directly to users&apos; browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
            </p>

            <h2 className="text-xl font-bold text-text-main mt-4">5. Third Party Privacy Policies</h2>
            <p>
              Carvona&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
            </p>

            <h2 className="text-xl font-bold text-text-main mt-4">6. Consent</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
