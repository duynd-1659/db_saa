'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CancelIcon } from '@/components/ui/icons/CancelIcon';
import { LinkIcon } from '@/components/ui/icons/LinkIcon';

interface AddLinkModalProps {
  onSave: (text: string, url: string) => void;
  onCancel: () => void;
}

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function AddLinkModal({ onSave, onCancel }: AddLinkModalProps): React.ReactElement {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState<{ text?: string; url?: string }>({});

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    onSave(text.trim(), url.trim());
  }

  const isFormValid = text.trim().length > 0 && text.trim().length <= 100 && isValidUrl(url.trim());

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-overlay-mask)]"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-label="Thêm đường dẫn"
        className="relative z-10 mx-4 flex w-full flex-col gap-6 rounded-[16px] bg-[var(--color-modal-bg)] p-6 md:mx-0 md:max-w-[752px] md:gap-8 md:rounded-[24px] md:p-10"
      >
        {/* Title */}
        <h2 className="font-montserrat text-[24px] font-bold leading-[32px] text-[var(--color-page-bg)] md:text-[32px] md:leading-[40px]">
          Thêm đường dẫn
        </h2>

        {/* Text field row */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <label className="shrink-0 font-montserrat text-[18px] font-bold leading-[24px] text-[var(--color-page-bg)] md:w-[107px] md:text-[22px] md:leading-[28px]">
              Nội dung
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (errors.text) setErrors((prev) => ({ ...prev, text: undefined }));
              }}
              placeholder="Nhập nội dung hiển thị"
              className={`h-14 flex-1 rounded-lg border bg-[var(--color-input-bg)] px-6 py-4 font-montserrat text-base text-[var(--color-page-bg)] placeholder:text-[var(--color-hint-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] ${
                errors.text ? 'border-red-500' : 'border-[var(--color-border)]'
              }`}
              maxLength={100}
            />
          </div>
          {errors.text && <p className="text-sm text-red-500 md:pl-[123px]">{errors.text}</p>}
        </div>

        {/* URL field row */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <label className="shrink-0 font-montserrat text-[18px] font-bold leading-[24px] text-[var(--color-page-bg)] md:w-[107px] md:text-[22px] md:leading-[28px]">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) setErrors((prev) => ({ ...prev, url: undefined }));
              }}
              placeholder="https://"
              className={`h-14 flex-1 rounded-lg border bg-[var(--color-input-bg)] px-6 py-4 font-montserrat text-base text-[var(--color-page-bg)] placeholder:text-[var(--color-hint-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] ${
                errors.url ? 'border-red-500' : 'border-[var(--color-border)]'
              }`}
            />
          </div>
          {errors.url && <p className="text-sm text-red-500 md:pl-[123px]">{errors.url}</p>}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col-reverse gap-3 md:flex-row md:items-start md:gap-6">
          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer flex min-h-[44px] items-center justify-center gap-2 rounded border border-[var(--color-border)] bg-[var(--color-btn-secondary-bg)] px-10 py-4 font-montserrat text-base font-bold text-[var(--color-page-bg)] transition-colors hover:bg-[var(--color-gold)]/10 md:h-[60px]"
          >
            Hủy
            <CancelIcon />
          </button>

          {/* Save */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`${
              isFormValid ? 'cursor-pointer' : 'cursor-not-allowed'
            } flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--color-gold)] py-4 font-montserrat text-[18px] font-bold text-[var(--color-page-bg)] transition-opacity disabled:opacity-50 md:h-[60px] md:text-[22px]`}
          >
            Lưu
            <LinkIcon />
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
