import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children:  ReactNode;
  variant?:  'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?:     'xs' | 'sm' | 'md' | 'lg';
  loading?:  boolean;
  fullWidth?: boolean;
  icon?:     ReactNode;
}

const variantClass: Record<string, string> = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
  outline:   'btn-outline',
};

const sizeClass: Record<string, string> = {
  xs: 'px-2.5 py-1   text-xs   rounded-md gap-1',
  sm: 'px-3   py-1.5 text-sm   rounded-md gap-1.5',
  md: 'px-4   py-2   text-sm   rounded-lg gap-2',
  lg: 'px-5   py-2.5 text-base rounded-lg gap-2',
};

export default function Button({
  children, variant = 'primary', size = 'md',
  loading = false, fullWidth = false,
  icon, className = '', disabled, ...rest
}: Props) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center font-medium cursor-pointer',
        'transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2',
        variantClass[variant],
        sizeClass[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
      {children}
    </button>
  );
}
