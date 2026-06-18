import React, { useContext, useEffect } from 'react'
import { GiConfirmed } from 'react-icons/gi'
import { bookingDataContext } from '../Context/BookingContext'
import { useNavigate } from 'react-router-dom'
import Button from '../Component/ui/Button'
import PriceBreakdown from '../Component/PriceBreakdown'
import { formatCurrency } from '../utils/pricing'

const BOOKING_STORAGE_KEY = 'tripbnb_active_booking'

function loadStoredBooking() {
  try {
    const raw = sessionStorage.getItem(BOOKING_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function Booked() {
  const { bookingData } = useContext(bookingDataContext)
  const navigate = useNavigate()
  const booking = bookingData || loadStoredBooking()

  useEffect(() => {
    if (!booking) return
  }, [booking])

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-brand-gray">No booking found.</p>
        <Button onClick={() => navigate('/')}>Go home</Button>
      </div>
    )
  }

  const amount = booking.finalAmount || booking.totalRent
  const breakdown = {
    roomBase: booking.roomBase ?? booking.basePrice,
    extraGuestFee: booking.extraGuestFee || 0,
    basePrice: booking.basePrice,
    cleaningFee: booking.cleaningFee || Math.round(booking.basePrice * 0.05),
    platformFee: booking.platformFee,
    gst: booking.gst || booking.taxes,
    convenienceFee: booking.convenienceFee || 99,
    finalAmount: amount,
    nights: booking.totalDays,
    guestCount: booking.guestCount || 1,
  }

  const listingId = booking.listing?._id || booking.listing

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-card p-8 animate-slide-up">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <GiConfirmed className="w-20 h-20 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-2xl font-semibold text-brand-dark">Booking confirmed!</h1>
          <p className="text-brand-gray mt-2">Your trip is all set. Enjoy your stay.</p>
        </div>

        <div className="space-y-4 border-t border-brand-border pt-6 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-brand-gray">Booking ID</span>
            <span className="font-mono font-medium">{booking._id?.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-gray">Reference</span>
            <span className="font-medium">{booking.bookingReference}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-gray">Property</span>
            <span className="font-medium">{booking.listing?.title || 'Your stay'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-gray">Host</span>
            <span className="font-medium">{booking.host?.name || booking.host?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-gray">Check-in</span>
            <span>{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-gray">Check-out</span>
            <span>{booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : '—'}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-brand-gray">Total paid</span>
            <span className="text-brand-pink">{formatCurrency(amount)}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-brand-dark mb-3">Invoice</h3>
          <PriceBreakdown breakdown={breakdown} showHeader={false} />
        </div>

        <div className="flex flex-col gap-3">
          <Button className="w-full" onClick={() => navigate(`/listing/${listingId}`)}>
            Leave a review
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => navigate('/mybooking')}>
            View my bookings
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => navigate('/')}>
            Back to home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Booked
