import React from 'react'
import StaticPage from '../layouts/StaticPage'

function Refund() {
  return (
    <StaticPage title="Refund Policy">
      <p>Last updated: June 2026</p>
      <p>
        TripBnb aims to provide a fair refund process for both guests and hosts.
      </p>
      <h3 className="text-lg font-semibold text-brand-dark">Cancellation by Guest</h3>
      <p>
        Guests may cancel bookings through their account dashboard. Refund eligibility
        depends on the cancellation timing and host policy. Platform fees may be
        non-refundable in some cases.
      </p>
      <h3 className="text-lg font-semibold text-brand-dark">Cancellation by Host</h3>
      <p>
        If a host cancels a confirmed booking, the guest receives a full refund including
        any platform fees charged.
      </p>
      <h3 className="text-lg font-semibold text-brand-dark">Refund Processing</h3>
      <p>
        Approved refunds are processed within 5–7 business days to the original payment
        method. Contact support@tripbnb.com for refund status inquiries.
      </p>
    </StaticPage>
  )
}

export default Refund
