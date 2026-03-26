/** Profile result from recipient autocomplete search */
export interface RecipientProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  department_name: string | null;
}

/** Payload sent to POST /api/kudos */
export interface CreateKudoPayload {
  recipient_id: string;
  title: string;
  content: string;
  hashtag_ids: string[];
  image_urls: string[];
  is_anonymous: boolean;
  anonymous_name?: string;
}

/** Response from POST /api/kudos */
export interface CreateKudoResponse {
  id: string;
  created_at: string;
}

/** Image in the upload queue (client-side state, uploaded to Storage on submit) */
export interface UploadedImage {
  file: File;
  previewUrl: string; // URL.createObjectURL(file) — revoke after submit/remove
  order_index: number;
  hasError?: boolean; // true when file exceeds 10MB
  errorMessage?: string; // e.g. "Ảnh vượt quá 10MB"
}

/** Form validation errors */
export interface WriteKudoErrors {
  recipient?: string;
  title?: string;
  content?: string;
  hashtags?: string;
  images?: string;
  anonymousName?: string;
}

/** Full form state managed by useWriteKudo reducer */
export interface WriteKudoFormState {
  recipient: RecipientProfile | null;
  title: string;
  content: string;
  hashtags: { hashtag_id: string; name: string }[];
  images: UploadedImage[];
  isAnonymous: boolean;
  anonymousName: string;
  errors: WriteKudoErrors;
  isSubmitting: boolean;
}
