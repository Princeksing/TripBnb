import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import { userDataContext } from './UserContext'
import { listingDataContext } from './ListingContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const bookingDataContext = createContext()

const BOOKING_STORAGE_KEY = 'tripbnb_active_booking'

function saveBookingToStorage(booking) {
  if (booking) {
    sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking))
  } else {
    sessionStorage.removeItem(BOOKING_STORAGE_KEY)
  }
}

function loadBookingFromStorage() {
  try {
    const raw = sessionStorage.getItem(BOOKING_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function BookingContext({ children }) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [total, setTotal] = useState(0)
  const [night, setNight] = useState(0)
  const { serverUrl } = useContext(authDataContext)
  const { getCurrentUser } = useContext(userDataContext)
  const { getListing } = useContext(listingDataContext)
  const [bookingData, setBookingDataState] = useState(loadBookingFromStorage)
  const [booking, setBooking] = useState(false)
  const navigate = useNavigate()

  const setBookingData = (data) => {
    setBookingDataState(data)
    saveBookingToStorage(data)
  }

  const handleBooking = async (id) => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    if (night <= 0) {
      toast.error('Check-out must be after check-in')
      return
    }

    setBooking(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/booking/create/${id}`,
        { checkIn, checkOut, guestCount },
        { withCredentials: true }
      )
      setBookingData(result.data)
      toast.success('Booking created — complete payment to confirm')
      navigate('/payment')
    } catch (error) {
      setBookingData(null)
      toast.error(error.response?.data?.message || 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  const confirmBookingAfterPayment = async (bookingResult) => {
    setBookingData(bookingResult)
    await getCurrentUser()
    await getListing()
  }

  const cancelBooking = async (id) => {
    try {
      await axios.delete(`${serverUrl}/api/booking/cancel/${id}`, { withCredentials: true })
      await getCurrentUser()
      await getListing()
      toast.success('Booking cancelled')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancel failed')
    }
  }

  useEffect(() => {
    const stored = loadBookingFromStorage()
    if (stored && !bookingData) {
      setBookingDataState(stored)
    }
  }, [])

  const value = {
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    guestCount, setGuestCount,
    total, setTotal,
    night, setNight,
    bookingData, setBookingData,
    handleBooking, cancelBooking, booking,
    confirmBookingAfterPayment,
  }

  return (
    <bookingDataContext.Provider value={value}>
      {children}
    </bookingDataContext.Provider>
  )
}

export default BookingContext
