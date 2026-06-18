import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fallbackListings } from '../data/fallbackListings'
import { filterListings } from '../utils/searchHelper'

export const listingDataContext = createContext()

function ListingContext({ children }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [frontEndImages, setFrontEndImages] = useState([])
  const [backEndImages, setBackEndImages] = useState([])
  const [price, setPrice] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('India')
  const [address, setAddress] = useState('')
  const [landmark, setLandmark] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [amenities, setAmenities] = useState([])
  const [category, setCategory] = useState('')
  const [adding, setAdding] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [listingData, setListingData] = useState([])
  const [newListData, setNewListData] = useState([])
  const [cardDetails, setCardDetails] = useState(null)
  const [searchData, setSearchData] = useState([])
  const [listingLoading, setListingLoading] = useState(true)
  const [listingError, setListingError] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)

  const { serverUrl } = useContext(authDataContext)

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setFrontEndImages([])
    setBackEndImages([])
    setPrice('')
    setCity('')
    setState('')
    setCountry('India')
    setAddress('')
    setLandmark('')
    setLatitude('')
    setLongitude('')
    setAmenities([])
    setCategory('')
  }

  const handleAddListing = async () => {
    if (backEndImages.length < 5) {
      toast.error('Please upload at least 5 images')
      return
    }
    if (backEndImages.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    setAdding(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('rent', price)
      formData.append('city', city)
      formData.append('state', state)
      formData.append('country', country)
      formData.append('address', address || landmark)
      formData.append('landMark', landmark)
      formData.append('category', category)
      formData.append('latitude', latitude || 0)
      formData.append('longitude', longitude || 0)
      formData.append('amenities', JSON.stringify(amenities))

      backEndImages.forEach((file) => {
        formData.append('images', file)
      })

      await axios.post(`${serverUrl}/api/listing/add`, formData, { withCredentials: true })
      toast.success('Listing published successfully')
      resetForm()
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add listing')
    } finally {
      setAdding(false)
    }
  }

  const handleViewCard = async (id) => {
    if (String(id).startsWith('demo-')) {
      const demo = fallbackListings.find((l) => l._id === id)
      if (demo) {
        setCardDetails(demo)
        navigate(`/listing/${id}`)
      }
      return
    }

    try {
      const result = await axios.get(`${serverUrl}/api/listing/findlistingbyid/${id}`)
      setCardDetails(result.data)
      navigate(`/listing/${id}`)
    } catch (error) {
      const demo = fallbackListings.find((l) => l._id === id)
      if (demo) {
        setCardDetails(demo)
        navigate(`/listing/${id}`)
        return
      }
      toast.error(error.response?.data?.message || 'Could not load property details')
    }
  }

  const handleSearch = async (data) => {
    const source = usingFallback ? fallbackListings : listingData

    if (usingFallback || !listingData.length) {
      setSearchData(filterListings(fallbackListings.length ? fallbackListings : source, data))
      return
    }

    try {
      const result = await axios.get(`${serverUrl}/api/listing/search?query=${encodeURIComponent(data)}`)
      const apiResults = result.data || []
      if (apiResults.length > 0) {
        setSearchData(apiResults)
      } else {
        setSearchData(filterListings(listingData, data))
      }
    } catch {
      setSearchData(filterListings(listingData.length ? listingData : fallbackListings, data))
    }
  }

  const getListing = async () => {
    setListingLoading(true)
    setListingError(false)
    try {
      const result = await axios.get(`${serverUrl}/api/listing/get`)
      const data = result.data || []
      if (data.length === 0) {
        setListingData(fallbackListings)
        setNewListData(fallbackListings)
        setUsingFallback(true)
      } else {
        setListingData(data)
        setNewListData(data)
        setUsingFallback(false)
      }
    } catch (error) {
      console.error('[Listings]', error.response?.data?.message || error.message)
      setListingData(fallbackListings)
      setNewListData(fallbackListings)
      setUsingFallback(true)
      setListingError(false)
    } finally {
      setListingLoading(false)
    }
  }

  useEffect(() => {
    getListing()
  }, [adding, updating, deleting])

  const value = {
    title, setTitle,
    description, setDescription,
    frontEndImages, setFrontEndImages,
    backEndImages, setBackEndImages,
    price, setPrice,
    rent: price, setRent: setPrice,
    city, setCity,
    state, setState,
    country, setCountry,
    address, setAddress,
    landmark, setLandmark,
    latitude, setLatitude,
    longitude, setLongitude,
    amenities, setAmenities,
    category, setCategory,
    handleAddListing,
    adding, setAdding,
    listingData, setListingData,
    getListing,
    newListData, setNewListData,
    handleViewCard,
    cardDetails, setCardDetails,
    updating, setUpdating,
    deleting, setDeleting,
    handleSearch, searchData, setSearchData,
    listingLoading, listingError,
    usingFallback,
  }

  return (
    <listingDataContext.Provider value={value}>
      {children}
    </listingDataContext.Provider>
  )
}

export default ListingContext
