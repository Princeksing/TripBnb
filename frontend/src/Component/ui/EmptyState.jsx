import React from 'react'
import { HiOutlineHome } from 'react-icons/hi'

function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mb-4">
        <HiOutlineHome className="w-8 h-8 text-brand-gray" />
      </div>
      <h3 className="text-xl font-semibold text-brand-dark mb-2">{title}</h3>
      {description && (
        <p className="text-brand-gray max-w-md mb-6">{description}</p>
      )}
      {action}
    </div>
  )
}

export default EmptyState
