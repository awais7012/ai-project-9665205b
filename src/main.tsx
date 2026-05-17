import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Error Boundary — catches any React render crash and shows a fallback UI
// instead of a blank white screen
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
    // Report to parent window for the builder's fix-error flow
    window.parent?.postMessage({ type: 'runtime_error', message: error.message, stack: error.stack }, '*')
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui', color: '#e2e8f0', background: '#0f172a', minHeight: '100vh' }}>
          <h1 style={{ color: '#f87171', fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <pre style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', fontSize: '0.75rem', color: '#94a3b8' }}>
            {this.state.error?.message}
          </pre>
          <button onClick={() => this.setState({ hasError: false, error: null })} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
