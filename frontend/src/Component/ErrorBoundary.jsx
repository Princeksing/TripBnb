import React from 'react'
import Button from './ui/Button'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-xl font-semibold text-brand-dark mb-2">Something went wrong</h2>
          <p className="text-brand-gray mb-6 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred on this page.'}
          </p>
          <Button onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }}>
            Go to Home
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
