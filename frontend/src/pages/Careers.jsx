import React from 'react'
import StaticPage from '../layouts/StaticPage'

function Careers() {
  return (
    <StaticPage title="Careers">
      <p>
        Join the TripBnb team and help shape the future of travel in India. We are always
        looking for passionate developers, designers, and hospitality professionals.
      </p>
      <h3 className="text-lg font-semibold text-brand-dark mt-6">Open Positions</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>Full Stack Developer (MERN)</li>
        <li>UI/UX Designer</li>
        <li>Customer Support Executive</li>
        <li>Business Development Intern</li>
      </ul>
      <p className="mt-4">
        Send your resume to <strong className="text-brand-dark">careers@tripbnb.com</strong> with
        the role title in the subject line.
      </p>
    </StaticPage>
  )
}

export default Careers
