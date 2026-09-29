"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Link2,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  Image as ImageIcon,
  Check,
} from "lucide-react";

interface MultiImageUploadInputProps {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  description?: string;
  maxImages?: number;
}

export function MultiImageUploadInput({
  label = "Product Images",
  values = [],
  onChange,
  description = "Upload multiple high-res product photos or enter URLs. The first image is the main cover.",
  maxImages = 8,
}: MultiImageUploadInputProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (values.length + files.length > maxImages) {
      setError(`You can upload a maximum of ${maxImages} images per product.`);
      return;
    }

    setIsUploading(true);
    setError(null);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading image ${i + 1} of ${files.length}...`);
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          newUrls.push(data.url);
        } else {
          console.error("Upload error for file:", file.name, data.error);
        }
      }

      if (newUrls.length > 0) {
        onChange([...values, ...newUrls]);
      }
    } catch (err) {
      console.error("Multiple upload error:", err);
      setError("Failed to upload one or more files. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      setError("Please enter a valid image URL starting with http:// or https://");
      return;
    }

    if (values.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    onChange([...values, trimmed]);
    setUrlInput("");
    setError(null);
  };

  const handleRemove = (index: number) => {
    const next = values.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const item = values[index];
    const filtered = values.filter((_, idx) => idx !== index);
    onChange([item, ...filtered]);
  };

  const handleMove = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= values.length) return;

    const copy = [...values];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      {/* Label and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <label className="block uppercase font-bold text-neutral-800 text-xs font-mono">
            {label} ({values.length}/{maxImages})
          </label>
          {description && (
            <p className="text-[11px] text-neutral-500">{description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || values.length >= maxImages}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-xs hover:bg-neutral-800 transition disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Photos</span>
            </>
          )}
        </button>
      </div>

      {/* Hidden Multiple File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleMultipleFiles}
        className="hidden"
      />

      {/* URL Input Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Or paste direct image URL (https://...)"
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xs text-xs outline-none focus:border-black font-mono transition"
          />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          disabled={!urlInput.trim() || values.length >= maxImages}
          className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider rounded-xs transition disabled:opacity-40 cursor-pointer shrink-0"
        >
          Add URL
        </button>
      </div>

      {/* Progress or Error Display */}
      {uploadProgress && (
        <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-xs flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{uploadProgress}</span>
        </div>
      )}

      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
          {error}
        </div>
      )}

      {/* Images Grid */}
      {values.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-300 hover:border-black p-8 text-center rounded-xs bg-neutral-50 hover:bg-neutral-100/60 transition cursor-pointer space-y-2"
        >
          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mx-auto text-neutral-600">
            <ImageIcon className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold uppercase text-neutral-800 tracking-wider">
            No Images Uploaded Yet
          </p>
          <p className="text-[11px] text-neutral-500">
            Click here to select photos from your device, or paste an image link above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {values.map((imgUrl, index) => {
            const isCover = index === 0;
            return (
              <div
                key={`${imgUrl}-${index}`}
                className={`relative group bg-neutral-100 border rounded-xs overflow-hidden transition ${
                  isCover ? "border-black ring-2 ring-black/20" : "border-neutral-200"
                }`}
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-[4/5] w-full bg-neutral-200">
                  <Image
                    src={imgUrl}
                    alt={`Product photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>

                {/* Badge (Cover vs Index) */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                  {isCover ? (
                    <span className="bg-black text-white text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded-2xs flex items-center gap-1 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-white" />
                      COVER
                    </span>
                  ) : (
                    <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-1.5 py-0.2 rounded-2xs">
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Hover / Overlay Action Bar */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  {/* Top Right: Delete button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xs transition shadow-sm cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom: Re-order & Set Cover */}
                  <div className="space-y-1.5">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(index)}
                        className="w-full py-1 bg-white hover:bg-neutral-100 text-black text-[10px] font-black uppercase tracking-wider rounded-xs transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Star className="w-3 h-3" />
                        <span>Make Cover</span>
                      </button>
                    )}

                    <div className="flex items-center justify-between gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMove(index, "left")}
                        className="flex-1 py-1 bg-neutral-900/90 hover:bg-black disabled:opacity-30 text-white text-[10px] rounded-xs transition flex items-center justify-center cursor-pointer"
                        title="Move Left"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === values.length - 1}
                        onClick={() => handleMove(index, "right")}
                        className="flex-1 py-1 bg-neutral-900/90 hover:bg-black disabled:opacity-30 text-white text-[10px] rounded-xs transition flex items-center justify-center cursor-pointer"
                        title="Move Right"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add More Tile */}
          {values.length < maxImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[4/5] border-2 border-dashed border-neutral-300 hover:border-black rounded-xs bg-neutral-50 hover:bg-neutral-100/70 transition flex flex-col items-center justify-center gap-1.5 text-neutral-500 hover:text-black cursor-pointer"
            >
              <Plus className="w-6 h-6" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Add Image
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
