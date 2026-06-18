import React from 'react'

function HostInfo({ host, createdAt }) {
  const hostName = host?.name || 'TripBnb Host'
  const initial = hostName.charAt(0).toUpperCase()
  const joinedYear = createdAt ? new Date(createdAt).getFullYear() : '2024'

  return (
    <div className="border border-brand-border rounded-2xl p-6">
      <h3 className="font-semibold text-brand-dark text-lg mb-4">Meet your host</h3>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-dark text-white flex items-center justify-center text-xl font-semibold">
          {initial}
        </div>
        <div>
          <p className="font-semibold text-brand-dark">{hostName}</p>
          <p className="text-sm text-brand-gray">Host since {joinedYear}</p>
          {host?.email && (
            <p className="text-sm text-brand-gray mt-1">{host.email}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default HostInfo
