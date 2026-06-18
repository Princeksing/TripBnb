import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { listingDataContext } from '../Context/ListingContext'
import BackButton from '../Component/ui/BackButton'
import Input from '../Component/ui/Input'
import Button from '../Component/ui/Button'
import { AMENITIES_LIST } from '../constants/amenities'
import { toast } from 'react-toastify'

function ListingPage1() {
  const navigate = useNavigate()
  const {
    title, setTitle,
    description, setDescription,
    frontEndImages, setFrontEndImages,
    backEndImages, setBackEndImages,
    price, setPrice,
    city, setCity,
    state, setState,
    country, setCountry,
    address, setAddress,
    landmark, setLandmark,
    latitude, setLatitude,
    longitude, setLongitude,
    amenities, setAmenities,
  } = useContext(listingDataContext)

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    if (backEndImages.length + files.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }
    setBackEndImages((prev) => [...prev, ...files])
    setFrontEndImages((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
  }

  const removeImage = (index) => {
    setBackEndImages((prev) => prev.filter((_, i) => i !== index))
    setFrontEndImages((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleAmenity = (item) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (backEndImages.length < 5) {
      toast.error('Please upload at least 5 images')
      return
    }
    navigate('/listingpage2')
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="page-container py-8 md:py-12 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <BackButton />
          <span className="text-sm font-medium text-brand-pink bg-brand-pink/10 px-4 py-2 rounded-full">
            Step 1 of 3
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark mb-2">
          Tell us about your place
        </h1>
        <p className="text-brand-gray mb-8">
          Upload 5–10 photos and share property details
        </p>

        <form className="bg-white rounded-2xl shadow-card p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Title"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Cozy 2BHK with mountain view"
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="des" className="text-sm font-medium text-brand-dark">Description</label>
            <textarea
              id="des"
              className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark min-h-[100px] resize-y"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your property..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-brand-dark">
                Photos ({backEndImages.length}/10)
              </label>
              <span className="text-xs text-brand-gray">Minimum 5 required</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {frontEndImages.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {backEndImages.length < 10 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-brand-border hover:border-brand-pink transition-colors cursor-pointer flex items-center justify-center bg-brand-light">
                  <span className="text-brand-gray text-sm text-center px-2">+ Add photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImages}
                  />
                </label>
              )}
            </div>
          </div>

          <Input
            label="Price per night (₹)"
            id="price"
            type="number"
            required
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="2500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="City" id="city" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Goa" />
            <Input label="State" id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="Goa" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Country" id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" />
            <Input label="Landmark / Area" id="landmark" required value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Near Baga Beach" />
          </div>

          <Input label="Full address" id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, area, pin code" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Latitude" id="latitude" type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="15.2993" />
            <Input label="Longitude" id="longitude" type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="74.1240" />
          </div>

          <div>
            <label className="text-sm font-medium text-brand-dark mb-3 block">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITIES_LIST.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                    amenities.includes(item)
                      ? 'border-brand-dark bg-brand-light font-medium'
                      : 'border-brand-border hover:border-brand-gray'
                  }`}
                  onClick={() => toggleAmenity(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ListingPage1
