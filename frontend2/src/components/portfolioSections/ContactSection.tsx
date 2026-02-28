// frontend2\src\components\portfolioSections\ContactSection.tsx
'use client';
import { Mail, Phone, MapPin, Send, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSettings } from '@/lib/data';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function ContactSection() {
  const [settings, setSettings] = useState<any>({ settings: {} });
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const data = await getSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  // Check for reCAPTCHA load
  useEffect(() => {
    // Demo mode
    // setRecaptchaLoaded(true);
    
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
    
    if (!formData.email || !formData.message) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Demo mode - no actual API call in artifact
      let token = null;
      
      // In production, uncomment this code:
      
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

      // Get reCAPTCHA token if available
      if (window.grecaptcha && siteKey) {
        try {
          token = await window.grecaptcha.execute(siteKey, { action: 'contact' });
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
          token,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        
        if (response.status === 429) {
          setErrorMessage('Too many requests. Please try again later.');
        } else if (data.error) {
          setErrorMessage(data.error);
        } else if (data.email || data.message) {
          const errorMsg = data.email || data.message;
          setErrorMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
        } else {
          setErrorMessage('Failed to send message. Please try again.');
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
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Touch</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Have a project in mind? Let's create something amazing together!</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-6 animate-slide-in-left">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <h3 className="text-3xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Contact Information
              </h3>
              
              <div className="space-y-5">
                {/* Email */}
                <a
                  href={`mailto:${settings.settings.email || 'hello@example.com'}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 transition-all duration-300 group cursor-pointer border border-blue-200/50"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Email</div>
                    <div className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {settings.settings.email || 'hello@example.com'}
                    </div>
                  </div>
                  <div className="text-blue-400 group-hover:translate-x-1 transition-transform">→</div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${settings.settings.phone || '+15551234567'}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 transition-all duration-300 group cursor-pointer border border-purple-200/50"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Phone</div>
                    <div className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                      {settings.settings.phone || '+1 (555) 123-4567'}
                    </div>
                  </div>
                  <div className="text-purple-400 group-hover:translate-x-1 transition-transform">→</div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-100/50 border border-orange-200/50">
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Location</div>
                    <div className="text-lg font-bold text-slate-900">
                      {settings.settings.location || 'San Francisco, CA'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Response Badge */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold text-lg">Quick Response</span>
              </div>
              <p className="text-emerald-50">I typically respond within 24 hours during business days.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-slideInRight">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={status === 'loading'}
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 placeholder-slate-400"
                    placeholder="your@email.com"
                    suppressHydrationWarning
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={status === 'loading'}
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 placeholder-slate-400"
                    placeholder="Tell me about your project, ideas, or questions..."
                    suppressHydrationWarning
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={status === 'loading' || !formData.email || !formData.message || !recaptchaLoaded}
                  className="w-full px-8 py-5 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    {status === 'loading' ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : status === 'success' ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span>Message Sent!</span>
                      </>
                    ) : status === 'error' ? (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span>Try Again</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        <span>Send Message</span>
                      </>
                    )}
                  </span>
                </button>

                {/* Success Message */}
                {status === 'success' && (
                  <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl animate-fadeIn">
                    <p className="text-green-700 text-center font-bold flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Message sent successfully! I'll get back to you soon.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {status === 'error' && errorMessage && (
                  <div className="p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl animate-fadeIn">
                    <p className="text-red-700 text-center font-bold flex items-center justify-center gap-2">
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
          </div>
        </div>
      </div>
    </section>
  );
}