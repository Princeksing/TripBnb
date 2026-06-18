import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingDataContext } from '../Context/BookingContext'
import { authDataContext } from '../Context/AuthContext'
import { userDataContext } from '../Context/UserContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import BackButton from '../Component/ui/BackButton'
import Button from '../Component/ui/Button'
import PriceBreakdown from '../Component/PriceBreakdown'
import { QRCodeSVG } from 'qrcode.react'
import { formatCurrency } from '../utils/pricing'

const PAYMENT_METHODS = [
  { id: 'upi_qr', label: 'UPI QR' },
  { id: 'upi_id', label: 'UPI ID' },
  { id: 'card', label: 'Card' },
  { id: 'netbanking', label: 'Net Banking' },
]

function Payment() {
  const navigate = useNavigate()
  const { bookingData, setBookingData, confirmBookingAfterPayment } = useContext(bookingDataContext)
  const { getCurrentUser } = useContext(userDataContext)
  const { serverUrl } = useContext(authDataContext)
  const [paying, setPaying] = useState(false)
  const [method, setMethod] = useState('upi_qr')
  const [upiIdInput, setUpiIdInput] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')

  if (!bookingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-brand-gray">No booking found. Please start a new booking.</p>
        <Button onClick={() => navigate('/')}>Go home</Button>
      </div>
    )
  }

  const amount = bookingData.finalAmount || bookingData.totalRent
  const upiString = `upi://pay?pa=${bookingData.upiId || 'tripbnb@upi'}&pn=TripBnb&am=${amount}&cu=INR&tn=${bookingData.bookingReference}`

  const breakdown = {
    roomBase: bookingData.roomBase ?? bookingData.basePrice,
    extraGuestFee: bookingData.extraGuestFee || 0,
    basePrice: bookingData.basePrice,
    cleaningFee: bookingData.cleaningFee || Math.round(bookingData.basePrice * 0.05),
    platformFee: bookingData.platformFee,
    gst: bookingData.gst || bookingData.taxes,
    convenienceFee: bookingData.convenienceFee || 99,
    finalAmount: amount,
    nights: bookingData.totalDays,
    guestCount: bookingData.guestCount || 1,
  }

  const handlePaymentConfirm = async () => {
    if (method === 'upi_id' && !upiIdInput.trim()) {
      toast.error('Please enter your UPI ID')
      return
    }
    if (method === 'card' && (!cardNumber.trim() || !cardName.trim())) {
      toast.error('Please fill card details')
      return
    }

    setPaying(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/booking/confirm/${bookingData._id}`,
        { paymentMethod: method },
        { withCredentials: true }
      )
      setBookingData(result.data)
      await confirmBookingAfterPayment(result.data)
      await getCurrentUser()
      toast.success('Payment successful! Booking confirmed.')
      navigate('/booked')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-light py-12 px-4">
      <div className="page-container max-w-2xl">
        <div className="mb-8"><BackButton to="/" /></div>

        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 animate-slide-up space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-brand-dark">Complete payment</h1>
            <p className="text-brand-gray text-sm mt-1">Booking ref: {bookingData.bookingReference}</p>
          </div>

          <PriceBreakdown breakdown={breakdown} showHeader />

          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  method === m.id
                    ? 'bg-brand-pink text-white border-brand-pink'
                    : 'border-brand-border hover:border-brand-pink'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {method === 'upi_qr' && (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white border-2 border-brand-border rounded-2xl">
                <QRCodeSVG value={upiString} size={200} level="M" />
              </div>
              <p className="text-sm text-brand-gray">Scan with Google Pay, PhonePe, Paytm, or any UPI app</p>
            </div>
          )}

          {method === 'upi_id' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-brand-dark">Enter your UPI ID</label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiIdInput}
                onChange={(e) => setUpiIdInput(e.target.value)}
                className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand-pink"
              />
              <p className="text-xs text-brand-gray">Pay {formatCurrency(amount)} to tripbnb@upi</p>
            </div>
          )}

          {method === 'card' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand-pink"
              />
              <input
                type="text"
                placeholder="Card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand-pink"
              />
              <p className="text-xs text-brand-gray">Demo UI — no real card processing</p>
            </div>
          )}

          {method === 'netbanking' && (
            <div className="space-y-2">
              {['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Kotak'].map((bank) => (
                <button
                  key={bank}
                  type="button"
                  className="w-full text-left px-4 py-3 border border-brand-border rounded-xl hover:border-brand-pink transition-colors text-sm"
                >
                  {bank}
                </button>
              ))}
              <p className="text-xs text-brand-gray">Demo UI — select a bank to simulate payment</p>
            </div>
          )}

          <div className="bg-brand-light rounded-xl p-4 flex justify-between items-center">
            <span className="font-medium">Amount to pay</span>
            <span className="text-xl font-bold text-brand-pink">{formatCurrency(amount)}</span>
          </div>

          <Button className="w-full" size="lg" onClick={handlePaymentConfirm} disabled={paying}>
            {paying ? 'Confirming...' : 'I have paid — Confirm booking'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Payment
