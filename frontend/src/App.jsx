import React, { Suspense, lazy, useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { userDataContext } from './Context/UserContext'
import Footer from './Component/Footer'
import Chatbot from './Component/Chatbot'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const ListingPage1 = lazy(() => import('./pages/ListingPage1'))
const ListingPage2 = lazy(() => import('./pages/ListingPage2'))
const ListingPage3 = lazy(() => import('./pages/ListingPage3'))
const MyListing = lazy(() => import('./pages/MyListing'))
const ViewCard = lazy(() => import('./pages/ViewCard'))
const MyBooking = lazy(() => import('./pages/MyBooking'))
const Booked = lazy(() => import('./pages/Booked'))
const Payment = lazy(() => import('./pages/Payment'))
const Profile = lazy(() => import('./pages/Profile'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const HostDashboard = lazy(() => import('./pages/HostDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Careers = lazy(() => import('./pages/Careers'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Refund = lazy(() => import('./pages/Refund'))

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ProtectedRoute({ userData, children }) {
  return userData != null ? children : <Navigate to="/login" />
}

function App() {
  const { userData } = useContext(userDataContext)

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/listing/:id" element={<ViewCard />} />
              <Route path="/viewcard" element={<ViewCard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/profile" element={<ProtectedRoute userData={userData}><Profile /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute userData={userData}><Wishlist /></ProtectedRoute>} />
              <Route path="/host/dashboard" element={<ProtectedRoute userData={userData}><HostDashboard /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute userData={userData}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/listingpage1" element={<ProtectedRoute userData={userData}><ListingPage1 /></ProtectedRoute>} />
              <Route path="/listingpage2" element={<ProtectedRoute userData={userData}><ListingPage2 /></ProtectedRoute>} />
              <Route path="/listingpage3" element={<ProtectedRoute userData={userData}><ListingPage3 /></ProtectedRoute>} />
              <Route path="/mylisting" element={<ProtectedRoute userData={userData}><MyListing /></ProtectedRoute>} />
              <Route path="/mybooking" element={<ProtectedRoute userData={userData}><MyBooking /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute userData={userData}><Payment /></ProtectedRoute>} />
              <Route path="/booked" element={<ProtectedRoute userData={userData}><Booked /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
      <Chatbot />
    </>
  )
}

export default App
