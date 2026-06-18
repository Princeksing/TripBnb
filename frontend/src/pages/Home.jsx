import React, { useContext, useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import HeroSlider from '../Component/HeroSlider'
import Card from '../Component/Card'
import { listingDataContext } from '../Context/ListingContext'
import { authDataContext } from '../Context/AuthContext'
import { PropertyGridSkeleton } from '../Component/ui/Skeleton'
import EmptyState from '../Component/ui/EmptyState'
import ErrorState from '../Component/ui/ErrorState'
import Button from '../Component/ui/Button'
import { useNavigate } from 'react-router-dom'
import { getListingImages, getListingPrice } from '../utils/listingHelper'
import { fallbackStats } from '../data/fallbackListings'
import { getRecentlyViewed } from '../utils/recentlyViewed'
import { filterListings, addRecentSearch } from '../utils/searchHelper'
import axios from 'axios'
import { toast } from 'react-toastify'

function Home() {
  const navigate = useNavigate()
  const { newListData, listingLoading, listingError, getListing, handleSearch, setNewListData, listingData } = useContext(listingDataContext)
  const { serverUrl } = useContext(authDataContext)
  const [stats, setStats] = useState({ users: 0, bookings: 0, properties: 0 })
  const [openFaq, setOpenFaq] = useState(null)
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [email, setEmail] = useState('')

  useEffect(() => {
    axios.get(`${serverUrl}/api/stats`)
      .then((r) => setStats(r.data))
      .catch(() => setStats(fallbackStats))
  }, [serverUrl, newListData])

  useEffect(() => {
    setRecentlyViewed(getRecentlyViewed())
  }, [newListData])

  const featured = newListData?.slice(0, 4) || []
  const trending = [...(listingData || newListData)]
    .sort((a, b) => (b.ratings || 0) - (a.ratings || 0))
    .slice(0, 4)
  const recommended = newListData?.filter((l) => !featured.find((f) => f._id === l._id)).slice(0, 4) || []
  const destinations = [...new Set(newListData?.map((l) => l.city).filter(Boolean))].slice(0, 6)

  const handleDestinationClick = (city) => {
    addRecentSearch(city)
    handleSearch(city)
    const filtered = filterListings(listingData || newListData, city)
    setNewListData(filtered.length > 0 ? filtered : newListData)
    window.scrollTo({ top: 500, behavior: 'smooth' })
    toast.info(`Showing stays in ${city}`)
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }
    toast.success('Thanks for subscribing!')
    setEmail('')
  }

  const faqs = [
    { q: 'How do I book a stay?', a: 'Search for a destination, pick dates, and complete payment via UPI QR code.' },
    { q: 'Can I cancel my booking?', a: 'Yes, go to My Bookings and cancel. Refund policy applies based on timing.' },
    { q: 'How do I list my property?', a: 'Click List your home, upload 5–10 photos, set your price, and publish.' },
  ]

  const renderCard = (list) => {
    const images = getListingImages(list)
    const price = getListingPrice(list)
    return (
      <Card
        key={list._id}
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
        ratings={list.ratings}
        isBooked={list.isBooked}
        host={list.host}
        allowViewWhenBooked
      />
    )
  }

  return (
    <MainLayout>
      <section className="page-container pb-4">
        <HeroSlider />

        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Properties', value: stats.properties || newListData?.length || 0 },
            { label: 'Bookings', value: stats.bookings || 0 },
            { label: 'Happy users', value: stats.users || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-4 md:p-6 bg-brand-light rounded-2xl">
              <p className="text-2xl md:text-3xl font-bold text-brand-pink">{value}+</p>
              <p className="text-sm text-brand-gray mt-1">{label}</p>
            </div>
          ))}
        </div>

        {destinations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-brand-dark mb-4">Popular destinations</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {destinations.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleDestinationClick(city)}
                  className="flex-shrink-0 px-5 py-2.5 bg-white border border-brand-border rounded-full text-sm font-medium hover:border-brand-pink hover:bg-brand-pink/5 transition-all cursor-pointer"
                >
                  {city}
                </button>
              ))}
            </div>
          </section>
        )}
      </section>

      <div className="page-container pb-16">
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-brand-dark">Featured properties</h2>
          <p className="text-brand-gray mt-1">Hand-picked stays for your next trip</p>
        </section>

        {listingLoading && <PropertyGridSkeleton count={8} />}
        {!listingLoading && listingError && (
          <ErrorState title="Could not load properties" description="Please check your connection." onRetry={getListing} />
        )}
        {!listingLoading && !listingError && featured.length === 0 && (
          <EmptyState title="No properties found" action={<Button onClick={() => navigate('/listingpage1')}>List your home</Button>} />
        )}
        {!listingLoading && !listingError && featured.length > 0 && (
          <>
            <div className="property-grid mb-16">
              {featured.map(renderCard)}
            </div>

            {trending.length > 0 && (
              <section className="mb-16">
                <h2 className="text-2xl font-semibold text-brand-dark mb-6">Trending properties</h2>
                <div className="property-grid">
                  {trending.map(renderCard)}
                </div>
              </section>
            )}

            {recentlyViewed.length > 0 && (
              <section className="mb-16">
                <h2 className="text-2xl font-semibold text-brand-dark mb-6">Recently viewed</h2>
                <div className="property-grid">
                  {recentlyViewed.slice(0, 4).map(renderCard)}
                </div>
              </section>
            )}

            {recommended.length > 0 && (
              <section className="mb-16">
                <h2 className="text-2xl font-semibold text-brand-dark mb-6">Recommended for you</h2>
                <div className="property-grid">
                  {recommended.map(renderCard)}
                </div>
              </section>
            )}

            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-brand-dark mb-6">All stays</h2>
              <div className="property-grid">
                {newListData.map(renderCard)}
              </div>
            </section>
          </>
        )}

        <section className="mb-16 bg-brand-light rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-semibold text-brand-dark mb-6">What travelers say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', text: 'Amazing villa in Goa! Booking was smooth and the host was very responsive.' },
              { name: 'Rahul M.', text: 'TripBnb made finding a farm stay easy. Will definitely book again.' },
              { name: 'Ananya K.', text: 'Clean UI, fast booking, and great properties. Highly recommended!' },
            ].map(({ name, text }) => (
              <div key={name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-brand-gray text-sm leading-relaxed">&ldquo;{text}&rdquo;</p>
                <p className="font-semibold text-brand-dark mt-4">{name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-brand-dark mb-4">FAQ</h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={q} className="border border-brand-border rounded-xl overflow-hidden">
                <button type="button" className="w-full text-left px-5 py-4 font-medium flex justify-between items-center hover:bg-brand-light transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {q}
                  <span>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <p className="px-5 pb-4 text-brand-gray text-sm">{a}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="text-center bg-brand-dark text-white rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-semibold mb-2">Stay in the loop</h2>
          <p className="text-white/70 mb-6">Get travel inspiration and exclusive deals</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-brand-dark outline-none"
            />
            <Button type="submit" variant="primary" className="bg-brand-pink hover:bg-brand-pink-dark">Subscribe</Button>
          </form>
        </section>
      </div>
    </MainLayout>
  )
}

export default Home
