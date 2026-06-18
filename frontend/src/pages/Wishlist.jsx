import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../Context/UserContext'
import Card from '../Component/Card'
import BackButton from '../Component/ui/BackButton'
import PageHeader from '../Component/ui/PageHeader'
import EmptyState from '../Component/ui/EmptyState'
import Button from '../Component/ui/Button'
import { getListingImages, getListingPrice } from '../utils/listingHelper'

function Wishlist() {
  const navigate = useNavigate()
  const { userData } = useContext(userDataContext)

  return (
    <div className="min-h-screen bg-white">
      <div className="page-container py-8 md:py-12">
        <div className="mb-8"><BackButton /></div>
        <PageHeader title="My Wishlist" subtitle="Properties you've saved for later" />

        {userData?.wishlist?.length > 0 ? (
          <div className="property-grid">
            {userData.wishlist.map((list) => {
              const images = getListingImages(list)
              const price = getListingPrice(list)
              return (
                <Card key={list._id} title={list.title} landMark={list.landMark} city={list.city} images={images} image1={images[0]} image2={images[1]} image3={images[2]} price={price} rent={price} id={list._id} ratings={list.ratings} isBooked={list.isBooked} host={list.host} />
              )
            })}
          </div>
        ) : (
          <EmptyState title="Wishlist is empty" description="Save properties you love by clicking the heart icon." action={<Button onClick={() => navigate('/')}>Explore stays</Button>} />
        )}
      </div>
    </div>
  )
}

export default Wishlist
