// frontend2\src\components\SubscribeForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle, XCircle } from 'lucide-react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Check for reCAPTCHA load
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    
    if (!siteKey) {
      setRecaptchaLoaded(true);
      return;
    }

    if (window.grecaptcha) {
      setRecaptchaLoaded(true);
      return;
    }

    const interval = setInterval(() => {
      if (window.grecaptcha) {
        setRecaptchaLoaded(true);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Please enter your email');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      let token = null;

      // Get reCAPTCHA token if available
      if (window.grecaptcha && siteKey) {
        try {
          token = await window.grecaptcha.execute(siteKey, { action: 'subscribe' });
        } catch (error) {
          console.error('reCAPTCHA error:', error);
          setStatus('error');
          setErrorMessage('Security verification failed. Please try again.');
          setTimeout(() => setStatus('idle'), 5000);
          return;
        }
      }

      // Submit to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscribes/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          token, // reCAPTCHA token
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        
        // Handle different error types
        if (response.status === 429) {
          setErrorMessage('Too many requests. Please try again later.');
        } else if (data.error) {
          setErrorMessage(data.error);
        } else if (data.email) {
          // Django validation error
          setErrorMessage(Array.isArray(data.email) ? data.email[0] : data.email);
        } else {
          setErrorMessage('Subscription failed. Please try again.');
        }
        
        setTimeout(() => {
          setStatus('idle');
          setErrorMessage('');
        }, 5000);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection.');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={status === 'loading'}
          className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          suppressHydrationWarning
        />
        
        <button
          type="submit"
          disabled={status === 'loading' || !email || !recaptchaLoaded}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 min-w-[140px]"
        >
          {status === 'loading' ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Sending...</span>
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Subscribed!</span>
            </>
          ) : status === 'error' ? (
            <>
              <XCircle className="w-5 h-5" />
              <span>Error</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Subscribe</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {status === 'error' && errorMessage && (
        <p className="mt-3 text-sm text-red-300 text-center animate-fadeIn">
          {errorMessage}
        </p>
      )}

      {/* Success Message */}
      {status === 'success' && (
        <p className="mt-3 text-sm text-green-300 text-center animate-fadeIn">
          🎉 Thanks for subscribing! Check your email for updates.
        </p>
      )}

      {/* reCAPTCHA Badge Info */}
      <p className="mt-3 text-xs text-white/50 text-center">
        Protected by reCAPTCHA
      </p>
    </form>
  );
}