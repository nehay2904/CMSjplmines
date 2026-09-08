import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  handleReset = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: '#b91c1c' }}>{String(this.state.error.message || this.state.error)}</p>
          <button
            onClick={this.handleReset}
            style={{
              marginTop: 12,
              padding: '8px 16px',
              background: '#1d4ed8',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Reset & go to login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;