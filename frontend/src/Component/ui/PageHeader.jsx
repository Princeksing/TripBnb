import React from 'react'

function PageHeader({ title, subtitle, badge }) {
  return (
    <div className="text-center mb-8 md:mb-12">
      {badge && (
        <span className="inline-block px-4 py-1.5 mb-3 text-sm font-medium text-brand-pink bg-brand-pink/10 rounded-full">
          {badge}
        </span>
      )}
      <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-brand-gray text-base md:text-lg">{subtitle}</p>
      )}
    </div>
  )
}

export default PageHeader
