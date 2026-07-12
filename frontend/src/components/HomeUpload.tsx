"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, EyeOff, Award, ArrowRight, X } from "lucide-react";

const SAMPLE_IMAGES = [
  {
    id: "sports",
    name: "Sports Coupe",
    url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "suv",
    name: "Luxury SUV",
    url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "sedan",
    name: "Electric Sedan",
    url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function HomeUpload() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [isSample, setIsSample] = useState<boolean>(false);
  const [sampleId, setSampleId] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setImageName(file.name);
    setIsSample(false);
    setSampleId("");
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
        setShowModal(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const selectSample = (sample: typeof SAMPLE_IMAGES[0]) => {
    setSelectedImage(sample.url);
    setImageName(`${sample.name.toLowerCase().replace(/\s+/g, "-")}.jpg`);
    setIsSample(true);
    setSampleId(sample.id);
    setShowModal(true);
  };

  const handleChooseMode = (mode: "blur" | "logo") => {
    if (!selectedImage) return;

    // Cache the image, name, and meta in sessionStorage
    sessionStorage.setItem("carvona_pending_image", selectedImage);
    sessionStorage.setItem("carvona_pending_name", imageName);
    sessionStorage.setItem("carvona_pending_type", isSample ? "sample" : "upload");
    if (isSample) {
      sessionStorage.setItem("carvona_pending_sample_id", sampleId);
    }

    // Redirect to the dedicated tool page
    const route = mode === "blur" ? "/blur" : "/logo-replace";
    router.push(route);
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto flex flex-col bg-white rounded-[32px] border border-border-light shadow-[0_24px_64px_-16px_rgba(0,0,0,0.08)] p-6 md:p-8 transition-all duration-300">
        {/* Upload Box */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] transition-all duration-300 cursor-pointer ${
            dragActive
              ? "border-primary bg-primary/[0.04] scale-[1.01]"
              : "border-primary/25 hover:border-primary/60 bg-section/40 hover:bg-primary/[0.005]"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4 text-center pointer-events-none select-none">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 ${
              dragActive ? "bg-primary text-white scale-110" : "bg-primary text-white scale-100 shadow-md"
            }`}>
              <Upload size={22} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col items-center">
              <span className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/25 transition-all duration-200 cursor-pointer">
                Upload Image
              </span>
              <p className="text-xs text-text-muted mt-3.5 font-semibold">
                {dragActive ? "Drop here to upload!" : "or drop a file here"}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-border-light my-6" />

        {/* Samples selection inside the card */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1.5 justify-center uppercase tracking-wider">
            No image? Try one of these:
          </span>
          <div className="grid grid-cols-3 gap-3">
            {SAMPLE_IMAGES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => selectSample(sample)}
                className="group relative h-16 rounded-xl overflow-hidden border border-border-light hover:border-primary transition-all duration-300 flex items-end p-1.5 text-left"
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <span className="relative z-10 text-[9px] font-bold text-white truncate w-full">
                  {sample.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <span className="text-[10px] text-text-muted text-center mt-5 leading-normal">
          By uploading an image, you agree to our Terms of Service.
        </span>
      </div>

      {/* CHOOSE MODE MODAL OVERLAY */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-border-light overflow-hidden z-10 p-6 md:p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center pb-2 border-b border-border-light">
              <div>
                <h3 className="text-lg font-bold text-text-main">Choose Processing Mode</h3>
                <p className="text-xs text-text-muted">Select how you want to mask the license plate</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-text-muted hover:text-text-main hover:bg-black/5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Two Choices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
              {/* Option 1: Blur */}
              <button
                onClick={() => handleChooseMode("blur")}
                className="bg-section hover:bg-primary/[0.02] border border-border-light hover:border-primary rounded-2xl p-6 text-left flex flex-col justify-between h-56 transition-all duration-300 group hover:shadow-lg"
              >
                <div className="flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                    <EyeOff size={20} className="stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-text-main group-hover:text-primary transition-colors">
                      License Plate Blur
                    </h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      Protect buyer privacy by blurring vehicle license plates automatically.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary pt-4 mt-auto">
                  FREE FOREVER <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              {/* Option 2: Logo Replace */}
              <button
                onClick={() => handleChooseMode("logo")}
                className="bg-section hover:bg-primary/[0.02] border border-border-light hover:border-primary rounded-2xl p-6 text-left flex flex-col justify-between h-56 transition-all duration-300 group hover:shadow-lg"
              >
                <div className="flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                    <Award size={20} className="stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-text-main group-hover:text-primary transition-colors">
                      Logo Replacement
                    </h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      Replace plates with your custom dealership logo matched to the plate angle.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary pt-4 mt-auto">
                  PREMIUM TRIAL <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
