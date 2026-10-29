// FILE PATH: components/team/cms/modals/MediaUploaderModal.tsx
'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { StudioMember } from '@/lib/store';

interface MediaUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: (url: string, altText: string) => void;
  currentUser: StudioMember;
}

export default function MediaUploaderModal({
  isOpen,
  onClose,
  onUploaded,
  currentUser,
}: MediaUploaderModalProps) {
  const [altText, setAltText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('Invalid file type. Please select a PNG, JPEG, WebP, or SVG image.');
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    setError(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    if (!altText) {
      setAltText(selected.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', altText);

      const res = await fetch('/api/cms/upload', {
        method: 'POST',
        headers: {
          'x-author-id': currentUser.id,
          'x-author-name': currentUser.name,
          'x-author-role': currentUser.role,
        },
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.media?.fileUrl) {
        onUploaded(json.media.fileUrl, altText);
        onClose();
        return;
      }

      // Fallback to local Data URI if server upload is unconfigured
      if (previewUrl) {
        onUploaded(previewUrl, altText);
        onClose();
        return;
      }

      setError(json.error || 'Failed to upload image');
    } catch (err: any) {
      // Local fallback
      if (previewUrl) {
        onUploaded(previewUrl, altText);
        onClose();
      } else {
        setError(err.message || 'Upload error');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9500] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md theme-card bg-[var(--surface-elevated)] p-6 rounded-[var(--radius)] shadow-2xl border border-[var(--border)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              UPLOAD MEDIA ASSET
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text)] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded border border-red-500/30 bg-red-500/10 flex items-center space-x-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="mt-4 space-y-4">
          {/* Dropzone / Preview */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] rounded-[var(--radius)] p-6 text-center cursor-pointer transition-colors bg-[var(--surface)]"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />
            {previewUrl ? (
              <div className="space-y-2">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="max-h-36 mx-auto rounded object-contain"
                />
                <span className="font-mono text-[10px] text-[var(--accent)] block">
                  Click to replace file ({file?.name})
                </span>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <Upload className="w-8 h-8 text-[var(--text-muted)] mx-auto animate-bounce" />
                <div className="font-mono text-xs font-bold text-[var(--text)]">
                  CHOOSE IMAGE OR DRAG & DROP
                </div>
                <div className="font-mono text-[9px] text-[var(--text-dim)]">
                  PNG, JPEG, WebP, SVG up to 5MB
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              ACCESSIBILITY ALT TEXT *
            </label>
            <input
              required
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descriptive label for screen readers & SEO"
              className="theme-input font-mono text-xs"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="theme-btn-secondary px-4 py-2 text-xs font-semibold uppercase"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={!file || isUploading}
              className="theme-btn-primary px-5 py-2 text-xs font-bold uppercase disabled:opacity-50"
            >
              {isUploading ? 'UPLOADING...' : 'SAVE & ATTACH'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
