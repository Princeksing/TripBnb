import React from 'react'
import StaticPage from '../layouts/StaticPage'

function Contact() {
  return (
    <StaticPage title="Contact Us">
      <p>We would love to hear from you. Reach out through any of the channels below.</p>
      <div className="bg-brand-light rounded-xl p-6 space-y-3 not-prose">
        <p><strong className="text-brand-dark">Email:</strong> support@tripbnb.com</p>
        <p><strong className="text-brand-dark">Phone:</strong> +91 98765 43210</p>
        <p><strong className="text-brand-dark">Address:</strong> TripBnb HQ, Bangalore, Karnataka, India</p>
        <p><strong className="text-brand-dark">Hours:</strong> Monday – Saturday, 9 AM – 6 PM IST</p>
      </div>
      <p>
        For booking-related queries, please include your booking ID in the email subject line
        so we can assist you faster.
      </p>
    </StaticPage>
  )
}

export default Contact
