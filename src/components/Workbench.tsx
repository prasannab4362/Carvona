"use client";

import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from "react";
import { Upload, Sliders, RefreshCw, Download, Image as ImageIcon, Check, Info } from "lucide-react";
import PaymentModal from "./PaymentModal";

// Pre-defined sample images with high quality and pre-configured plate coordinates
const SAMPLE_IMAGES = [
  {
    id: "sports",
    name: "Sports Coupe",
    url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80",
    plate: { x: 45.5, y: 67.2, w: 11.2, h: 5.5 },
  },
  {
    id: "suv",
    name: "Luxury SUV",
    url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80",
    plate: { x: 44.5, y: 79.5, w: 12.0, h: 5.2 },
  },
  {
    id: "sedan",
    name: "Electric Sedan",
    url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80",
    plate: { x: 44.2, y: 73.8, w: 12.5, h: 5.8 },
  },
];

interface PlateCoords {
  x: number; // percentage
  y: number; // percentage
  w: number; // percentage
  h: number; // percentage
}

export default function Workbench({ defaultTool = "blur" }: { defaultTool?: "blur" | "logo" }) {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [selectedTool, setSelectedTool] = useState<"blur" | "logo">(defaultTool);
  
  // Bounding box states
  const [coords, setCoords] = useState<PlateCoords>({ x: 40, y: 60, w: 20, h: 8 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<string | null>(null); // "nw", "ne", "se", "sw"
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const boxStart = useRef<PlateCoords>({ x: 0, y: 0, w: 0, h: 0 });

  // Blur settings
  const [blurIntensity, setBlurIntensity] = useState<number>(10);
  const [blurStyle, setBlurStyle] = useState<"pixel" | "smooth" | "solid">("pixel");
  const [solidColor, setSolidColor] = useState<string>("#FFFFFF");

  // Logo settings
  const [selectedLogo, setSelectedLogo] = useState<"carvona" | "premium" | "custom">("carvona");
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState<number>(100);
  const [logoRotate, setLogoRotate] = useState<number>(0);
  const [logoSkewX, setLogoSkewX] = useState<number>(0);
  const [logoSkewY, setLogoSkewY] = useState<number>(0);

  // Trial / Payment States
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [trialUsed, setTrialUsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("carvona_trial_used") === "true";
    }
    return false;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const selectSample = (sample: typeof SAMPLE_IMAGES[0]) => {
    setScanning(true);
    setScanProgress(0);
    setImage(sample.url);
    setImageName(`${sample.name.toLowerCase().replace(/\s+/g, "-")}.jpg`);
    
    // Simulate smart detection scanning
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setCoords(sample.plate);
          return 100;
        }
        return prev + 5;
      });
    }, 45);
  };

  // Pre-load default Corvette image on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      selectSample(SAMPLE_IMAGES[0]);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setScanning(true);
        setScanProgress(0);
        setImage(event.target.result as string);
        setImageName(file.name);
        
        const interval = setInterval(() => {
          setScanProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setScanning(false);
              // Default to center bounding box for custom images
              setCoords({ x: 40, y: 46, w: 20, h: 8 });
              return 100;
            }
            return prev + 10;
          });
        }, 80);
      }
    };
    reader.readAsDataURL(file);
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
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCustomLogoUrl(event.target.result as string);
        setSelectedLogo("custom");
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and Resize handlers for the Bounding Box
  const handleBoxMouseDown = (e: ReactMouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    boxStart.current = { ...coords };
  };

  const handleResizeMouseDown = (e: ReactMouseEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(handle);
    dragStart.current = { x: e.clientX, y: e.clientY };
    boxStart.current = { ...coords };
  };

  const handleContainerMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging && !isResizing) return;
    if (!containerRef.current || !imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.current.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.current.y) / rect.height) * 100;

    if (isDragging) {
      // Keep boundaries inside 0-100%
      let newX = boxStart.current.x + deltaX;
      let newY = boxStart.current.y + deltaY;

      newX = Math.max(0, Math.min(100 - boxStart.current.w, newX));
      newY = Math.max(0, Math.min(100 - boxStart.current.h, newY));

      setCoords((prev) => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      let newX = boxStart.current.x;
      let newY = boxStart.current.y;
      let newW = boxStart.current.w;
      let newH = boxStart.current.h;

      if (isResizing.includes("n")) {
        const potentialY = boxStart.current.y + deltaY;
        const potentialH = boxStart.current.h - deltaY;
        if (potentialH > 2 && potentialY > 0) {
          newY = potentialY;
          newH = potentialH;
        }
      }
      if (isResizing.includes("s")) {
        const potentialH = boxStart.current.h + deltaY;
        if (potentialH > 2 && (boxStart.current.y + potentialH) < 100) {
          newH = potentialH;
        }
      }
      if (isResizing.includes("w")) {
        const potentialX = boxStart.current.x + deltaX;
        const pointerW = boxStart.current.w - deltaX;
        if (pointerW > 2 && potentialX > 0) {
          newX = potentialX;
          newW = pointerW;
        }
      }
      if (isResizing.includes("e")) {
        const pointerW = boxStart.current.w + deltaX;
        if (pointerW > 2 && (boxStart.current.x + pointerW) < 100) {
          newW = pointerW;
        }
      }

      setCoords({ x: newX, y: newY, w: newW, h: newH });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Process the final output on high-res Canvas
  const drawProcessedImage = (): Promise<string> => {
    return new Promise((resolve) => {
      if (!image || !imgRef.current) {
        resolve("");
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve("");
          return;
        }

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw background original image
        ctx.drawImage(img, 0, 0);

        // Convert percentage coords to pixel coords
        const pxX = (coords.x / 100) * canvas.width;
        const pxY = (coords.y / 100) * canvas.height;
        const pxW = (coords.w / 100) * canvas.width;
        const pxH = (coords.h / 100) * canvas.height;

        if (selectedTool === "blur") {
          if (blurStyle === "solid") {
            ctx.fillStyle = solidColor;
            ctx.fillRect(pxX, pxY, pxW, pxH);
          } else if (blurStyle === "pixel") {
            // Downscale the box, then redraw it upscaled
            const pixelSize = Math.max(2, Math.floor(blurIntensity / 2));
            const wScaled = Math.max(1, Math.floor(pxW / pixelSize));
            const hScaled = Math.max(1, Math.floor(pxH / pixelSize));

            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = wScaled;
            tempCanvas.height = hScaled;
            const tempCtx = tempCanvas.getContext("2d");
            if (tempCtx) {
              tempCtx.imageSmoothingEnabled = false;
              tempCtx.drawImage(canvas, pxX, pxY, pxW, pxH, 0, 0, wScaled, hScaled);

              ctx.imageSmoothingEnabled = false;
              ctx.drawImage(tempCanvas, 0, 0, wScaled, hScaled, pxX, pxY, pxW, pxH);
              ctx.imageSmoothingEnabled = true;
            }
          } else if (blurStyle === "smooth") {
            // Simple canvas box blur simulation (draw offset overlapping images with opacity)
            const passes = blurIntensity;
            ctx.globalAlpha = 0.15;
            for (let i = -passes; i <= passes; i += 2) {
              for (let j = -passes; j <= passes; j += 2) {
                if (i === 0 && j === 0) continue;
                ctx.drawImage(img, pxX, pxY, pxW, pxH, pxX + i, pxY + j, pxW, pxH);
              }
            }
            ctx.globalAlpha = 1.0;
          }
        } else if (selectedTool === "logo") {
          // Draw a background badge (plate base)
          ctx.fillStyle = selectedLogo === "premium" ? "#1F2937" : "#16A34A";
          
          // Draw solid background plate
          ctx.fillRect(pxX, pxY, pxW, pxH);

          // Save state to apply transformations
          ctx.save();
          ctx.translate(pxX + pxW / 2, pxY + pxH / 2);

          // Apply rotation, scale, and skew
          ctx.rotate((logoRotate * Math.PI) / 180);
          ctx.transform(
            1, // horizontal scaling
            Math.tan((logoSkewY * Math.PI) / 180), // vertical skew
            Math.tan((logoSkewX * Math.PI) / 180), // horizontal skew
            1, // vertical scaling
            0, // horizontal translation
            0  // vertical translation
          );

          const scaleRatio = logoScale / 100;
          const logoW = pxW * 0.8 * scaleRatio;
          const logoH = pxH * 0.6 * scaleRatio;

          if (selectedLogo === "custom" && customLogoUrl) {
            const logoImg = new Image();
            logoImg.onload = () => {
              ctx.drawImage(logoImg, -logoW / 2, -logoH / 2, logoW, logoH);
              ctx.restore();
              resolve(canvas.toDataURL("image/jpeg", 0.95));
            };
            logoImg.src = customLogoUrl;
            return;
          } else {
            // Draw pre-made stylized text logos
            ctx.fillStyle = "#FFFFFF";
            ctx.font = `bold ${Math.floor(pxH * 0.45 * scaleRatio)}px monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            const logoText = selectedLogo === "premium" ? "PREMIUM MOTORS" : "CARVONA";
            ctx.fillText(logoText, 0, 0);
          }

          ctx.restore();
        }

        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };
      img.src = image;
    });
  };

  const handleDownload = async () => {
    if (!image) return;

    if (selectedTool === "logo" && trialUsed) {
      // Trigger checkout modal
      setIsPaymentOpen(true);
      return;
    }

    // Process and download
    const dataUrl = await drawProcessedImage();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `carvona-edited-${imageName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Consume free trial if logo replace was selected
    if (selectedTool === "logo" && !trialUsed) {
      localStorage.setItem("carvona_trial_used", "true");
      setTrialUsed(true);
      alert("🎉 Your free trial logo replacement has been downloaded!");
    }
  };

  const handlePaymentSuccess = async () => {
    // Process and download immediately after successful payment
    const dataUrl = await drawProcessedImage();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `carvona-edited-${imageName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <img
                ref={imgRef}
                src={image}
                alt="Upload preview"
                className="max-w-full max-h-[450px] rounded-2xl object-contain select-none"
                draggable="false"
              />

              {/* AI Scanning Animation Overlay */}
              {scanning && (
                <div className="absolute inset-0 bg-black/10 rounded-2xl flex flex-col items-center justify-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
                  <div className="bg-white/90 backdrop-blur border border-border-light px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-3">
                    <RefreshCw size={16} className="animate-spin text-primary" />
                    <span className="text-sm font-semibold font-mono text-text-main">
                      AI DETECTING PLATE... {scanProgress}%
                    </span>
                  </div>
                </div>
              )}

              {/* Interactive Bounding Box (Only shows when loaded and not scanning) */}
              {!scanning && (
                <div
                  onMouseDown={handleBoxMouseDown}
                  className="absolute border-[3px] border-primary cursor-move group select-none shadow-[0_0_10px_rgba(22,163,74,0.5)] bg-primary/10"
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    width: `${coords.w}%`,
                    height: `${coords.h}%`,
                  }}
                >
                  {/* Bounding box corners for resizing */}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
                    className="absolute -top-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-primary rounded-full cursor-nwse-resize"
                  />
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
                    className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-primary rounded-full cursor-nesw-resize"
                  />
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, "se")}
                    className="absolute -bottom-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-primary rounded-full cursor-nwse-resize"
                  />
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
                    className="absolute -bottom-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-primary rounded-full cursor-nesw-resize"
                  />

                  {/* Dynamic Bounding Box Overlay for Live Preview */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-none">
                    {selectedTool === "blur" && (
                      <div
                        className="w-full h-full"
                        style={{
                          backdropFilter: blurStyle === "smooth" ? `blur(${blurIntensity}px)` : "none",
                          backgroundColor: blurStyle === "solid" ? solidColor : "rgba(22,16,74,0.15)",
                          display: blurStyle === "pixel" ? "flex" : "block",
                        }}
                      >
                        {blurStyle === "pixel" && (
                          <div className="w-full h-full bg-[radial-gradient(#16A34A_1px,transparent_1px)] [background-size:6px_6px] opacity-75" />
                        )}
                      </div>
                    )}
                    {selectedTool === "logo" && (
                      <div
                        className="w-full h-full flex items-center justify-center text-white font-mono font-bold"
                        style={{
                          backgroundColor: selectedLogo === "premium" ? "#1F2937" : "#16A34A",
                          transform: `rotate(${logoRotate}deg) skew(${logoSkewX}deg, ${logoSkewY}deg) scale(${logoScale / 100})`,
                        }}
                      >
                        {selectedLogo === "custom" && customLogoUrl ? (
                          <img src={customLogoUrl} alt="Custom Logo" className="max-w-[85%] max-h-[85%] object-contain" />
                        ) : (
                          <span className="text-[10px] md:text-xs tracking-wider">
                            {selectedLogo === "premium" ? "PREMIUM MOTORS" : "CARVONA"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bounding box helper tag */}
                  <div className="absolute -top-6 left-0 bg-primary text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow">
                    PLATE AREA (DRAG TO MOVE)
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sample Selection */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <ImageIcon size={14} /> Don&apos;t have a photo? Try these samples:
          </span>
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
            <Sliders size={18} className="text-primary" /> Editing Studio
          </h3>
          <p className="text-xs text-text-muted mt-1">Configure your license plate mask</p>
        </div>

        {/* Tab Selection */}
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
                  onClick={() => setSelectedLogo("premium")}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${
                    selectedLogo === "premium"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border-light text-text-muted hover:text-text-main"
                  }`}
                >
                  <span>Premium Motors</span>
                  <span className="text-[10px] font-mono uppercase bg-gray-800 text-white px-2 py-0.5 rounded-full">
                    DEALERSHIP
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
              <span className="text-xs font-semibold text-text-main">Perspective Controls</span>

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

            {/* Trial Status Badge */}
            <div className="text-[11px] text-text-muted leading-relaxed flex items-start gap-1.5 bg-section p-3 rounded-xl border border-border-light">
              <Info size={14} className="text-primary shrink-0 mt-0.5" />
              <span>
                {trialUsed
                  ? "Trial used. Download costs ₹2 per processed image (Stripe simulation)."
                  : "First download is FREE (trial). Subsequent images cost ₹2."}
              </span>
            </div>
          </div>
        )}

        {/* Global Action Buttons */}
        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-border-light">
          {image && (
            <button
              onClick={() => {
                setImage(null);
                setCustomLogoUrl(null);
              }}
              className="w-full py-2.5 bg-transparent border border-border-light hover:bg-section text-text-main text-xs font-semibold rounded-xl transition-all duration-200"
            >
              Clear Image
            </button>
          )}

          <button
            onClick={handleDownload}
            disabled={!image || scanning}
            className="w-full py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-200"
          >
            <Download size={16} />
            {selectedTool === "logo" && trialUsed ? "Unlock & Download (₹2)" : "Download Image"}
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
