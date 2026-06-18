import React from 'react'
import { formatCurrency, EXTRA_GUEST_FEE_PER_NIGHT } from '../utils/pricing'

function PriceBreakdown({ breakdown, pricePerNight, showHeader = true }) {
  if (!breakdown || breakdown.nights <= 0) {
    return (
      <div className="p-4 border border-brand-border rounded-xl text-sm text-brand-gray">
        Select check-in, check-out dates and guests to see price details.
      </div>
    );
  }

  const {
    roomBase, extraGuestFee, basePrice, cleaningFee, platformFee,
    gst, convenienceFee, finalAmount, nights, guestCount,
  } = breakdown;

  return (
    <div className="p-4 border border-brand-border rounded-xl space-y-3">
      {showHeader && <h3 className="font-semibold text-brand-dark">Price details</h3>}

      <div className="flex justify-between text-sm">
        <span className="text-brand-gray">
          Room rate ({nights} {nights === 1 ? 'night' : 'nights'})
        </span>
        <span>{formatCurrency(roomBase ?? basePrice)}</span>
      </div>

      {extraGuestFee > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-brand-gray">
            Extra guest fee ({guestCount - 1} × ₹{EXTRA_GUEST_FEE_PER_NIGHT}/night)
          </span>
          <span>{formatCurrency(extraGuestFee)}</span>
        </div>
      )}

      <div className="flex justify-between text-sm">
        <span className="text-brand-gray">Cleaning fee (5%)</span>
        <span>{formatCurrency(cleaningFee)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-brand-gray">Platform fee (3%)</span>
        <span>{formatCurrency(platformFee)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-brand-gray">GST (18%)</span>
        <span>{formatCurrency(gst)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-brand-gray">Convenience fee</span>
        <span>{formatCurrency(convenienceFee)}</span>
      </div>
      <div className="flex justify-between font-semibold pt-3 border-t border-brand-border text-brand-dark">
        <span>Total amount</span>
        <span className="text-brand-pink">{formatCurrency(finalAmount)}</span>
      </div>
      {pricePerNight > 0 && (
        <p className="text-xs text-brand-gray pt-1">
          ₹{pricePerNight.toLocaleString('en-IN')} × {nights} nights · {guestCount} guest{guestCount > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

export default PriceBreakdown;
