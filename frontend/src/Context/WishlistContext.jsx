import React, { createContext, useContext, useCallback } from 'react'
import axios from 'axios'
import { authDataContext } from './AuthContext'
import { userDataContext } from './UserContext'
import { toast } from 'react-toastify'

export const wishlistContext = createContext()

function WishlistContext({ children }) {
  const { serverUrl } = useContext(authDataContext)
  const { userData, getCurrentUser } = useContext(userDataContext)

  const isWishlisted = useCallback((listingId) => {
    return userData?.wishlist?.some((item) => (item._id || item) === listingId)
  }, [userData])

  const toggleWishlist = async (listingId) => {
    if (!userData) {
      toast.info('Please login to save properties')
      return false
    }
    try {
      if (isWishlisted(listingId)) {
        await axios.delete(`${serverUrl}/api/user/wishlist/${listingId}`, { withCredentials: true })
        toast.success('Removed from wishlist')
      } else {
        await axios.post(`${serverUrl}/api/user/wishlist/${listingId}`, {}, { withCredentials: true })
        toast.success('Saved to wishlist')
      }
      await getCurrentUser()
      return true
    } catch (error) {
      toast.error('Wishlist update failed')
      return false
    }
  }

  return (
    <wishlistContext.Provider value={{ isWishlisted, toggleWishlist, wishlist: userData?.wishlist || [] }}>
      {children}
    </wishlistContext.Provider>
  )
}

export default WishlistContext
