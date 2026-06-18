import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../Context/UserContext'
import Card from '../Component/Card'
import BackButton from '../Component/ui/BackButton'
import PageHeader from '../Component/ui/PageHeader'
import EmptyState from '../Component/ui/EmptyState'
import Button from '../Component/ui/Button'
import { PropertyGridSkeleton } from '../Component/ui/Skeleton'
import { getListingImages, getListingPrice } from '../utils/listingHelper'

function MyBooking() {
  const navigate = useNavigate()
  const { userData, getCurrentUser } = useContext(userDataContext)
  const [loading, setLoading] = React.useState(!userData?.booking?.length)

  useEffect(() => {
    const refresh = async () => {
      setLoading(true)
      await getCurrentUser()
      setLoading(false)
    }
    refresh()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="page-container py-8 md:py-12">
        <div className="mb-8">
          <BackButton />
        </div>

        <PageHeader title="My Bookings" subtitle="View and manage your upcoming stays" />

        {loading && <PropertyGridSkeleton count={4} />}

        {!loading && userData?.booking?.length > 0 ? (
          <div className="property-grid">
            {userData.booking.map((item) => {
              const list = item.listing || item
              const images = getListingImages(list)
              const price = getListingPrice(list)
              return (
                <Card
                  key={list._id || item._id}
                  title={list.title}
                  landMark={list.landMark}
                  city={list.city}
                  category={list.category}
                  images={images}
                  image1={images[0]}
                  image2={images[1]}
                  image3={images[2]}
                  price={price}
                  rent={price}
                  id={list._id}
                  isBooked={list.isBooked ?? true}
                  ratings={list.ratings}
                  host={list.host}
                  allowViewWhenBooked
                />
              )
            })}
          </div>
        ) : !loading && (
          <EmptyState
            title="No bookings yet"
            description="Explore unique stays and book your next adventure."
            action={<Button onClick={() => navigate('/')}>Explore stays</Button>}
          />
        )}
      </div>
    </div>
  )
}

export default MyBooking
