import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-bold cursor-pointer transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-[var(--color-btn-login)] text-[var(--color-btn-login-text)] rounded-[8px] hover:brightness-105 hover:shadow-md active:scale-[0.98]',
    ghost: 'bg-transparent text-white border border-white/30 rounded-[4px] hover:bg-white/10',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
