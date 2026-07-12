"use client";

import React, { useState, useRef, useEffect, useCallback, MouseEvent as ReactMouseEvent } from "react";
import { Upload, Sliders, RefreshCw, Download, Image as ImageIcon, Check, Info } from "lucide-react";
import PaymentModal from "./PaymentModal";

// Pre-defined sample images with high quality and pre-configured plate coordinates
const SAMPLE_IMAGES = [
  {
    id: "hatchback",
    name: "Indian Hatchback",
    url: "/sample-hatchback.png",
    keypoints: [
      { x: 0.4114, y: 0.744 },
      { x: 0.6012, y: 0.7399 },
      { x: 0.6006, y: 0.8124 },
      { x: 0.4103, y: 0.819 },
    ],
  },
  {
    id: "suv",
    name: "Indian SUV",
    url: "/sample-suv.png",
    keypoints: [
      { x: 0.4187, y: 0.7701 },
      { x: 0.5975, y: 0.7713 },
      { x: 0.5949, y: 0.8358 },
      { x: 0.4156, y: 0.8369 },
    ],
  },
  {
    id: "sedan",
    name: "Indian Sedan",
    url: "/sample-sedan.png",
    keypoints: [
      { x: 0.4115, y: 0.7337 },
      { x: 0.5978, y: 0.7323 },
      { x: 0.5983, y: 0.8015 },
      { x: 0.4113, y: 0.8053 },
    ],
  },
];

interface Point {
  x: number; // normalized (0 to 1)
  y: number; // normalized (0 to 1)
}

const dataURLtoBlob = (dataurl: string): Blob => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export default function Workbench({ defaultTool = "blur", hideTabs = false }: { defaultTool?: "blur" | "logo"; hideTabs?: boolean }) {
  const [image, setImage] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [selectedTool, setSelectedTool] = useState<"blur" | "logo">(defaultTool);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  
  // 4 corner keypoints (normalized 0 to 1)
  // Order: 0: TL, 1: TR, 2: BR, 3: BL
  const [keypoints, setKeypoints] = useState<Point[]>([
    { x: 0.40, y: 0.46 },
    { x: 0.60, y: 0.46 },
    { x: 0.60, y: 0.54 },
    { x: 0.40, y: 0.54 },
  ]);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  // Blur settings
  const [blurIntensity, setBlurIntensity] = useState<number>(10);
  const [blurStyle, setBlurStyle] = useState<"pixel" | "smooth" | "solid">("pixel");
  const [solidColor, setSolidColor] = useState<string>("#FFFFFF");

  // Logo settings
  const [selectedLogo, setSelectedLogo] = useState<"carvona" | "custom">("carvona");
  const [customLogoFile, setCustomLogoFile] = useState<File | null>(null);
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState<number>(100);
  const [logoRotate, setLogoRotate] = useState<number>(0);
  const [logoSkewX, setLogoSkewX] = useState<number>(0);
  const [logoSkewY, setLogoSkewY] = useState<number>(0);

  // Trial / Payment States
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [trialUsed, setTrialUsed] = useState<boolean>(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [showComparison, setShowComparison] = useState<boolean>(true);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number } | null>(null);

  const selectSample = useCallback(async (sample: typeof SAMPLE_IMAGES[0]) => {
    if (processedImage) {
      window.URL.revokeObjectURL(processedImage);
      setProcessedImage(null);
    }
    setShowComparison(true);
    setScanning(true);
    setScanProgress(0);
    setImage(sample.url);
    setImageName(`${sample.name.toLowerCase().replace(/\s+/g, "-")}.jpg`);
    setDetectionError(null);

    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `${sample.name.toLowerCase().replace(/\s+/g, "-")}.jpg`, { type: "image/jpeg" });
      setRawFile(file);
    } catch (err) {
      console.error("Failed to load sample image file:", err);
    }
    
    // Simulate smart detection scanning
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setKeypoints(sample.keypoints);
          return 100;
        }
        return prev + 5;
      });
    }, 45);
  }, [processedImage]);

  // Check for pending image transferred from the homepage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        setTrialUsed(localStorage.getItem("carvona_trial_used") === "true");
      }, 0);
    }
    const pendingImage = sessionStorage.getItem("carvona_pending_image");
    const pendingName = sessionStorage.getItem("carvona_pending_name") || "uploaded-image.jpg";
    const pendingType = sessionStorage.getItem("carvona_pending_type");
    const pendingSampleId = sessionStorage.getItem("carvona_pending_sample_id");

    if (pendingImage) {
      // Clear cache immediately
      sessionStorage.removeItem("carvona_pending_image");
      sessionStorage.removeItem("carvona_pending_name");
      sessionStorage.removeItem("carvona_pending_type");
      sessionStorage.removeItem("carvona_pending_sample_id");

      if (pendingType === "sample" && pendingSampleId) {
        const sample = SAMPLE_IMAGES.find((s) => s.id === pendingSampleId);
        if (sample) {
          setTimeout(() => {
            selectSample(sample);
          }, 0);
          return;
        }
      }

      // User upload
      setTimeout(() => {
        setImage(pendingImage);
        setImageName(pendingName);
        setScanning(true);
        setScanProgress(20);
        setDetectionError(null);

        try {
          const blob = dataURLtoBlob(pendingImage);
          const file = new File([blob], pendingName, { type: blob.type });
          setRawFile(file);

          const formData = new FormData();
          formData.append("file", file);

          fetch("/api/detect", {
            method: "POST",
            body: formData,
          })
            .then((res) => {
              setScanProgress(75);
              if (!res.ok) throw new Error("API failed");
              return res.json();
            })
            .then((data) => {
              setScanProgress(100);
              if (data.success && data.keypoints) {
                setKeypoints(data.keypoints);
              } else {
                setKeypoints([
                  { x: 0.40, y: 0.46 },
                  { x: 0.60, y: 0.46 },
                  { x: 0.60, y: 0.54 },
                  { x: 0.40, y: 0.54 },
                ]);
                setDetectionError("License plate not automatically detected. Adjust corners manually.");
              }
            })
            .catch(() => {
              setKeypoints([
                { x: 0.40, y: 0.46 },
                { x: 0.60, y: 0.46 },
                { x: 0.60, y: 0.54 },
                { x: 0.40, y: 0.54 },
              ]);
              setDetectionError("Unable to connect to AI server. Adjust coordinates manually.");
            })
            .finally(() => {
              setScanning(false);
            });
        } catch (err) {
          console.error(err);
          setScanning(false);
          setDetectionError("Error processing transferred photo.");
        }
      }, 0);
    }
  }, [selectSample]);

  const updateDimensions = () => {
    if (imgRef.current) {
      setImgDimensions({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Update dimensions whenever image URL or keypoints update to keep overlay in sync
  useEffect(() => {
    updateDimensions();
  }, [image, keypoints]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file: File) => {
    if (processedImage) {
      window.URL.revokeObjectURL(processedImage);
      setProcessedImage(null);
    }
    setShowComparison(true);
    setScanning(true);
    setScanProgress(10);
    setImageName(file.name);
    setRawFile(file);
    setDetectionError(null);

    // Read and preview locally first
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Call FastAPI detect endpoint
    const formData = new FormData();
    formData.append("file", file);

    try {
      setScanProgress(30);
      const response = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });
      setScanProgress(70);

      if (!response.ok) {
        throw new Error("Plate detection failed");
      }

      const data = await response.json();
      setScanProgress(100);

      if (data.success && data.keypoints) {
        setKeypoints(data.keypoints);
      } else {
        // Fallback to default centered keypoints if AI detects no plate
        setKeypoints([
          { x: 0.40, y: 0.46 },
          { x: 0.60, y: 0.46 },
          { x: 0.60, y: 0.54 },
          { x: 0.40, y: 0.54 },
        ]);
        setDetectionError("License plate not automatically detected. Drag the corners to adjust manually.");
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setKeypoints([
        { x: 0.40, y: 0.46 },
        { x: 0.60, y: 0.46 },
        { x: 0.60, y: 0.54 },
        { x: 0.40, y: 0.54 },
      ]);
      setDetectionError("Unable to connect to AI server. Adjust coordinates manually.");
    } finally {
      setScanning(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCustomLogoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCustomLogoUrl(event.target.result as string);
        setSelectedLogo("custom");
      }
    };
    reader.readAsDataURL(file);
  };

  // 4-point drag event handlers
  const handleHandleMouseDown = (e: ReactMouseEvent, idx: number) => {
    e.stopPropagation();
    e.preventDefault();
    setDraggingIdx(idx);
  };

  const handleContainerMouseMove = (e: ReactMouseEvent) => {
    if (draggingIdx === null) return;
    if (!containerRef.current || !imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Constrain coordinates to [0, 1] bounds
    const constrainedX = Math.max(0, Math.min(1, x));
    const constrainedY = Math.max(0, Math.min(1, y));

    setKeypoints((prev) => {
      const next = [...prev];
      next[draggingIdx] = { x: constrainedX, y: constrainedY };
      return next;
    });
  };

  const handleMouseUp = () => {
    setDraggingIdx(null);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [draggingIdx]);

  // Request high-res perspective warped output from FastAPI
  const processImageRequest = useCallback(async (): Promise<Blob | null> => {
    if (!image) return null;

    const formData = new FormData();
    
    // Add base image file
    if (rawFile) {
      formData.append("file", rawFile);
    } else {
      // If it's a sample URL, fetch it and convert to Blob
      const response = await fetch(image);
      const blob = await response.blob();
      formData.append("file", blob, imageName);
    }

    formData.append("mode", selectedTool);
    formData.append("coords", JSON.stringify(keypoints));
    
    // Blur settings
    formData.append("blur_style", blurStyle);
    formData.append("blur_intensity", blurIntensity.toString());
    formData.append("solid_color", solidColor);

    // Logo settings
    formData.append("logo_brand", selectedLogo);
    formData.append("logo_scale", logoScale.toString());
    formData.append("logo_rotate", logoRotate.toString());
    formData.append("logo_skew_x", logoSkewX.toString());
    formData.append("logo_skew_y", logoSkewY.toString());

    if (selectedLogo === "custom" && customLogoFile) {
      formData.append("logo_file", customLogoFile);
    }

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server-side image warping failed");
      }

      return await response.blob();
    } catch (err) {
      console.error(err);
      setDetectionError("Warping/Processing failed. Ensure that your python backend is running.");
      return null;
    }
  }, [
    image,
    rawFile,
    imageName,
    selectedTool,
    keypoints,
    blurStyle,
    blurIntensity,
    solidColor,
    selectedLogo,
    logoScale,
    logoRotate,
    logoSkewX,
    logoSkewY,
    customLogoFile
  ]);

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (processedImage) {
        window.URL.revokeObjectURL(processedImage);
      }
    };
  }, [processedImage]);

  // Trigger high-res or preview processing automatically
  const triggerAutoProcess = useCallback(async () => {
    if (!image || scanning || !rawFile) return;
    setProcessing(true);
    try {
      const blob = await processImageRequest();
      if (blob) {
        setProcessedImage((prev) => {
          if (prev) {
            window.URL.revokeObjectURL(prev);
          }
          return window.URL.createObjectURL(blob);
        });
      }
    } catch (err) {
      console.error("Auto processing failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [image, scanning, rawFile, processImageRequest]);

  // Debounced auto-processing trigger
  useEffect(() => {
    if (scanning || draggingIdx !== null || !image || !rawFile) return;

    const delayDebounce = setTimeout(() => {
      triggerAutoProcess();
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [
    keypoints,
    selectedTool,
    blurStyle,
    blurIntensity,
    solidColor,
    selectedLogo,
    logoScale,
    logoRotate,
    logoSkewX,
    logoSkewY,
    customLogoUrl,
    image,
    scanning,
    draggingIdx,
    rawFile,
    triggerAutoProcess
  ]);

  const handleDownload = async () => {
    if (!image) return;

    // Process and download
    const blob = await processImageRequest();
    if (!blob) return;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `carvona-edited-${imageName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handlePaymentSuccess = async () => {
    // Process and download immediately after successful payment
    const blob = await processImageRequest();
    if (!blob) return;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `carvona-edited-${imageName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Handle Before/After slider dragging
  useEffect(() => {
    if (!isDraggingSlider) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(pos);
    };

    const handleMouseUp = () => {
      setIsDraggingSlider(false);
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!imgRef.current || e.touches.length === 0) return;
      const rect = imgRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(pos);
    };

    const handleTouchEnd = () => {
      setIsDraggingSlider(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDraggingSlider]);

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-2">
      {/* LEFT: Upload area / Image preview (8 cols on desktop) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => {
            if (!image) fileInputRef.current?.click();
          }}
          className={`relative border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center min-h-[350px] md:min-h-[450px] transition-all duration-300 ${
            image
              ? "border-border-light bg-white"
              : "border-primary/30 hover:border-primary hover:bg-primary/[0.02] cursor-pointer"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {!image ? (
            <div className="flex flex-col items-center gap-4 text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <Upload size={28} className="stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-main">Upload a vehicle photo</h3>
                <p className="text-sm text-text-muted mt-1">
                  Drag & drop your car image, or click to browse files from your computer
                </p>
              </div>
            </div>
          ) : (
            /* Image Preview Area */
            <div
              ref={containerRef}
              onMouseMove={handleContainerMouseMove}
              className="relative w-full h-full flex items-center justify-center overflow-hidden max-h-[500px]"
            >


              {showComparison && processedImage && imgDimensions ? (
                <div
                  className="relative select-none flex items-center justify-center"
                  style={{ width: `${imgDimensions.width}px`, height: `${imgDimensions.height}px` }}
                >
                  {/* BEFORE: Original Image */}
                  <img
                    src={image}
                    alt="Original"
                    className="w-full h-full rounded-2xl object-contain select-none pointer-events-none"
                    draggable="false"
                  />
                  {/* AFTER: Processed Image with clip path */}
                  <img
                    ref={imgRef}
                    src={processedImage}
                    alt="Processed"
                    className="absolute inset-0 w-full h-full rounded-2xl object-contain select-none pointer-events-none"
                    style={{
                      clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
                    }}
                    draggable="false"
                  />
                  {/* Divider line & handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center"
                    style={{ left: `${sliderPos}%` }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setIsDraggingSlider(true);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      setIsDraggingSlider(true);
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white border border-border-light shadow-md flex items-center justify-center text-primary font-bold text-xs pointer-events-none hover:scale-110 transition-transform">
                      ↔
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  ref={imgRef}
                  src={draggingIdx !== null ? image : (processedImage || image)}
                  onLoad={updateDimensions}
                  alt="Upload preview"
                  className="max-w-full max-h-[450px] rounded-2xl object-contain select-none"
                  draggable="false"
                />
              )}

              {/* Processing Loader */}
              {processing && (
                <div className="absolute top-4 right-4 z-40 bg-black/75 backdrop-blur text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg border border-white/10">
                  <RefreshCw size={12} className="animate-spin text-primary" />
                  <span className="text-[10px] font-mono font-semibold tracking-wider uppercase">Processing...</span>
                </div>
              )}

              {/* AI Scanning Animation Overlay */}
              {scanning && (
                <div className="absolute inset-0 bg-black/10 rounded-2xl flex flex-col items-center justify-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
                  <div className="bg-white/90 backdrop-blur border border-border-light px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-3">
                    <RefreshCw size={16} className="animate-spin text-primary" />
                    <span className="text-sm font-semibold font-mono text-text-main">
                      AI SCANNING PLATE... {scanProgress}%
                    </span>
                  </div>
                </div>
              )}


            </div>
          )}
        </div>

        {/* Warning notification for detection errors */}
        {detectionError && !scanning && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-3 rounded-2xl">
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>{detectionError}</span>
          </div>
        )}

        {/* Sample Selection */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <ImageIcon size={14} /> Try samples or upload yours:
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow hover:bg-primary-hover transition-all duration-200"
            >
              <Upload size={12} className="stroke-[2.5]" /> Upload Car Image
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {SAMPLE_IMAGES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => selectSample(sample)}
                disabled={scanning}
                className="group relative h-20 rounded-2xl overflow-hidden border border-border-light hover:border-primary transition-all duration-300 flex items-end p-2 text-left disabled:opacity-50"
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="relative z-10 text-xs font-semibold text-white truncate w-full">
                  {sample.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Tools Panel (4 cols on desktop) */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-border-light p-6 shadow-sm flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
            <Sliders size={18} className="text-primary" /> AI Warp Studio
          </h3>
          <p className="text-xs text-text-muted mt-1">Configure your license plate mask</p>
        </div>

        {/* Tab Selection */}
        {!hideTabs && (
          <div className="grid grid-cols-2 p-1 bg-section rounded-xl border border-border-light">
            <button
              onClick={() => setSelectedTool("blur")}
              className={`py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                selectedTool === "blur"
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              Plate Blur
            </button>
            <button
              onClick={() => setSelectedTool("logo")}
              className={`py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                selectedTool === "logo"
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              Logo Replacement
            </button>
          </div>
        )}

        {/* Tool Config Section */}
        {selectedTool === "blur" ? (
          <div className="flex flex-col gap-5">
            {/* Blur Style */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-text-main">Blur Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(["pixel", "smooth", "solid"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setBlurStyle(style)}
                    className={`py-2 text-xs font-semibold rounded-xl border capitalize transition-all duration-200 ${
                      blurStyle === style
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border-light bg-transparent text-text-muted hover:text-text-main"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Config Sliders */}
            {blurStyle !== "solid" ? (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-text-main">Blur Intensity</span>
                  <span className="text-primary font-mono">{blurIntensity}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={blurIntensity}
                  onChange={(e) => setBlurIntensity(Number(e.target.value))}
                  className="w-full h-1.5 bg-section rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-main">Mask Color</label>
                <div className="flex gap-3">
                  {["#FFFFFF", "#000000", "#16A34A", "#F1F5F9"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSolidColor(color)}
                      className={`w-8 h-8 rounded-full border border-border-light relative flex items-center justify-center transition-all duration-200 ${
                        solidColor === color ? "ring-2 ring-primary ring-offset-2 scale-105" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {solidColor === color && (
                        <Check size={12} className={color === "#FFFFFF" || color === "#F1F5F9" ? "text-black" : "text-white"} />
                      )}
                    </button>
                  ))}
                  {/* Custom color input */}
                  <input
                    type="color"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="w-8 h-8 rounded-full border border-border-light cursor-pointer overflow-hidden p-0"
                  />
                </div>
              </div>
            )}
            <div className="text-[11px] text-text-muted leading-relaxed flex items-start gap-1.5 bg-section p-3 rounded-xl border border-border-light">
              <Info size={14} className="text-primary shrink-0 mt-0.5" />
              <span>License Plate Blur is free forever. Output includes no watermarks.</span>
            </div>
          </div>
        ) : (
          /* Logo replace options */
          <div className="flex flex-col gap-5">
            {/* Logo choices */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-text-main">Logo Brand</label>
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={() => setSelectedLogo("carvona")}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${
                    selectedLogo === "carvona"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border-light text-text-muted hover:text-text-main"
                  }`}
                >
                  <span>Carvona Badge</span>
                  <span className="text-[10px] font-mono uppercase bg-primary text-white px-2 py-0.5 rounded-full">
                    AI DEFAULT
                  </span>
                </button>

                <button
                  onClick={() => logoInputRef.current?.click()}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${
                    selectedLogo === "custom"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border-light text-text-muted hover:text-text-main"
                  }`}
                >
                  <span>{customLogoUrl ? "Custom Logo Added" : "Upload Custom Logo..."}</span>
                  <Upload size={14} className="text-text-muted" />
                </button>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleCustomLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Fine adjustments */}
            <div className="flex flex-col gap-3 pt-2 border-t border-border-light">
              <span className="text-xs font-semibold text-text-main">Perspective Offset Controls</span>

              {/* Scale */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Scale</span>
                  <span className="font-mono">{logoScale}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={logoScale}
                  onChange={(e) => setLogoScale(Number(e.target.value))}
                  className="w-full h-1 bg-section rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Rotation */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Rotate</span>
                  <span className="font-mono">{logoRotate}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={logoRotate}
                  onChange={(e) => setLogoRotate(Number(e.target.value))}
                  className="w-full h-1 bg-section rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Skew X */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Skew Horizontal</span>
                  <span className="font-mono">{logoSkewX}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={logoSkewX}
                  onChange={(e) => setLogoSkewX(Number(e.target.value))}
                  className="w-full h-1 bg-section rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Skew Y */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Skew Vertical</span>
                  <span className="font-mono">{logoSkewY}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={logoSkewY}
                  onChange={(e) => setLogoSkewY(Number(e.target.value))}
                  className="w-full h-1 bg-section rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* Free Status Badge */}
            <div className="text-[11px] text-text-muted leading-relaxed flex items-start gap-1.5 bg-section p-3 rounded-xl border border-border-light mt-4">
              <Info size={14} className="text-primary shrink-0 mt-0.5" />
              <span>
                License plate blurring and logo replacements are 100% free and unlimited.
              </span>
            </div>
          </div>
        )}
 
        {/* Global Action Buttons */}
        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-border-light">
          {image && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 bg-transparent border border-border-light hover:bg-section text-text-main text-xs font-semibold rounded-xl transition-all duration-200"
              >
                Upload New
              </button>
              <button
                onClick={() => {
                  setImage(null);
                  setRawFile(null);
                  setCustomLogoFile(null);
                  setCustomLogoUrl(null);
                  setDetectionError(null);
                  setImgDimensions(null);
                }}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-all duration-200"
              >
                Clear Image
              </button>
            </div>
          )}
 
          <button
            onClick={handleDownload}
            disabled={!image || scanning}
            className="w-full py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-200"
          >
            <Download size={16} />
            Download Image
          </button>
        </div>
      </div>

      {/* SECURE CHECKOUT MODAL */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
