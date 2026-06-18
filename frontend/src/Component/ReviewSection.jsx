import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { authDataContext } from '../Context/AuthContext'
import { userDataContext } from '../Context/UserContext'
import { FaStar } from 'react-icons/fa'
import Button from './ui/Button'
import Star from './Star'
import { toast } from 'react-toastify'

function ReviewSection({ listingId }) {
  const { serverUrl } = useContext(authDataContext)
  const { userData } = useContext(userDataContext)
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [breakdown, setBreakdown] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/reviews/listing/${listingId}`)
      setReviews(res.data.reviews)
      setAvgRating(res.data.avgRating)
      setReviewCount(res.data.reviewCount)
      setBreakdown(res.data.breakdown)
    } catch {
      console.log('Could not load reviews')
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [listingId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userData) {
      toast.info('Please login to write a review')
      return
    }
    if (!rating || !comment.trim()) {
      toast.error('Rating and comment are required')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('rating', rating)
      formData.append('comment', comment)
      images.forEach((file) => formData.append('images', file))

      await axios.post(`${serverUrl}/api/reviews/listing/${listingId}`, formData, { withCredentials: true })
      toast.success('Review submitted!')
      setShowForm(false)
      setRating(0)
      setComment('')
      setImages([])
      fetchReviews()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const maxBreakdown = Math.max(...Object.values(breakdown), 1)

  return (
    <section className="mt-10 pt-8 border-t border-brand-border">
      <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-5xl font-semibold text-brand-dark">{avgRating || '—'}</span>
          <div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <FaStar key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'text-brand-pink' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-sm text-brand-gray mt-1">{reviewCount} review{reviewCount !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="w-3">{star}</span>
              <FaStar className="w-3 h-3 text-brand-pink" />
              <div className="flex-1 h-2 bg-brand-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-pink rounded-full transition-all"
                  style={{ width: `${((breakdown[star] || 0) / maxBreakdown) * 100}%` }}
                />
              </div>
              <span className="w-6 text-brand-gray">{breakdown[star] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {userData && (
        <Button variant="secondary" className="mb-6" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'Write a review'}
        </Button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-brand-light rounded-2xl p-6 mb-8 space-y-4 animate-slide-up">
          <div>
            <label className="text-sm font-medium block mb-2">Your rating</label>
            <Star onRate={setRating} />
            {rating > 0 && <span className="text-sm text-brand-gray ml-2">{rating} stars</span>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="review-comment" className="text-sm font-medium">Your review</label>
            <textarea
              id="review-comment"
              className="w-full px-4 py-3 border border-brand-border rounded-xl min-h-[100px] outline-none focus:border-brand-dark"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Photos (optional)</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files))} className="text-sm" />
          </div>
          <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit review'}</Button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-brand-border pb-6 last:border-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-brand-dark text-white flex items-center justify-center font-semibold">
                {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-brand-dark">{review.user?.name || 'Guest'}</p>
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="w-3 h-3 text-brand-pink" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-brand-dark leading-relaxed">{review.comment}</p>
            {review.images?.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {review.images.map((img, i) => (
                  <img key={i} src={img} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                ))}
              </div>
            )}
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-brand-gray text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </section>
  )
}

export default ReviewSection
