'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [message, setMessage] = useState('Verifying your email...')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('No verification token found in the URL.')
        return
      }

      try {
        const res = await fetch('/api/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (res.ok) {
          setStatus('success')
          setMessage('Your email has been successfully verified! You can now log in.')
        } else {
          setStatus('error')
          setMessage(data.error || 'Failed to verify email.')
        }
      } catch (err) {
        setStatus('error')
        setMessage('Something went wrong while verifying your email.')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div className="max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Success!' : 'Error'}
        </h1>
        <p>{message}</p>
      </div>
    </div>
  )
}
