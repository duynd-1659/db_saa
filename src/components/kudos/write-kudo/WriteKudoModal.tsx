'use client';

import { useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { RecipientProfile } from '@/types/kudo-write';
import { CancelIcon } from '@/components/ui/icons/CancelIcon';
import { SendIcon } from '@/components/ui/icons/SendIcon';
import { useWriteKudo } from '@/hooks/use-write-kudo';
import { RecipientSearch } from './RecipientSearch';
import { RichTextEditor } from './RichTextEditor';
import { HashtagPicker } from './HashtagPicker';
import { ImageUpload } from './ImageUpload';
import { AnonymousToggle } from './AnonymousToggle';

interface WriteKudoModalProps {
  onClose: () => void;
  defaultRecipient?: RecipientProfile;
}

export function WriteKudoModal({
  onClose,
  defaultRecipient,
}: WriteKudoModalProps): React.ReactElement {
  const t = useTranslations('writeKudo');
  const {
    state,
    setRecipient,
    setTitle,
    setContent,
    setHashtags,
    addImage,
    removeImage,
    setAnonymous,
    setAnonymousName,
    submitKudo,
    resetForm,
    isValid,
  } = useWriteKudo(onClose, defaultRecipient);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') handleCancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    await submitKudo();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay mask */}
      <div
        className="absolute inset-0 bg-[var(--color-overlay-mask)]"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Modal card */}
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-label={t('aria.modal')}
        className="relative z-10 mx-4 flex w-full flex-col gap-4 overflow-y-auto rounded-[16px] bg-[var(--color-modal-bg)] p-6 md:mx-0 md:max-w-[752px] md:gap-6 md:rounded-[24px] md:p-10"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* A: Title */}
        <h2 className="text-center font-montserrat text-[24px] font-bold leading-[32px] text-[var(--color-page-bg)] md:text-[32px] md:leading-[40px]">
          {t('modalTitle')}
        </h2>

        {/* B: Recipient search */}
        <RecipientSearch
          value={state.recipient}
          onChange={setRecipient}
          error={state.errors.recipient}
        />

        {/* B.NEW: Danh hiệu (title) */}
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
          <label
            htmlFor="kudo-title"
            className="shrink-0 font-montserrat text-[22px] font-bold leading-[28px] text-[var(--color-page-bg)] md:w-[152px] md:pt-4"
          >
            {t('labelTitle')} <span className="text-red-500">*</span>
          </label>
          <div className="flex-1 flex flex-col gap-1">
            <input
              id="kudo-title"
              type="text"
              value={state.title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('titlePlaceholder')}
              className={`flex-1 rounded-lg border bg-[var(--color-input-bg)] px-6 py-4 font-montserrat text-base text-[var(--color-page-bg)] placeholder:text-[var(--color-hint-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] ${
                state.errors.title ? 'border-red-500' : 'border-[var(--color-border)]'
              }`}
            />
            <p className="font-montserrat text-base font-bold leading-6 text-[var(--color-hint-text)]">
              {t('titleHint')}
            </p>
            {state.errors.title && <p className="text-sm text-red-500">{state.errors.title}</p>}
          </div>
        </div>

        {/* C+D: Rich text editor with toolbar */}
        <RichTextEditor
          content={state.content}
          onChange={setContent}
          error={state.errors.content}
        />

        {/* E: Hashtag picker */}
        <HashtagPicker
          selected={state.hashtags}
          onChange={setHashtags}
          error={state.errors.hashtags}
        />

        {/* F: Image upload */}
        <ImageUpload images={state.images} onAdd={addImage} onRemove={removeImage} />

        {/* G: Anonymous toggle */}
        <AnonymousToggle
          isAnonymous={state.isAnonymous}
          anonymousName={state.anonymousName}
          onToggle={setAnonymous}
          onNameChange={setAnonymousName}
          error={state.errors.anonymousName}
        />

        {/* H: Action buttons */}
        <div className="flex flex-col-reverse gap-3 pt-2 md:flex-row md:items-center md:gap-6">
          {/* Cancel button */}
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-[60px] items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-btn-secondary-bg)] px-10 py-4 font-montserrat text-base font-bold text-[var(--color-page-bg)] transition-colors hover:bg-[var(--color-gold)]/10 cursor-pointer"
          >
            {t('cancelButton')}
            <CancelIcon />
          </button>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isValid || state.isSubmitting}
            className={`flex h-[60px] flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--color-gold)] py-4 font-montserrat text-[22px] font-bold text-[var(--color-page-bg)] transition-opacity disabled:opacity-50 ${isValid && !state.isSubmitting ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            {state.isSubmitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-page-bg)] border-t-transparent" />
            ) : (
              <>
                {t('submitButton')}
                <SendIcon />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
