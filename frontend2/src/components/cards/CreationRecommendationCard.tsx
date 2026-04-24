'use client';

import { Creation } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/data';

interface CreationRecommendationCardProps {
  creation: Creation;
}

const typeColors: Record<string, string> = {
  blog: 'from-blue-500 to-cyan-500',
  poem: 'from-purple-500 to-pink-500',
  story: 'from-orange-500 to-red-500',
  article: 'from-green-500 to-emerald-500',
};

export default function CreationRecommendationCard({ creation }: CreationRecommendationCardProps) {
  const publishDate = creation.published_date || creation.written_date;
  const typeColor = typeColors[creation.type] || 'from-slate-500 to-slate-600';

  return (
    <Link href={`/creations/${creation.type}/${creation.slug}`} className="block group">
      <div className="p-4 rounded-xl hover:bg-slate-50/70 transition-all border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transform hover:-translate-y-0.5 hover:scale-[1.02] duration-300 overflow-hidden bg-gradient-to-br from-white to-blue-50/50">
        <div className="flex gap-3">
          {creation.featured_image && (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200/50 group-hover:ring-blue-300/50">
              <Image
                src={creation.featured_image}
                alt={creation.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-400 saturate-100 group-hover:saturate-120 brightness-100 group-hover:brightness-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
          <div className="flex-1 min-w-0 py-1">
            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-all line-clamp-2 text-sm leading-tight mb-1.5 pr-2">
              {creation.title}
            </h4>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3 pr-2">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="font-medium">{formatDate(publishDate)}</span>
            </p>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm border border-slate-200/50 bg-gradient-to-r ${typeColor} text-white transform group-hover:scale-105 group-hover:shadow-lg transition-all`}>
              <BookOpen className="w-3 h-3" />
              {creation.type}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
