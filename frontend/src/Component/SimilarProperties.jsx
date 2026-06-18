import React, { useContext } from 'react'
import { listingDataContext } from '../Context/ListingContext'
import Card from './Card'
import { getListingImages, getListingPrice } from '../utils/listingHelper'

function SimilarProperties({ currentId, category, city }) {
  const { listingData } = useContext(listingDataContext)

  const similar = listingData
    ?.filter((l) => l._id !== currentId && (l.category === category || l.city === city))
    ?.slice(0, 4)

  if (!similar?.length) return null

  return (
    <section className="mt-12 pt-8 border-t border-brand-border">
      <h3 className="text-xl font-semibold text-brand-dark mb-6">Similar stays you may like</h3>
      <div className="property-grid">
        {similar.map((list) => {
          const images = getListingImages(list)
          const price = getListingPrice(list)
          return (
            <Card
              key={list._id}
              title={list.title}
              landMark={list.landMark}
              city={list.city}
              images={images}
              image1={images[0]}
              image2={images[1]}
              image3={images[2]}
              price={price}
              rent={price}
              id={list._id}
              ratings={list.ratings}
              isBooked={list.isBooked}
              host={list.host}
            />
          )
        })}
      </div>
    </section>
  )
}

export default SimilarProperties
