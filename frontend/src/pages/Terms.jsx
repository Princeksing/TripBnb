import React from 'react'
import StaticPage from '../layouts/StaticPage'

function Terms() {
  return (
    <StaticPage title="Terms & Conditions">
      <p>Last updated: June 2026</p>
      <p>
        By using TripBnb, you agree to these terms. Please read them carefully before
        creating an account or making a booking.
      </p>
      <h3 className="text-lg font-semibold text-brand-dark">Use of Platform</h3>
      <p>
        TripBnb provides a platform connecting hosts and guests. We do not own or manage
        listed properties. Hosts are responsible for the accuracy of their listings.
      </p>
      <h3 className="text-lg font-semibold text-brand-dark">Bookings</h3>
      <p>
        When you book a property, you enter into a direct agreement with the host. TripBnb
        facilitates the transaction and may charge a platform fee as displayed at checkout.
      </p>
      <h3 className="text-lg font-semibold text-brand-dark">User Responsibilities</h3>
      <p>
        Users must provide accurate information, respect property rules, and comply with
        local laws. Misuse of the platform may result in account suspension.
      </p>
    </StaticPage>
  )
}

export default Terms
