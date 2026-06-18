import React from 'react'

function Input({ label, id, error, className = '', containerClassName = '', ...props }) {
  return (
    <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-brand-dark">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-3 border border-brand-border rounded-xl text-base text-brand-dark placeholder:text-brand-muted outline-none transition-all duration-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  )
}

export default Input
