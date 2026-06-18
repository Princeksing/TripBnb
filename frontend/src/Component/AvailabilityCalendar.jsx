import React from 'react'

function AvailabilityCalendar({ isBooked, minDate }) {
  const today = new Date(minDate || new Date())
  const days = []
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const end = new Date(today.getFullYear(), today.getMonth() + 2, 0)

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d))
  }

  const monthLabel = (date) =>
    date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  const months = [...new Set(days.map((d) => monthLabel(d)))]

  return (
    <div className="border border-brand-border rounded-2xl p-5">
      <h3 className="font-semibold text-brand-dark mb-1">Availability</h3>
      <p className="text-sm text-brand-gray mb-4">
        {isBooked ? 'Currently booked — select dates after checkout' : 'Select check-in & check-out when you reserve'}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d} className="font-medium text-brand-gray py-1">{d}</span>
        ))}
        {days.slice(0, 35).map((day) => {
          const past = day < new Date(today.toDateString())
          const blocked = isBooked || past
          return (
            <span
              key={day.toISOString()}
              className={`py-2 rounded-lg ${
                blocked
                  ? 'text-brand-muted line-through bg-brand-light'
                  : 'text-brand-dark hover:bg-brand-pink/10'
              }`}
            >
              {day.getDate()}
            </span>
          )
        })}
      </div>
      <p className="text-xs text-brand-gray mt-3">{months.join(' · ')}</p>
    </div>
  )
}

export default AvailabilityCalendar
