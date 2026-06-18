import React from 'react'

const variants = {
  primary: 'bg-brand-pink text-white hover:bg-brand-pink-dark active:scale-[0.98]',
  secondary: 'bg-white text-brand-dark border border-brand-border hover:bg-brand-light',
  ghost: 'bg-transparent text-brand-dark hover:bg-brand-light',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-3.5 text-base font-semibold',
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
