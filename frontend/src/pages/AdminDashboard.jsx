import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { authDataContext } from '../Context/AuthContext'
import { userDataContext } from '../Context/UserContext'
import { Navigate } from 'react-router-dom'
import BackButton from '../Component/ui/BackButton'
import PageHeader from '../Component/ui/PageHeader'
import Button from '../Component/ui/Button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

function AdminDashboard() {
  const { serverUrl } = useContext(authDataContext)
  const { userData } = useContext(userDataContext)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [listings, setListings] = useState([])
  const [bookings, setBookings] = useState([])
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    if (userData?.role !== 'admin') return
    const load = async () => {
      try {
        const [s, u, l, b] = await Promise.all([
          axios.get(`${serverUrl}/api/admin/stats`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/admin/users`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/admin/listings`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/admin/bookings`, { withCredentials: true }),
        ])
        setStats(s.data)
        setUsers(u.data)
        setListings(l.data)
        setBookings(b.data)
      } catch (e) {
        console.log(e)
      }
    }
    load()
  }, [serverUrl, userData])

  if (userData && userData.role !== 'admin') {
    return <Navigate to="/" />
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    await axios.delete(`${serverUrl}/api/admin/users/${id}`, { withCredentials: true })
    setUsers((prev) => prev.filter((u) => u._id !== id))
  }

  const deleteListing = async (id) => {
    if (!window.confirm('Delete this listing?')) return
    await axios.delete(`${serverUrl}/api/admin/listings/${id}`, { withCredentials: true })
    setListings((prev) => prev.filter((l) => l._id !== id))
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="page-container py-8 md:py-12">
        <div className="mb-6"><BackButton /></div>
        <PageHeader title="Admin Dashboard" subtitle="Manage platform users, listings, and analytics" badge="Admin" />

        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
          {['overview', 'users', 'listings', 'bookings'].map((t) => (
            <button key={t} type="button" className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap ${tab === t ? 'bg-brand-pink text-white' : 'bg-white text-brand-gray border border-brand-border'}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && stats && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Users', value: stats.totalUsers },
                { label: 'Properties', value: stats.totalListings },
                { label: 'Bookings', value: stats.totalBookings },
                { label: 'Revenue', value: `₹${stats.revenue?.toLocaleString('en-IN')}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-2xl shadow-card p-6">
                  <p className="text-sm text-brand-gray">{label}</p>
                  <p className="text-2xl font-bold text-brand-dark mt-2">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-semibold mb-4">Booking growth</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#FF385C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-semibold mb-4">Revenue growth</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#FF385C" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {tab === 'users' && (
          <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-light"><tr><th className="p-4 text-left">Name</th><th className="p-4 text-left">Email</th><th className="p-4 text-left">Role</th><th className="p-4 text-left">Action</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-brand-border">
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4 capitalize">{u.role}</td>
                    <td className="p-4"><Button variant="danger" size="sm" onClick={() => deleteUser(u._id)}>Delete</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'listings' && (
          <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-light"><tr><th className="p-4 text-left">Title</th><th className="p-4 text-left">City</th><th className="p-4 text-left">Host</th><th className="p-4 text-left">Action</th></tr></thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l._id} className="border-t border-brand-border">
                    <td className="p-4">{l.title}</td>
                    <td className="p-4">{l.city}</td>
                    <td className="p-4">{l.host?.name || l.host?.email}</td>
                    <td className="p-4"><Button variant="danger" size="sm" onClick={() => deleteListing(l._id)}>Delete</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'bookings' && (
          <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-light"><tr><th className="p-4 text-left">Listing</th><th className="p-4 text-left">Guest</th><th className="p-4 text-left">Amount</th><th className="p-4 text-left">Status</th></tr></thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-t border-brand-border">
                    <td className="p-4">{b.listing?.title}</td>
                    <td className="p-4">{b.guest?.name}</td>
                    <td className="p-4">₹{(b.finalAmount || b.totalRent)?.toLocaleString('en-IN')}</td>
                    <td className="p-4 capitalize">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
