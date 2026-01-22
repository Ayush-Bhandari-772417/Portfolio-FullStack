// frontend2\src\components\portfolioSections\Hero.tsx
"use client";

import { useState } from "react";
import Image from 'next/image';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { AllSettings, Profile } from '@/types';
import HireModal from '@/components/HireModal';

export default function Hero({ profile, settings }: { profile: Profile | null, settings: AllSettings }) {
  const [modalOpen, setModalOpen] = useState(false);

  const name = profile?.name || settings.settings.name || "Ayush Bhandari";
  const tagline = profile?.tagline || settings.settings.tagline || "Hi, I'm";
  const headline = profile?.headline || settings.settings.headline || "";
  const shortIntro = profile?.short_intro || settings.settings.short_intro || "I build clean, scalable, SEO-friendly web apps and write poems & stories.";
  const profileImage = profile?.profile_image_url || settings.settings.profile_image_url || "/my_photo.jpg";
  const profileImageAlt = profile?.profile_image_alt || name;
  const resumeUrl = profile?.resume_url || settings.settings.resume_url || "/resume.pdf";

  const showHireButton = settings.settings.hero_show_hire_button !== false;
  const showResumeButton = settings.settings.hero_show_resume_button !== false;
  const showContactButton = settings.settings.hero_show_contact_button !== false;
  const contactButtonText = settings.settings.hero_contact_button_text || "Contact Me";
  const hireButtonText = settings.settings.hero_hire_button_text || "Hire Me";
  const resumeButtonText = settings.settings.hero_resume_button_text || "Resume";

  const yearsExp = profile?.years_of_experience || 0;
  const projectsCount = profile?.projects_completed || 0;

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Simple background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-20 relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text Content */}
          <div className="flex-1 text-center md:text-left space-y-6">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-700">Available for opportunities</span>
            </div>

            {/* Greeting */}
            <p className="text-lg md:text-xl text-slate-600 font-medium">
              {tagline}
            </p>

            {/* Name */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
              {name.split(' ')[0]}
              {name.split(' ').slice(1).length > 0 && (
                <>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                    {name.split(' ').slice(1).join(' ')}
                  </span>
                </>
              )}
            </h1>

            {/* Headline */}
            {headline && (
              <p className="text-xl md:text-2xl font-semibold text-slate-700">
                {headline}
              </p>
            )}

            {/* Description */}
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto md:mx-0">
              {shortIntro}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
              {showContactButton && (
                <a 
                  href="#contact" 
                  className="group px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  {contactButtonText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              )}
              
              {showHireButton && (
                <div 
                  onClick={() => setModalOpen(true)}
                  className="group px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {hireButtonText}
                </div>
              )}
              
              {showResumeButton && resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group px-8 py-4 rounded-full border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  {resumeButtonText}
                </a>
              )}
            </div>
            <HireModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

            {/* Stats */}
            {(yearsExp > 0 || projectsCount > 0) && (
              <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-8">
                {yearsExp > 0 && (
                  <div className="text-center md:text-left">
                    <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      {yearsExp}+
                    </div>
                    <div className="text-sm text-slate-600 font-medium mt-1">Years Experience</div>
                  </div>
                )}
                {projectsCount > 0 && (
                  <div className="text-center md:text-left">
                    <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {projectsCount}+
                    </div>
                    <div className="text-sm text-slate-600 font-medium mt-1">Projects Completed</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Image */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative group">
              <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px]">
                {/* Rotating gradient border */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Image container */}
                <div className="absolute inset-2 rounded-full overflow-hidden bg-white shadow-2xl ring-4 ring-white/50">
                  <Image
                    src={profileImage}
                    alt={profileImageAlt}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 288px, (max-width: 1024px) 384px, 420px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Status badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-xl border-2 border-blue-100 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-slate-700">Open to Work</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-slate-400 rounded-full scroll-indicator"></div>
        </div>
      </div>
    </section>
  );
}