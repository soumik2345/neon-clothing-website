"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Link2, X, Check, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadInputProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  description?: string;
  placeholder?: string;
  aspectRatioClass?: string;
}

export function ImageUploadInput({
  label,
  value = "",
  onChange,
  description,
  placeholder = "Paste direct image URL here",
  aspectRatioClass = "aspect-[4/3]",
}: ImageUploadInputProps) {
  const generatedId = React.useId();
  const inputId = label
    ? `file-input-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
    : `file-input-${generatedId.replace(/:/g, "")}`;
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      onChange(data.url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2500);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Upload error";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-black">
            {label}
          </label>
          {description && (
            <span className="text-[10px] text-neutral-500 font-mono">
              {description}
            </span>
          )}
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xs border border-neutral-200 w-fit">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-2xs transition cursor-pointer ${
            mode === "upload"
              ? "bg-black text-white shadow-xs"
              : "text-neutral-600 hover:text-black hover:bg-neutral-200"
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload File (Cloudinary)</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-2xs transition cursor-pointer ${
            mode === "url"
              ? "bg-black text-white shadow-xs"
              : "text-neutral-600 hover:text-black hover:bg-neutral-200"
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Direct Image URL</span>
        </button>
      </div>

      {/* Input Body */}
      <div className="flex flex-col sm:flex-row gap-4 items-start pt-1">
        <div className="flex-1 w-full space-y-2">
          {mode === "upload" ? (
            /* Upload File Area */
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id={inputId}
              />

              <label
                htmlFor={inputId}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-neutral-300 hover:border-black rounded-xs bg-[#fafafa] hover:bg-neutral-50 transition cursor-pointer text-center group"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-black py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Uploading image to Cloudinary...</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-neutral-500 group-hover:text-black transition mb-1.5" />
                    <span className="text-xs font-bold text-black uppercase tracking-wider">
                      Click to Browse or Drag Image File
                    </span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">
                      JPG, PNG, WEBP up to 10MB
                    </span>
                  </>
                )}
              </label>

              {uploadSuccess && (
                <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <Check className="w-3.5 h-3.5" /> Image successfully uploaded!
                </div>
              )}

              {uploadError && (
                <div className="mt-1 text-xs font-bold text-red-600">
                  {uploadError}
                </div>
              )}
            </div>
          ) : (
            /* Direct Image URL Area */
            <div className="space-y-1">
              <input
                type="url"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-2.5 bg-white border border-neutral-300 rounded-xs text-xs text-black font-mono outline-none focus:border-black transition"
              />
              <span className="text-[10px] text-neutral-500 block">
                Paste direct URL from Unsplash, Cloudinary, Imgur, or your CDN.
              </span>
            </div>
          )}
        </div>

        {/* Thumbnail Preview Area */}
        {value ? (
          <div className="relative group shrink-0">
            <div
              className={`relative w-24 sm:w-28 ${aspectRatioClass} bg-neutral-900 rounded-xs overflow-hidden border border-neutral-300 shadow-xs`}
            >
              <Image
                src={value}
                alt="Upload preview"
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>

            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition cursor-pointer"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            className={`w-24 sm:w-28 ${aspectRatioClass} bg-neutral-100 rounded-xs border border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 shrink-0`}
          >
            <ImageIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] uppercase font-mono">No Image</span>
          </div>
        )}
      </div>
    </div>
  );
}
