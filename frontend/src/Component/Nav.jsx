import React, { useContext, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { CgProfile } from 'react-icons/cg'
import { MdWhatshot } from 'react-icons/md'
import { GiFamilyHouse } from 'react-icons/gi'
import { MdBedroomParent } from 'react-icons/md'
import { MdOutlinePool } from 'react-icons/md'
import { GiWoodCabin } from 'react-icons/gi'
import { SiHomeassistantcommunitystore } from 'react-icons/si'
import { IoBedOutline } from 'react-icons/io5'
import { FaTreeCity } from 'react-icons/fa6'
import { BiBuildingHouse } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { authDataContext } from '../Context/AuthContext'
import axios from 'axios'
import { userDataContext } from '../Context/UserContext'
import { listingDataContext } from '../Context/ListingContext'
import SearchBar from './SearchBar'
import NotificationBell from './NotificationBell'

const categories = [
  { id: 'trending', label: 'Trending', icon: MdWhatshot },
  { id: 'villa', label: 'Villa', icon: GiFamilyHouse },
  { id: 'farmHouse', label: 'Farm House', icon: FaTreeCity },
  { id: 'poolHouse', label: 'Pool House', icon: MdOutlinePool },
  { id: 'rooms', label: 'Rooms', icon: MdBedroomParent },
  { id: 'flat', label: 'Flat', icon: BiBuildingHouse },
  { id: 'pg', label: 'PG', icon: IoBedOutline },
  { id: 'cabin', label: 'Cabins', icon: GiWoodCabin },
  { id: 'shops', label: 'Shops', icon: SiHomeassistantcommunitystore },
]

function Nav() {
  const [showPopup, setShowPopup] = useState(false)
  const { userData, setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const { serverUrl } = useContext(authDataContext)
  const [cate, setCate] = useState('trending')
  const { listingData, setNewListData } = useContext(listingDataContext)

  const handleLogOut = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true })
      setUserData(null)
      setShowPopup(false)
      navigate('/')
    } catch (error) {
      console.error('[Logout]', error.message)
    }
  }

  const handleCategory = (category) => {
    setCate(category)
    if (category === 'trending') {
      setNewListData(listingData)
    } else {
      setNewListData(listingData.filter((list) => list.category === category))
    }
  }

  return (
    <header className="nav-header fixed top-0 left-0 right-0 z-50 bg-white shadow-nav">
      <div className="page-container nav-top-row">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="nav-logo flex-shrink-0"
        >
          TripBnb
        </button>

        <div className="hidden md:block flex-1 max-w-md mx-4">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 relative flex-shrink-0">
          {userData && <NotificationBell />}
          <button
            type="button"
            className="hidden md:block nav-text-btn"
            onClick={() => navigate('/listingpage1')}
          >
            List your home
          </button>
          <button
            type="button"
            className="nav-menu-btn"
            onClick={() => setShowPopup((prev) => !prev)}
          >
            <GiHamburgerMenu className="w-5 h-5" />
            {userData == null ? (
              <CgProfile className="w-6 h-6 text-brand-gray" />
            ) : (
              <span className="nav-avatar">
                {userData?.name?.slice(0, 1).toUpperCase()}
              </span>
            )}
          </button>

          {showPopup && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-56 bg-white rounded-xl shadow-card border border-brand-border overflow-hidden animate-slide-up z-50">
              <ul className="py-2">
                {!userData && (
                  <li><button type="button" className="nav-dropdown-item" onClick={() => { navigate('/login'); setShowPopup(false) }}>Login</button></li>
                )}
                {userData && (
                  <>
                    <li><button type="button" className="nav-dropdown-item" onClick={() => { navigate('/profile'); setShowPopup(false) }}>My Profile</button></li>
                    <li><button type="button" className="nav-dropdown-item" onClick={() => { navigate('/wishlist'); setShowPopup(false) }}>Wishlist</button></li>
                  </>
                )}
                {(userData?.listing?.length > 0 || userData?.role === 'host') && (
                  <li><button type="button" className="nav-dropdown-item" onClick={() => { navigate('/host/dashboard'); setShowPopup(false) }}>Host Dashboard</button></li>
                )}
                {userData?.role === 'admin' && (
                  <li><button type="button" className="nav-dropdown-item" onClick={() => { navigate('/admin/dashboard'); setShowPopup(false) }}>Admin Dashboard</button></li>
                )}
                {userData && (
                  <li><button type="button" className="nav-dropdown-item" onClick={handleLogOut}>Logout</button></li>
                )}
                <li className="border-t border-brand-border my-1" />
                <li><button type="button" className="nav-dropdown-item" onClick={() => { navigate('/listingpage1'); setShowPopup(false) }}>List your home</button></li>
                <li><button type="button" className="nav-dropdown-item" onClick={() => { navigate('/mylisting'); setShowPopup(false) }}>My Listings</button></li>
                <li><button type="button" className="nav-dropdown-item" onClick={() => { navigate('/mybooking'); setShowPopup(false) }}>My Bookings</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden page-container nav-mobile-search">
        <SearchBar />
      </div>

      <div className="border-t border-brand-border nav-category-row">
        <div className="page-container">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`category-pill ${cate === id ? 'category-pill-active' : ''}`}
                onClick={() => handleCategory(id)}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                <span className="text-xs font-medium whitespace-nowrap">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Nav
