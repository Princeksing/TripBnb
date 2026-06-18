import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { authDataContext } from '../Context/AuthContext'
import { userDataContext } from '../Context/UserContext'
import BackButton from '../Component/ui/BackButton'
import PageHeader from '../Component/ui/PageHeader'
import Input from '../Component/ui/Input'
import Button from '../Component/ui/Button'
import Card from '../Component/Card'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getListingImages, getListingPrice } from '../utils/listingHelper'

function Profile() {
  const navigate = useNavigate()
  const { serverUrl } = useContext(authDataContext)
  const { userData, getCurrentUser } = useContext(userDataContext)
  const [tab, setTab] = useState('profile')
  const [name, setName] = useState(userData?.name || '')
  const [phone, setPhone] = useState(userData?.phone || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (userData) {
      setName(userData.name || '')
      setPhone(userData.phone || '')
    }
  }, [userData])

  const tabs = [
    { id: 'profile', label: 'Edit Profile' },
    { id: 'password', label: 'Change Password' },
    { id: 'bookings', label: 'My Bookings' },
    { id: 'listings', label: 'My Listings' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'notifications', label: 'Notifications' },
  ]

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.put(`${serverUrl}/api/user/profile`, { name, phone }, { withCredentials: true })
      await getCurrentUser()
      toast.success('Profile updated')
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.put(`${serverUrl}/api/user/password`, { currentPassword, newPassword }, { withCredentials: true })
      toast.success('Password changed')
      setCurrentPassword('')
      setNewPassword('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatar = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      await axios.post(`${serverUrl}/api/user/avatar`, formData, { withCredentials: true })
      await getCurrentUser()
      toast.success('Avatar updated')
    } catch {
      toast.error('Avatar upload failed')
    }
  }

  const renderListings = (items, emptyMsg) => {
    if (!items?.length) return <p className="text-brand-gray text-center py-8">{emptyMsg}</p>
    return (
      <div className="property-grid">
        {items.map((item) => {
          const list = item.listing || item
          const images = getListingImages(list)
          const price = getListingPrice(list)
          return (
            <Card key={list._id} title={list.title} landMark={list.landMark} city={list.city} images={images} image1={images[0]} image2={images[1]} image3={images[2]} price={price} rent={price} id={list._id} ratings={list.ratings} isBooked={list.isBooked} host={list.host} />
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="page-container py-8 md:py-12">
        <div className="mb-6"><BackButton /></div>
        <PageHeader title="My Profile" subtitle="Manage your account and preferences" />

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 md:p-8 border-b border-brand-border flex flex-col sm:flex-row items-center gap-6">
            <label className="relative cursor-pointer group">
              {userData?.avatar ? (
                <img src={userData.avatar} alt="" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-brand-pink text-white flex items-center justify-center text-2xl font-bold">
                  {userData?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">Edit</span>
            </label>
            <div>
              <h2 className="text-xl font-semibold text-brand-dark">{userData?.name}</h2>
              <p className="text-brand-gray">{userData?.email}</p>
              {userData?.phone && <p className="text-sm text-brand-gray">{userData.phone}</p>}
              <span className="inline-block mt-2 px-3 py-1 bg-brand-light rounded-full text-xs font-medium capitalize">{userData?.role || 'user'}</span>
            </div>
          </div>

          <div className="flex overflow-x-auto scrollbar-hide border-b border-brand-border">
            {tabs.map(({ id, label }) => (
              <button key={id} type="button" className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === id ? 'border-brand-pink text-brand-pink' : 'border-transparent text-brand-gray hover:text-brand-dark'}`} onClick={() => setTab(id)}>
                {label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {tab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="max-w-md space-y-4">
                <Input label="Full name" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Email" id="email" value={userData?.email} disabled />
                <Input label="Phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
              </form>
            )}

            {tab === 'password' && (
              <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                <Input label="Current password" id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                <Input label="New password" id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
                <Button type="submit" disabled={saving}>{saving ? 'Updating...' : 'Change password'}</Button>
              </form>
            )}

            {tab === 'bookings' && renderListings(userData?.booking, 'No bookings yet.')}
            {tab === 'listings' && renderListings(userData?.listing, 'No listings yet.')}
            {tab === 'wishlist' && renderListings(userData?.wishlist, 'Your wishlist is empty.')}

            {tab === 'notifications' && (
              <p className="text-brand-gray text-center py-8">
                Check the bell icon in the navbar for your latest notifications.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <Button variant="secondary" onClick={() => navigate('/mybooking')}>My Bookings</Button>
          <Button variant="secondary" onClick={() => navigate('/mylisting')}>My Listings</Button>
          <Button variant="secondary" onClick={() => navigate('/wishlist')}>Wishlist</Button>
          {userData?.role === 'admin' && <Button onClick={() => navigate('/admin/dashboard')}>Admin Dashboard</Button>}
          {(userData?.listing?.length > 0 || userData?.role === 'host') && (
            <Button onClick={() => navigate('/host/dashboard')}>Host Dashboard</Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
