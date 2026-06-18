import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { listingDataContext } from '../Context/ListingContext'
import { getListingImages } from '../utils/listingHelper'
import Button from './ui/Button'

const SLIDES = [
  { title: 'Luxury Villas', subtitle: 'Private pools & sea views', category: 'villa', cta: 'Explore villas' },
  { title: 'Pool Houses', subtitle: 'Infinity pools & sunset terraces', category: 'poolHouse', cta: 'View pool stays' },
  { title: 'Farm Houses', subtitle: 'Escape to nature & fresh air', category: 'farmHouse', cta: 'Find farm retreats' },
  { title: 'Mountain Cabins', subtitle: 'Rustic stays with panoramic views', category: 'cabin', cta: 'Discover cabins' },
  { title: 'Premium Apartments', subtitle: 'City flats with modern amenities', category: 'flat', cta: 'Browse apartments' },
]

function HeroSlider() {
  const navigate = useNavigate()
  const { listingData, setNewListData } = useContext(listingDataContext)
  const [index, setIndex] = useState(0)

  const slides = useMemo(() => {
    return SLIDES.map((slide) => {
      const match = listingData?.find((l) => l.category === slide.category)
      const images = match ? getListingImages(match) : []
      return {
        ...slide,
        image: images[0] || '/assets/properties/villa1/1.jpg',
        listingId: match?._id,
      }
    })
  }, [listingData])

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const current = slides[index]

  const goTo = (i) => setIndex((i + slides.length) % slides.length)

  const handleCta = () => {
    if (current.listingId) {
      navigate(`/listing/${current.listingId}`)
    } else {
      setNewListData(listingData.filter((l) => l.category === current.category))
      window.scrollTo({ top: 500, behavior: 'smooth' })
    }
  }

  return (
    <section className="relative w-full h-[420px] md:h-[520px] rounded-3xl overflow-hidden mb-12 group">
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight animate-fade-in">
          {current.title}
        </h1>
        <p className="text-white/85 mt-3 text-lg md:text-xl">{current.subtitle}</p>
        <Button size="lg" className="mt-6 w-fit bg-brand-pink hover:bg-brand-pink-dark" onClick={handleCta}>
          {current.cta}
        </Button>
      </div>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        aria-label="Next slide"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSlider
