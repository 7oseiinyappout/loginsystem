'use client'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
// const ClipboardPage = dynamic(() => import('./clipboard'), { ssr: false })

export default function HomePage() {
  const router = useRouter()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 My Project Dashboard</h1>
      <p style={styles.description}>
        Welcome to your all-in-one project management and tracking system.
        Register now to get started or login to continue!
      </p>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => router.push('/login')}>
          Login
        </button>
        <button style={{ ...styles.button, backgroundColor: '#00c851' }} onClick={() => router.push('/register')}>
          Register
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '50px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333'
  },
  description: {
    fontSize: '18px',
    maxWidth: '600px',
    marginBottom: '40px',
    color: '#555'
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px'
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
}
