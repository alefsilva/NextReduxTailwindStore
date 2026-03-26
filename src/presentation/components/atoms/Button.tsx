import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 focus-visible:ring-brand-500',
  secondary:
    'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 focus-visible:ring-neutral-400',
  ghost:
    'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-neutral-400',
};

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5
        text-body-sm font-medium transition-colors duration-normal
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
