const CONVENIENCE_FEE = 99;
export const EXTRA_GUEST_FEE_PER_NIGHT = 500;

export function calculateBookingPrice(pricePerNight, nights, guestCount = 1) {
  if (!pricePerNight || nights <= 0) {
    return {
      roomBase: 0,
      extraGuestFee: 0,
      basePrice: 0,
      cleaningFee: 0,
      platformFee: 0,
      gst: 0,
      convenienceFee: 0,
      finalAmount: 0,
      nights: 0,
      guestCount: guestCount || 1,
    };
  }

  const guests = Math.max(1, Number(guestCount) || 1);
  const roomBase = pricePerNight * nights;
  const extraGuestFee = Math.max(0, guests - 1) * EXTRA_GUEST_FEE_PER_NIGHT * nights;
  const basePrice = roomBase + extraGuestFee;
  const cleaningFee = Math.round(basePrice * 0.05);
  const platformFee = Math.round(basePrice * 0.03);
  const subtotal = basePrice + cleaningFee + platformFee;
  const gst = Math.round(subtotal * 0.18);
  const convenienceFee = CONVENIENCE_FEE;
  const finalAmount = subtotal + gst + convenienceFee;

  return {
    roomBase,
    extraGuestFee,
    basePrice,
    cleaningFee,
    platformFee,
    gst,
    convenienceFee,
    finalAmount,
    nights,
    guestCount: guests,
  };
}

export function getPriceUnit(category) {
  if (category === 'pg') return 'month';
  if (category === 'shops') return 'day';
  return 'night';
}

export function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
}
