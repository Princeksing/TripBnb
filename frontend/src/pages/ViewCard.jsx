import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { listingDataContext } from '../Context/ListingContext'
import { userDataContext } from '../Context/UserContext'
import { RxCross2 } from 'react-icons/rx'
import axios from 'axios'
import { authDataContext } from '../Context/AuthContext'
import { FaStar } from 'react-icons/fa'
import { bookingDataContext } from '../Context/BookingContext'
import { toast } from 'react-toastify'
import BackButton from '../Component/ui/BackButton'
import Button from '../Component/ui/Button'
import Input from '../Component/ui/Input'
import ImageGallery from '../Component/ImageGallery'
import PropertyMap from '../Component/PropertyMap'
import SimilarProperties from '../Component/SimilarProperties'
import HostInfo from '../Component/HostInfo'
import ReviewSection from '../Component/ReviewSection'
import PriceBreakdown from '../Component/PriceBreakdown'
import { getListingImages, getListingPrice, getPriceLabel } from '../utils/listingHelper'
import { calculateBookingPrice } from '../utils/pricing'
import { addRecentlyViewed } from '../utils/recentlyViewed'
import { AMENITY_ICONS } from '../constants/amenities'
import { fallbackListings } from '../data/fallbackListings'
import PropertyHighlights from '../Component/PropertyHighlights'
import AvailabilityCalendar from '../Component/AvailabilityCalendar'
import { PropertyGridSkeleton } from '../Component/ui/Skeleton'

function ViewCard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cardDetails, setCardDetails } = useContext(listingDataContext)
  const { userData } = useContext(userDataContext)
  const [property, setProperty] = useState(cardDetails)
  const [loading, setLoading] = useState(!cardDetails)
  const [updatePopUp, setUpdatePopUp] = useState(false)
  const [bookingPopUp, setBookingPopUp] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [newImages, setNewImages] = useState([])
  const [price, setPrice] = useState('')
  const [city, setCity] = useState('')
  const [landmark, setLandmark] = useState('')
  const { serverUrl } = useContext(authDataContext)
  const { updating, setUpdating, deleting, setDeleting } = useContext(listingDataContext)
  const [minDate, setMinDate] = useState('')

  const {
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    guestCount, setGuestCount,
    setTotal,
    night, setNight,
    handleBooking, booking,
  } = useContext(bookingDataContext)

  useEffect(() => {
    const loadProperty = async () => {
      const propertyId = id || cardDetails?._id
      if (!propertyId) return
      if (cardDetails?._id === propertyId) {
        setProperty(cardDetails)
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const result = await axios.get(`${serverUrl}/api/listing/findlistingbyid/${propertyId}`)
        setProperty(result.data)
        setCardDetails(result.data)
      } catch {
        const demo = fallbackListings.find((l) => l._id === propertyId)
        if (demo) {
          setProperty(demo)
          setCardDetails(demo)
        } else {
          toast.error('Could not load property')
        }
      } finally {
        setLoading(false)
      }
    }
    loadProperty()
  }, [id, cardDetails, serverUrl, setCardDetails])

  useEffect(() => {
    if (property) {
      setTitle(property.title || '')
      setDescription(property.description || '')
      setPrice(String(getListingPrice(property)))
      setCity(property.city || '')
      setLandmark(property.landMark || '')
      addRecentlyViewed(property)
    }
  }, [property])

  const images = getListingImages(property)
  const listingPrice = getListingPrice(property)
  const priceUnit = getPriceLabel(property?.category)

  const checkoutMin = useMemo(() => {
    if (!checkIn) return minDate
    const next = new Date(checkIn)
    next.setDate(next.getDate() + 1)
    return next.toISOString().split('T')[0]
  }, [checkIn, minDate])

  const priceBreakdown = useMemo(() => {
    if (!checkIn || !checkOut || !listingPrice) {
      return { nights: 0, finalAmount: 0 }
    }
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (24 * 60 * 60 * 1000))
    return calculateBookingPrice(listingPrice, nights, guestCount)
  }, [checkIn, checkOut, listingPrice, guestCount])

  useEffect(() => {
    setNight(priceBreakdown.nights || 0)
    setTotal(priceBreakdown.finalAmount || 0)
  }, [priceBreakdown, setNight, setTotal])

  useEffect(() => {
    setMinDate(new Date().toISOString().split('T')[0])
  }, [])

  // Reset checkout if it becomes invalid after check-in change
  useEffect(() => {
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      setCheckOut('')
    }
  }, [checkIn, checkOut, setCheckOut])

  if (loading) {
    return (
      <div className="page-container py-12">
        <PropertyGridSkeleton count={1} />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-brand-gray">Property not found</p>
      </div>
    )
  }

  const isHost = property.host === userData?._id || property.host?._id === userData?._id
  const isBookedByOther = property.isBooked && !isHost
  const canBook = !isHost && !isBookedByOther && listingPrice > 0

  const handleUpdateListing = async () => {
    setUpdating(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('rent', price)
      formData.append('city', city)
      formData.append('landMark', landmark)
      if (newImages.length > 0) {
        newImages.forEach((file) => formData.append('images', file))
      }
      await axios.post(`${serverUrl}/api/listing/update/${property._id}`, formData, { withCredentials: true })
      toast.success('Listing updated')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteListing = async () => {
    setDeleting(true)
    try {
      await axios.delete(`${serverUrl}/api/listing/delete/${property._id}`, { withCredentials: true })
      toast.success('Listing deleted')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const startBooking = () => {
    if (!userData) {
      toast.info('Please login to book this property')
      navigate('/login')
      return
    }
    if (isBookedByOther) {
      toast.info('This property is currently booked')
      return
    }
    if (listingPrice <= 0) {
      toast.error('This property has no valid price')
      return
    }
    setBookingPopUp(true)
  }

  const submitBooking = () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select both dates')
      return
    }
    if (priceBreakdown.nights <= 0) {
      toast.error('Check-out must be at least one day after check-in')
      return
    }
    handleBooking(property._id)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="page-container py-8 md:py-12">
        <div className="mb-6"><BackButton /></div>

        <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark mb-6">
          {property.landMark}, {property.city}
        </h1>

        <ImageGallery images={images} title={property.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-brand-dark">{property.title}</h2>
              <p className="text-brand-gray capitalize mt-1">{property.category?.replace(/([A-Z])/g, ' $1')}</p>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <FaStar className="text-brand-pink" />
                <span className="font-medium">{property.ratings || 'New'}</span>
              </div>
            </div>

            <p className="text-brand-dark leading-relaxed">{property.description}</p>

            <PropertyHighlights amenities={property.amenities} category={property.category} />

            {property.amenities?.length > 0 && (
              <div>
                <h3 className="font-semibold text-brand-dark mb-3">What this place offers</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm">
                      <span>{AMENITY_ICONS[a] || '✓'}</span>{a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <PropertyMap
              latitude={property.latitude}
              longitude={property.longitude}
              title={property.title}
              city={property.city}
              address={property.address || `${property.landMark}, ${property.city}`}
            />

            <HostInfo host={property.host} createdAt={property.createdAt} />

            <AvailabilityCalendar isBooked={property.isBooked} minDate={minDate} />

            {isHost && (
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setUpdatePopUp(true)}>Edit listing</Button>
                <Button variant="danger" onClick={handleDeleteListing} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete listing'}
                </Button>
              </div>
            )}
          </div>

          {!isHost && (
            <div className="lg:sticky lg:top-36 h-fit">
              <div className="border border-brand-border rounded-2xl shadow-card p-6 hover:shadow-lg transition-shadow">
                <p className="text-2xl font-semibold mb-1">
                  ₹{listingPrice?.toLocaleString('en-IN')}
                  <span className="text-base font-normal text-brand-gray"> {priceUnit}</span>
                </p>
                {isBookedByOther && (
                  <p className="text-sm text-amber-600 mt-2">Currently unavailable for booking</p>
                )}
                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={startBooking}
                  disabled={!canBook}
                >
                  {isBookedByOther ? 'Currently booked' : 'Reserve'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <SimilarProperties currentId={property._id} category={property.category} city={property.city} />

        <ReviewSection listingId={property._id} />
      </div>

      {updatePopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6 md:p-8 animate-slide-up">
            <button type="button" className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-light" onClick={() => setUpdatePopUp(false)}>
              <RxCross2 className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-6">Update listing</h2>
            <div className="space-y-4">
              <Input label="Title" id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea className="w-full px-4 py-3 border border-brand-border rounded-xl min-h-[80px]" value={description} onChange={(e) => setDescription(e.target.value)} />
              <input type="file" accept="image/*" multiple onChange={(e) => setNewImages(Array.from(e.target.files))} className="text-sm" />
              <Input label="Price" id="edit-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              <Input label="City" id="edit-city" value={city} onChange={(e) => setCity(e.target.value)} />
              <Input label="Landmark" id="edit-landmark" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
              <Button className="w-full" onClick={handleUpdateListing} disabled={updating}>
                {updating ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {bookingPopUp && canBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 md:p-8 animate-slide-up my-8 shadow-xl">
            <button type="button" className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-light z-10" onClick={() => setBookingPopUp(false)}>
              <RxCross2 className="w-5 h-5" />
            </button>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); submitBooking() }}>
              <h2 className="text-xl font-semibold border-b border-brand-border pb-4">Confirm & book</h2>
              <Input
                label="Check-in"
                id="checkIn"
                type="date"
                min={minDate}
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <Input
                label="Check-out"
                id="checkOut"
                type="date"
                min={checkoutMin}
                required
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                disabled={!checkIn}
              />
              <Input
                label="Guests"
                id="guestCount"
                type="number"
                min="1"
                max="20"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
              />
              <Button
                className="w-full"
                size="lg"
                type="submit"
                disabled={booking || !checkIn || !checkOut || priceBreakdown.nights <= 0}
              >
                {booking ? 'Processing...' : 'Continue to payment'}
              </Button>
            </form>
            <PriceBreakdown breakdown={priceBreakdown} pricePerNight={listingPrice} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewCard
