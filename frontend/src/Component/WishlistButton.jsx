import React, { useContext, useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { wishlistContext } from '../Context/WishlistContext'

function WishlistButton({ listingId, className = '' }) {
  const { isWishlisted, toggleWishlist } = useContext(wishlistContext)
  const [loading, setLoading] = useState(false)
  const saved = isWishlisted(listingId)

  const handleClick = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setLoading(true)
    await toggleWishlist(listingId)
    setLoading(false)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform z-10 ${className}`}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
    >
      {saved ? (
        <FaHeart className="w-5 h-5 text-brand-pink" />
      ) : (
        <FaRegHeart className="w-5 h-5 text-brand-dark" />
      )}
    </button>
  )
}

export default WishlistButton
