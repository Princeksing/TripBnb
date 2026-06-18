import React from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import Button from './Button'

function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <HiOutlineExclamationCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-brand-dark mb-2">{title}</h3>
      {description && (
        <p className="text-brand-gray max-w-md mb-6">{description}</p>
      )}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export default ErrorState
