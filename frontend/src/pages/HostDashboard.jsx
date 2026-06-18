import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { authDataContext } from '../Context/AuthContext'
import BackButton from '../Component/ui/BackButton'
import PageHeader from '../Component/ui/PageHeader'
import { PropertyGridSkeleton } from '../Component/ui/Skeleton'

function HostDashboard() {
  const { serverUrl } = useContext(authDataContext)
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          axios.get(`${serverUrl}/api/host/stats`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/host/bookings`, { withCredentials: true }),
        ])
        setStats(statsRes.data)
        setBookings(bookingsRes.data)
      } catch {
        console.log('Failed to load host data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [serverUrl])

  const statCards = [
    { label: 'Total Listings', value: stats?.totalListings ?? '—', color: 'text-brand-pink' },
    { label: 'Total Bookings', value: stats?.totalBookings ?? '—', color: 'text-blue-600' },
    { label: 'Revenue', value: stats ? `₹${stats.revenue?.toLocaleString('en-IN')}` : '—', color: 'text-green-600' },
    { label: 'Active Listings', value: stats?.activeListings ?? '—', color: 'text-purple-600' },
  ]

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="page-container py-8 md:py-12">
        <div className="mb-6"><BackButton /></div>
        <PageHeader title="Host Dashboard" subtitle="Track your listings, bookings, and earnings" badge="Host" />

        {loading ? (
          <PropertyGridSkeleton count={4} />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {statCards.map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-2xl shadow-card p-6">
                  <p className="text-sm text-brand-gray">{label}</p>
                  <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="p-6 border-b border-brand-border">
                <h3 className="font-semibold text-brand-dark">Recent bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-brand-light">
                    <tr>
                      <th className="text-left p-4 font-medium">Property</th>
                      <th className="text-left p-4 font-medium">Guest</th>
                      <th className="text-left p-4 font-medium">Dates</th>
                      <th className="text-left p-4 font-medium">Amount</th>
                      <th className="text-left p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-brand-gray">No bookings yet</td></tr>
                    ) : (
                      bookings.slice(0, 10).map((b) => (
                        <tr key={b._id} className="border-t border-brand-border">
                          <td className="p-4">{b.listing?.title || '—'}</td>
                          <td className="p-4">{b.guest?.name || b.guest?.email || '—'}</td>
                          <td className="p-4">{new Date(b.checkIn).toLocaleDateString()} – {new Date(b.checkOut).toLocaleDateString()}</td>
                          <td className="p-4">₹{(b.finalAmount || b.totalRent)?.toLocaleString('en-IN')}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs capitalize ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default HostDashboard
