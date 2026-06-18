export const CHATBOT_RESPONSES = {
  welcome: "Hi! I'm TripBnb Support. How can I help you today?",
  options: [
    { id: 'book', label: 'Booking help' },
    { id: 'cancel', label: 'Cancellation' },
    { id: 'refund', label: 'Refund policy' },
    { id: 'host', label: 'Contact host' },
    { id: 'property', label: 'Property info' },
    { id: 'payment', label: 'Payment help' },
  ],
  answers: {
    book: 'Search for a property, click Reserve, pick check-in and check-out dates, then pay via UPI QR on the payment page. Your booking is confirmed after payment.',
    cancel: 'Go to My Bookings from the menu. Hosts can cancel from their listing card. Guest cancellations follow our refund policy based on timing.',
    refund: 'Full refunds are processed within 5–7 business days if cancelled by the host. Guest cancellations may receive partial refunds depending on how early you cancel.',
    host: 'You can message the host from the property detail page under Host Information. For urgent issues, email support@tripbnb.com with your booking reference.',
    property: 'Each listing shows photos, amenities, location on map, reviews, and pricing. Use the search bar to filter by city, landmark, or category.',
    payment: 'We accept UPI QR, UPI ID, card, and net banking on the payment page. After paying, click Confirm to complete your booking. Keep your booking ID for reference.',
  },
}

export const CHAT_STORAGE_KEY = 'tripbnb_chat_history'
