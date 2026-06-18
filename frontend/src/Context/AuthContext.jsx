import React, { createContext, useState } from 'react'

export const authDataContext = createContext()

function AuthContext({ children }) {
  const serverUrl = import.meta.env.VITE_API_URL || 'https://tripbnb-backend.onrender.com'
  const [loading, setLoading] = useState(false)

  const value = { serverUrl, loading, setLoading }

  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  )
}

export default AuthContext
