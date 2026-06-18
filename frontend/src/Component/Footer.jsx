import React from 'react'
import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa'

const footerLinks = {
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Careers', to: '/careers' },
  ],
  legal: [
    { label: 'Terms & Conditions', to: '/terms' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Refund Policy', to: '/refund' },
  ],
}

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
]

function Footer() {
  return (
    <footer className="bg-brand-light border-t border-brand-border mt-auto">
      <div className="page-container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="text-2xl font-bold text-brand-pink">
              TripBnb
            </Link>
            <p className="text-brand-gray text-sm mt-3 max-w-xs leading-relaxed">
              Discover unique stays and experiences. Your home away from home, anywhere in India.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-brand-dark mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-brand-gray hover:text-brand-dark transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-brand-dark mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-brand-gray hover:text-brand-dark transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-brand-dark mb-4">Follow us</h4>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-brand-border text-brand-dark hover:text-brand-pink hover:border-brand-pink transition-all duration-200"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-brand-gray">
            &copy; {new Date().getFullYear()} TripBnb. All rights reserved.
          </p>
          <p className="text-sm text-brand-gray">
            Made with care for travelers across India
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
