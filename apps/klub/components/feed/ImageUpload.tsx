"use client";

import { useState, useRef } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
}

export function ImageUpload({ imageUrl, onImageChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      alert("Plik max 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Dozwolone tylko obrazy");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        onImageChange(url);
      }
    } catch {
      // silent
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  if (imageUrl) {
    return (
      <div className="relative inline-block">
        <img
          src={imageUrl}
          alt="Upload"
          className="max-h-40 rounded-lg border border-slate-600"
        />
        <button
          type="button"
          onClick={() => onImageChange(null)}
          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
        dragOver
          ? "border-orange-500 bg-orange-500/10"
          : "border-slate-600 hover:border-slate-500"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      {uploading ? (
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Przesylanie...</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-300 transition-colors w-full"
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-sm">Dodaj zdjecie (max 5MB)</span>
        </button>
      )}
    </div>
  );
}
