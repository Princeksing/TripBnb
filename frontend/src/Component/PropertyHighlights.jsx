import React from 'react'

const DEFAULT_HIGHLIGHTS = [
  'Self check-in available',
  'Great location',
  'Highly rated by guests',
  'Free cancellation before check-in',
]

function PropertyHighlights({ amenities = [], category }) {
  const items = [
    category && { icon: '🏠', text: `${category.replace(/([A-Z])/g, ' $1')} stay` },
    amenities.includes('WiFi') && { icon: '📶', text: 'Fast WiFi included' },
    amenities.includes('Swimming Pool') && { icon: '🏊', text: 'Private pool access' },
    amenities.includes('Parking') && { icon: '🅿️', text: 'Free parking on premises' },
    ...DEFAULT_HIGHLIGHTS.slice(0, 2).map((text) => ({ icon: '✓', text })),
  ].filter(Boolean)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map(({ icon, text }) => (
        <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-brand-light">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium text-brand-dark">{text}</span>
        </div>
      ))}
    </div>
  )
}

export default PropertyHighlights
