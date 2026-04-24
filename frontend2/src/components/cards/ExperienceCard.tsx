// frontend2\src\components\ExperienceCard.tsx
'use client';

import { useState } from 'react';
import { Experience } from '@/types';
import { MapPin, Calendar } from 'lucide-react';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

export default function ExperienceCard({ experience, index }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const startYear = new Date(experience.start_date).getUTCFullYear();
  const endYear = experience.end_date ? new Date(experience.end_date).getUTCFullYear() : 'Present';

  return (
    <div
      className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200"
      style={{ 
        animation: 'fadeInUp 0.6s ease-out forwards',
        animationDelay: `${index * 100}ms`,
        opacity: 0
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
            {experience.title}
          </h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600 mb-3">
            <span className="font-semibold text-blue-600">
              {experience.organization}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              {experience.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              {startYear} - {endYear}
            </span>
          </div>
        </div>
      </div>

      {/* Responsibilities Toggle Button */}
      {experience.responsibilities.length > 0 && (
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left mb-4 pb-3 border-b border-slate-200 flex items-center justify-between group"
        >
          <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
            {isExpanded ? 'Hide' : 'Show'} Responsibilities ({experience.responsibilities.length})
          </span>
          <svg
            className={`w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-all duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}

      {/* Collapsible Responsibilities */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="space-y-3 pt-2">
          {experience.responsibilities.map((resp, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-slate-700"
              style={{
                animationName: "fadeInUp",
                animationDuration: "0.4s",
                animationTimingFunction: "ease",
                animationFillMode: "forwards",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="flex-1">{resp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}