import React from 'react'
import BackButton from '../Component/ui/BackButton'
import PageHeader from '../Component/ui/PageHeader'

function StaticPage({ title, children }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="page-container py-8 md:py-12 max-w-3xl">
        <div className="mb-8">
          <BackButton />
        </div>
        <PageHeader title={title} />
        <div className="prose prose-gray max-w-none text-brand-gray leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default StaticPage
