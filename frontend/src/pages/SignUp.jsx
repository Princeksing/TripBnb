import React, { useContext, useState } from 'react'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { authDataContext } from '../Context/AuthContext'
import { userDataContext } from '../Context/UserContext'
import { toast } from 'react-toastify'
import BackButton from '../Component/ui/BackButton'
import Input from '../Component/ui/Input'
import Button from '../Component/ui/Button'

function SignUp() {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const { serverUrl, loading, setLoading } = useContext(authDataContext)
  const { setUserData } = useContext(userDataContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUP = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      )
      setUserData(result.data)
      toast.success('Account created successfully')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light px-4 py-12">
      <div className="absolute top-6 left-4 sm:left-6">
        <BackButton />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8 md:p-10 animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-brand-pink">TripBnb</Link>
          <h1 className="text-2xl font-semibold text-brand-dark mt-4">Create your account</h1>
          <p className="text-brand-gray mt-1">Join TripBnb and start exploring</p>
        </div>

        <form onSubmit={handleSignUP} className="space-y-5">
          <Input
            label="Full name"
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />

          <Input
            label="Email"
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <div className="relative">
            <Input
              label="Password"
              id="password"
              type={show ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
            <button
              type="button"
              className="absolute right-4 top-[38px] text-brand-gray hover:text-brand-dark transition-colors"
              onClick={() => setShow((prev) => !prev)}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <IoMdEyeOff className="w-5 h-5" /> : <IoMdEye className="w-5 h-5" />}
            </button>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <p className="text-center text-brand-gray mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-pink font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
