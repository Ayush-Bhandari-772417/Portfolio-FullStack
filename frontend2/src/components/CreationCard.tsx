// frontend2\src\components\CreationCard.tsx
'use client';

import { Creation } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/data';

interface CreationCardProps {
  creation: Creation;
  index: number;
}

export default function CreationCard({ creation, index }: CreationCardProps) {
  const typeColors = {
    blog: 'from-blue-500 to-cyan-500',
    poem: 'from-purple-500 to-pink-500',
    story: 'from-orange-500 to-red-500',
    article: 'from-green-500 to-emerald-500',
  };

  const publishDate = creation.published_date || creation.written_date;

  return (
    <Link 
      href={`/creations/${creation.type}/${creation.slug}`}
      className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
      style={{ 
        animation: 'fadeInUp 0.6s ease-out forwards',
        animationDelay: `${index * 100}ms`,
        opacity: 0
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {creation.featured_image_url ? (
          <Image
            src={creation.featured_image_url}
            alt={creation.featured_image_alt || creation.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${typeColors[creation.type]}`}></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${typeColors[creation.type]} text-white`}>
            {creation.type}
          </span>
          {creation.category && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {creation.category}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {creation.title}
        </h3>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {creation.excerpt}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={publishDate}>{formatDate(publishDate)}</time>
          </div>
          {creation.published_in && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span className="truncate">{creation.published_in}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}