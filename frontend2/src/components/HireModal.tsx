// frontend2\src\components\HireModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Send, CheckCircle, XCircle } from 'lucide-react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HireModal({ isOpen, onClose }: HireModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    stipend: '',
    details: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Check for reCAPTCHA load
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'demo-key';
    
    if (!siteKey || siteKey === 'demo-key') {
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

    if (!formData.name || !formData.email || !formData.phone || !formData.stipend || !formData.details) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'demo-key';
      let token = null;

      // Get reCAPTCHA token if available
      if (window.grecaptcha && siteKey !== 'demo-key') {
        try {
          token = await window.grecaptcha.execute(siteKey, { action: 'hire' });
        } catch (error) {
          console.error('reCAPTCHA error:', error);
          setStatus('error');
          setErrorMessage('Security verification failed. Please try again.');
          setTimeout(() => {
            setStatus('idle');
            setErrorMessage('');
          }, 5000);
          return;
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/hires/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          stipend: formData.stipend,
          details: formData.details,
          token, // reCAPTCHA token
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', stipend: '', details: '' });
        setTimeout(() => {
          onClose();
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
        
        // Handle different error types
        if (response.status === 429) {
          setErrorMessage('Too many requests. Please try again later.');
        } else if (data.error) {
          setErrorMessage(data.error);
        } else if (data.name || data.email || data.phone || data.stipend || data.details) {
          const errorMsg = data.name || data.email || data.phone || data.stipend || data.details;
          setErrorMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
        } else {
          setErrorMessage('Failed to send request. Please try again.');
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in my-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Hire Me</h2>
              <p className="text-emerald-100">Let's work together on your project</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="John Doe"
              suppressHydrationWarning
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="john@example.com"
              suppressHydrationWarning
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="+1 (555) 123-4567"
              suppressHydrationWarning
            />
          </div>

          <div>
            <label htmlFor="stipend" className="block text-sm font-semibold text-slate-700 mb-2">
              Budget / Stipend *
            </label>
            <input
              type="text"
              id="stipend"
              required
              value={formData.stipend}
              onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="$5,000 - $10,000"
              suppressHydrationWarning
            />
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-semibold text-slate-700 mb-2">
              Project Details *
            </label>
            <textarea
              id="details"
              required
              rows={6}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Tell me about your project, timeline, and requirements..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || !recaptchaLoaded}
            className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Request Sent!</span>
              </>
            ) : status === 'error' ? (
              <>
                <XCircle className="w-5 h-5" />
                <span>Try Again</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Request</span>
              </>
            )}
          </button>

          {/* Success Message */}
          {status === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-center font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Request sent successfully! I'll get back to you soon.
              </p>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center font-semibold flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5" />
                {errorMessage}
              </p>
            </div>
          )}

          {/* reCAPTCHA Notice */}
          <p className="text-xs text-slate-500 text-center">
            Protected by reCAPTCHA
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}