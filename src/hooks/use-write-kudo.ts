'use client';

import { useCallback, useReducer } from 'react';
import { uploadKudoImage } from '@/services/image-upload-service';
import type {
  WriteKudoFormState,
  WriteKudoErrors,
  RecipientProfile,
  UploadedImage,
} from '@/types/kudo-write';

// ── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_RECIPIENT'; payload: RecipientProfile | null }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_HASHTAGS'; payload: { hashtag_id: string; name: string }[] }
  | { type: 'ADD_IMAGE'; payload: UploadedImage }
  | { type: 'REMOVE_IMAGE'; payload: number }
  | { type: 'SET_ANONYMOUS'; payload: boolean }
  | { type: 'SET_ANONYMOUS_NAME'; payload: string }
  | { type: 'SET_ERRORS'; payload: WriteKudoErrors }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET' };

const initialState: WriteKudoFormState = {
  recipient: null,
  title: '',
  content: '',
  hashtags: [],
  images: [],
  isAnonymous: false,
  anonymousName: '',
  errors: {},
  isSubmitting: false,
};

function reducer(state: WriteKudoFormState, action: Action): WriteKudoFormState {
  switch (action.type) {
    case 'SET_RECIPIENT':
      return {
        ...state,
        recipient: action.payload,
        errors: { ...state.errors, recipient: undefined },
      };
    case 'SET_TITLE':
      return { ...state, title: action.payload, errors: { ...state.errors, title: undefined } };
    case 'SET_CONTENT':
      return { ...state, content: action.payload, errors: { ...state.errors, content: undefined } };
    case 'SET_HASHTAGS':
      return {
        ...state,
        hashtags: action.payload,
        errors: { ...state.errors, hashtags: undefined },
      };
    case 'ADD_IMAGE':
      return { ...state, images: [...state.images, action.payload] };
    case 'REMOVE_IMAGE':
      return { ...state, images: state.images.filter((_, i) => i !== action.payload) };
    case 'SET_ANONYMOUS':
      return { ...state, isAnonymous: action.payload };
    case 'SET_ANONYMOUS_NAME':
      return {
        ...state,
        anonymousName: action.payload,
        errors: { ...state.errors, anonymousName: undefined },
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function validate(state: WriteKudoFormState): WriteKudoErrors {
  const errors: WriteKudoErrors = {};

  if (!state.recipient) {
    errors.recipient = 'Vui lòng chọn người nhận';
  }
  if (!state.title.trim()) {
    errors.title = 'Vui lòng nhập danh hiệu';
  }
  if (!stripHtml(state.content)) {
    errors.content = 'Vui lòng nhập nội dung';
  }
  if (state.hashtags.length === 0) {
    errors.hashtags = 'Vui lòng chọn ít nhất 1 hashtag';
  }
  if (state.isAnonymous && !state.anonymousName.trim()) {
    errors.anonymousName = 'Vui lòng nhập tên hiển thị';
  }
  if (state.images.some((img) => img.hasError)) {
    errors.images = 'Vui lòng xóa ảnh vượt quá 10MB trước khi gửi';
  }

  return errors;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

interface UseWriteKudoReturn {
  state: WriteKudoFormState;
  setRecipient: (profile: RecipientProfile | null) => void;
  setTitle: (title: string) => void;
  setContent: (html: string) => void;
  setHashtags: (hashtags: { hashtag_id: string; name: string }[]) => void;
  addImage: (image: UploadedImage) => void;
  removeImage: (index: number) => void;
  setAnonymous: (val: boolean) => void;
  setAnonymousName: (name: string) => void;
  submitKudo: () => Promise<boolean>;
  resetForm: () => void;
  isValid: boolean;
}

export function useWriteKudo(
  onSuccess?: () => void,
  defaultRecipient?: RecipientProfile,
): UseWriteKudoReturn {
  const [state, dispatch] = useReducer(
    reducer,
    defaultRecipient ? { ...initialState, recipient: defaultRecipient } : initialState,
  );

  const setRecipient = useCallback(
    (profile: RecipientProfile | null) => dispatch({ type: 'SET_RECIPIENT', payload: profile }),
    [],
  );
  const setTitle = useCallback(
    (title: string) => dispatch({ type: 'SET_TITLE', payload: title }),
    [],
  );
  const setContent = useCallback(
    (html: string) => dispatch({ type: 'SET_CONTENT', payload: html }),
    [],
  );
  const setHashtags = useCallback(
    (hashtags: { hashtag_id: string; name: string }[]) =>
      dispatch({ type: 'SET_HASHTAGS', payload: hashtags }),
    [],
  );
  const addImage = useCallback(
    (image: UploadedImage) => dispatch({ type: 'ADD_IMAGE', payload: image }),
    [],
  );
  const removeImage = useCallback(
    (index: number) => {
      URL.revokeObjectURL(state.images[index]?.previewUrl ?? '');
      dispatch({ type: 'REMOVE_IMAGE', payload: index });
    },
    [state.images],
  );
  const setAnonymous = useCallback(
    (val: boolean) => dispatch({ type: 'SET_ANONYMOUS', payload: val }),
    [],
  );
  const setAnonymousName = useCallback(
    (name: string) => dispatch({ type: 'SET_ANONYMOUS_NAME', payload: name }),
    [],
  );
  const resetForm = useCallback(() => {
    state.images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    dispatch({ type: 'RESET' });
  }, [state.images]);

  const submitKudo = useCallback(async (): Promise<boolean> => {
    const errors = validate(state);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', payload: errors });
      return false;
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true });

    try {
      const imageUrls = await Promise.all(state.images.map((img) => uploadKudoImage(img.file)));

      const res = await fetch('/api/kudos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_id: state.recipient!.id,
          title: state.title,
          content: state.content,
          hashtag_ids: state.hashtags.map((h) => h.hashtag_id),
          image_urls: imageUrls,
          is_anonymous: state.isAnonymous,
          anonymous_name: state.isAnonymous ? state.anonymousName : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create kudo');
      }

      state.images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      dispatch({ type: 'RESET' });
      onSuccess?.();
      return true;
    } catch {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
      return false;
    }
  }, [state, onSuccess]);

  const currentErrors = validate(state);
  const isValid = Object.keys(currentErrors).length === 0;

  return {
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
  };
}
