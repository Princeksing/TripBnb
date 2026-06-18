import React from 'react'
import StaticPage from '../layouts/StaticPage'

function Privacy() {
  return (
    <StaticPage title="Privacy Policy">
      <p>Last updated: June 2026</p>
      <p>
        TripBnb respects your privacy. This policy explains how we collect, use, and
        protect your personal information.
      </p>
      <h3 className="text-lg font-semibold text-brand-dark">Information We Collect</h3>
      <p>
        We collect information you provide during registration (name, email, password),
        booking details, and usage data to improve our services.
      </p>
      <h3 className="text-lg font-semibold text-brand-dark">How We Use Your Data</h3>
      <p>
        Your data is used to process bookings, communicate about reservations, improve
        platform security, and personalize your experience.
      </p>
      <h3 className="text-lg font-semibold text-brand-dark">Data Security</h3>
      <p>
        We use industry-standard security measures including encrypted passwords and
        secure HTTP-only cookies for authentication. We do not sell your personal data
        to third parties.
      </p>
    </StaticPage>
  )
}

export default Privacy
