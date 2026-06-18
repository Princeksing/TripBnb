import React from 'react'
import Nav from '../Component/Nav'

function MainLayout({ children, showNav = true, className = '' }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {showNav && <Nav />}
      <main className={`flex-1 ${showNav ? 'pt-[var(--nav-height)]' : ''} ${className}`}>
        {children}
      </main>
    </div>
  )
}

export default MainLayout
