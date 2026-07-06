'use client';

import { useState } from 'react';

interface ThumbnailPreviewProps {
  src: string;
  alt?: string;
  onRemove?: () => void;
  className?: string;
}

export default function ThumbnailPreview({ src, alt = '', onRemove, className = '' }: ThumbnailPreviewProps) {
  const [zoom, setZoom] = useState(false);

  return (
    <>
      <div className={`relative inline-block group ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-12 h-12 rounded border border-gray-600 object-cover cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setZoom(true)}
        />
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity leading-none"
          >✕</button>
        )}
      </div>

      {/* Lightbox */}
      {zoom && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setZoom(false)}>
          <button className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10 w-10 h-10 flex items-center justify-center" onClick={() => setZoom(false)}>✕</button>
          <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
