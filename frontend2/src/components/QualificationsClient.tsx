// frontend2\src\components\QualificationsClient.tsx
'use client';

import { GraduationCap, MapPin, Calendar, Award, ExternalLink } from 'lucide-react';
import { Qualification } from '@/types';

interface QualificationsClientProps {
  qualifications: Qualification[];
}

export default function QualificationsClient({ qualifications }: QualificationsClientProps) {
  return (
    <section id="qualifications" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Education & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Qualifications</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            My academic journey and certifications
          </p>
        </div>

        {/* Timeline Container */}
        <div className="max-w-5xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block"></div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {qualifications.map((qual, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <div
                  key={qual.id}
                  className={`relative flex items-center ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col`}
                  style={{ 
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    animationDelay: `${index * 100}ms`,
                    opacity: 0
                  }}
                >
                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
                      {/* Year Badge */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold mb-4`}>
                        <Calendar className="w-4 h-4" />
                        <span>
                          {qual.enrolled_year} - {qual.passed_year || 'Present'}
                        </span>
                      </div>

                      {/* Board/Degree */}
                      <h3 className="text-xl font-bold text-slate-900 mb-3">
                        {qual.board_name}
                      </h3>

                      {/* School */}
                      <div className="mb-3">
                        {qual.school_url ? (
                          <a
                            href={qual.school_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2 group"
                          >
                            {qual.school_name}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <span className="text-lg font-semibold text-slate-700">
                            {qual.school_name}
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-slate-600 mb-3">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {qual.location_url ? (
                          <a
                            href={qual.location_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors"
                          >
                            {qual.location}
                          </a>
                        ) : (
                          <span>{qual.location}</span>
                        )}
                      </div>

                      {/* Grade */}
                      {qual.grade && (
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span className="font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
                            {qual.grade}
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      {qual.description && (
                        <p className="text-slate-700 text-sm leading-relaxed bg-white/60 p-3 rounded-lg border border-slate-100 mt-3">
                          {qual.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Center Icon */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg z-10 hidden md:flex">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>

                  {/* Mobile Icon */}
                  <div className="md:hidden w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>

                  {/* Empty space for opposite side */}
                  <div className="hidden md:block w-5/12"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}