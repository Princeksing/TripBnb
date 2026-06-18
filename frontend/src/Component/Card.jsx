import React, { useContext, useState } from 'react'
import { userDataContext } from '../Context/UserContext'
import { listingDataContext } from '../Context/ListingContext'
import { FaStar } from 'react-icons/fa'
import { GiConfirmed } from 'react-icons/gi'
import { bookingDataContext } from '../Context/BookingContext'
import WishlistButton from './WishlistButton'
import Button from './ui/Button'
import { getListingImages, getListingPrice, getPriceLabel, FALLBACK_IMAGE } from '../utils/listingHelper'

function Card({
  title, landMark, image1, image2, image3, images, rent, price, city, id,
  ratings, isBooked, host, category, allowViewWhenBooked = false,
}) {
  const { userData } = useContext(userDataContext)
  const { handleViewCard } = useContext(listingDataContext)
  const [popUp, setPopUp] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const { cancelBooking } = useContext(bookingDataContext)

  const allImages = images?.length
    ? images
    : getListingImages({ image1, image2, image3, images })

  const displayPrice = price ?? rent
  const priceUnit = getPriceLabel(category)

  const canNavigate = !isBooked || allowViewWhenBooked

  const handleClick = () => {
    if (canNavigate) handleViewCard(id)
  }

  const handleCancelClick = (e) => {
    e.stopPropagation()
    setPopUp(true)
  }

  return (
    <article
      className="group cursor-pointer animate-fade-in"
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && canNavigate && handleClick()}
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-brand-light">
        <img
          src={allImages[imgIndex] || allImages[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK_IMAGE }}
        />

        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allImages.slice(0, 5).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-white w-2' : 'bg-white/60'}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setImgIndex(i)
                }}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        )}

        <WishlistButton listingId={id} />

        {isBooked && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-green-700 shadow-sm">
            <GiConfirmed className="w-4 h-4" />
            Booked
          </div>
        )}

        {isBooked && host === userData?._id && (
          <button
            type="button"
            className="absolute top-14 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-brand-pink hover:bg-white transition-colors shadow-sm z-10"
            onClick={handleCancelClick}
          >
            Cancel booking
          </button>
        )}

        {popUp && (
          <div
            className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-card animate-slide-up">
              <p className="text-lg font-semibold text-brand-dark mb-2">Cancel booking?</p>
              <p className="text-sm text-brand-gray mb-4">This will free up the property for new guests.</p>
              <div className="flex gap-3">
                <Button variant="danger" size="sm" className="flex-1" onClick={() => { cancelBooking(id); setPopUp(false) }}>
                  Yes, cancel
                </Button>
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setPopUp(false)}>
                  No
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-brand-dark truncate flex-1">
            {landMark}, {city}
          </h3>
          <span className="flex items-center gap-1 text-sm flex-shrink-0">
            <FaStar className="text-brand-pink w-3.5 h-3.5" />
            <span>{ratings || 'New'}</span>
          </span>
        </div>
        <p className="text-brand-gray text-sm truncate">{title}</p>
        <p className="text-brand-dark font-semibold">
          ₹{Number(displayPrice).toLocaleString('en-IN')}
          <span className="font-normal text-brand-gray"> {priceUnit}</span>
        </p>
      </div>
    </article>
  )
}

export default Card
