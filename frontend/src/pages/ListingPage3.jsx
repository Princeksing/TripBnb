import React, { useContext } from 'react'
import { listingDataContext } from '../Context/ListingContext'
import BackButton from '../Component/ui/BackButton'
import Button from '../Component/ui/Button'
import { FaStar } from 'react-icons/fa'
import { AMENITY_ICONS } from '../constants/amenities'

function ListingPage3() {
  const {
    title, description, frontEndImages,
    price, city, state, landmark, category, amenities,
    handleAddListing, adding,
  } = useContext(listingDataContext)

  return (
    <div className="min-h-screen bg-white">
      <div className="page-container py-8 md:py-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <BackButton to="/listingpage2" />
          <span className="text-sm font-medium text-brand-pink bg-brand-pink/10 px-4 py-2 rounded-full">
            Step 3 of 3 — Preview
          </span>
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-brand-dark mb-6">
          {landmark}, {city}{state ? `, ${state}` : ''}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-6">
          {frontEndImages.slice(0, 5).map((img, i) => (
            <div key={i} className={`${i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto md:h-full' : 'aspect-square'} overflow-hidden`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-brand-dark">{title}</h2>
            <span className="flex items-center gap-1 text-sm text-brand-gray">
              <FaStar className="text-brand-pink" /> New listing
            </span>
          </div>
          <p className="text-brand-gray capitalize">{category?.replace(/([A-Z])/g, ' $1')}</p>
          <p className="text-brand-dark leading-relaxed">{description}</p>
          <p className="text-2xl font-semibold text-brand-dark">
            ₹{Number(price).toLocaleString('en-IN')}
            <span className="text-base font-normal text-brand-gray"> / night</span>
          </p>

          {amenities?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {amenities.map((a) => (
                <span key={a} className="px-3 py-1.5 bg-brand-light rounded-lg text-sm">
                  {AMENITY_ICONS[a]} {a}
                </span>
              ))}
            </div>
          )}
        </div>

        <Button size="lg" className="w-full md:w-auto" onClick={handleAddListing} disabled={adding}>
          {adding ? 'Publishing...' : 'Publish listing'}
        </Button>
      </div>
    </div>
  )
}

export default ListingPage3
