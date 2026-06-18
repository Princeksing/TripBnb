import React from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

function BackButton({ to = '/', className = '' }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={`w-10 h-10 flex items-center justify-center rounded-full border border-brand-border bg-white text-brand-dark hover:shadow-card transition-all duration-200 ${className}`}
      aria-label="Go back"
    >
      <FaArrowLeftLong className="w-4 h-4" />
    </button>
  )
}

export default BackButton
