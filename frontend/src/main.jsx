import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './Context/AuthContext.jsx'
import UserContext from './Context/UserContext.jsx'
import ListingContext from './Context/ListingContext.jsx'
import BookingContext from './Context/BookingContext.jsx'
import WishlistContext from './Context/WishlistContext.jsx'
import ErrorBoundary from './Component/ErrorBoundary.jsx'

const App = lazy(() => import('./App.jsx'))

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext>
        <ListingContext>
          <UserContext>
            <BookingContext>
              <WishlistContext>
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    <App />
                  </Suspense>
                </ErrorBoundary>
              </WishlistContext>
            </BookingContext>
          </UserContext>
        </ListingContext>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>
)
