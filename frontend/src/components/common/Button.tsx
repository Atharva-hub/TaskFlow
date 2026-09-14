import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}