export interface AuthUser {
  id: string;
  /** Google OAuth sub (provider user ID) */
  sub: string;
  email: string;
  name: string;
  avatar_url: string;
  preferred_locale: 'vi' | 'en';
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  expires_at: number;
}
