// frontend2\src\components\commonSections\Footer.tsx
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { AllSettings, SocialMedia } from '@/types';
import SubscribeForm from '@/components/SubscribeForm';
import SocialMediaClient from '@/components/SocialMediaClient';

async function getSocialMedia(): Promise<SocialMedia[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/socialmedias/`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching social media:', error);
    return [];
  }
}

export default async function Footer({ settings }: { settings: AllSettings }) {
  const currentYear = new Date().getFullYear();
  const socialMedias = await getSocialMedia();

  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { href: '/', label: 'Home' },
        { href: '/#about', label: 'About' },
        { href: '/projects', label: 'Projects' },
        { href: '/creations', label: 'Creations' },
      ],
    },
    {
      title: 'Creations',
      links: [
        { href: '/creations/blog', label: 'Blog Posts' },
        { href: '/creations/poem', label: 'Poems' },
        { href: '/creations/story', label: 'Stories' },
        { href: '/creations/article', label: 'Articles' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { href: '/#contact', label: 'Contact' },
        ...(settings.settings.email ? [{ href: `mailto:${settings.settings.email}`, label: 'Email', external: true }] : []),
      ].filter(link => link.href),
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Newsletter Section */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Subscribe to Newsletter</h3>
          <p className="text-slate-400 mb-6">Get the latest updates and insights delivered to your inbox</p>
          <div><SubscribeForm /></div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              {settings.settings.site_name || 'Portfolio'}
            </h3>
            <p className="text-slate-400 mb-6">
              {settings.settings.tagline || 'Building digital experiences'}
            </p>

            <SocialMediaClient socialMedias={socialMedias} />
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-bold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} {settings.settings.site_name || 'Portfolio'}. All rights reserved.
            </p>
            
            <p className="text-slate-400 text-sm flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by {settings.settings.author_name || 'Ayush Bhandari'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

