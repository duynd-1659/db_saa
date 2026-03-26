'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import type { UploadedImage } from '@/types/kudo-write';

interface ImageUploadProps {
  images: UploadedImage[];
  onAdd: (image: UploadedImage) => void;
  onRemove: (index: number) => void;
}

export function ImageUpload({ images, onAdd, onRemove }: ImageUploadProps): React.ReactElement {
  const t = useTranslations('writeKudo');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const atLimit = images.length >= 5;

  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    // Cap selection to remaining available slots (silently drop excess)
    const remaining = 5 - images.length;
    const files = Array.from(fileList).slice(0, remaining);

    files.forEach((file, i) => {
      const oversized = file.size > MAX_SIZE_BYTES;
      onAdd({
        file,
        previewUrl: URL.createObjectURL(file),
        order_index: images.length + i,
        hasError: oversized || undefined,
        errorMessage: oversized ? 'Ảnh vượt quá 10MB' : undefined,
      });
    });

    // Reset input so the same files can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <label className="shrink-0 font-montserrat text-[22px] font-bold leading-[28px] text-[var(--color-page-bg)] md:w-[152px]">
        {t('labelImage')}
      </label>

      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3">
          {/* Thumbnails */}
          {images.map((img, index) => (
            <div key={img.previewUrl} className="flex flex-col items-center gap-1">
              <div
                className={`group relative h-20 w-20 overflow-hidden rounded-[18px] border-2 ${img.hasError ? 'border-[#E46060]' : 'border-[var(--color-border)]'}`}
              >
                <Image
                  src={img.previewUrl}
                  alt={`Uploaded ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white cursor-pointer"
                  aria-label={`${t('aria.removeImage')} ${index + 1}`}
                >
                  ×
                </button>
              </div>
              {img.hasError && (
                <span className="font-montserrat text-[11px] font-bold leading-4 text-[#E46060]">
                  {img.errorMessage}
                </span>
              )}
            </div>
          ))}

          {/* Add button */}
          {!atLimit && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-2 py-1 text-[var(--color-hint-text)] transition-colors hover:bg-[var(--color-btn-secondary-bg)]"
            >
              <PlusIcon size={24} />
              <span className="font-montserrat text-[11px] font-bold leading-4 tracking-[0.5px]">
                {t('addImage')}
                <br />
                {t('maxImages')}
              </span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload image"
          />
        </div>
      </div>
    </div>
  );
}
