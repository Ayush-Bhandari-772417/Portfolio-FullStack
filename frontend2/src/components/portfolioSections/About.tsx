// frontend2\src\components\portfolioSections\About.tsx
import Image from 'next/image';
import { Award, Briefcase, Heart, Zap } from 'lucide-react';
import { AllSettings, Profile } from '@/types';

export default function About({ profile, settings }: { profile: Profile | null, settings: AllSettings }) {
  const aboutImage = profile?.about_image || settings.settings.about_image || "/aboutProfile.png";
  const aboutImageAlt = profile?.about_image_alt || "About Profile";
  const aboutText = profile?.about_text || settings.settings.about_text || "I am a Computer Engineering student at Thapathali Campus, IOE. I am keen on learning new technologies and applying them to solve real-world problems.\nI believe in teamwork, enthusiasm, and continuous improvement.";
  const years = profile?.years_of_experience ?? parseInt(settings.settings.years_of_experience) ?? 3;
  const projects = profile?.projects_completed ?? parseInt(settings.settings.projects_completed) ?? 10;

  const sectionTitle = settings.settings.about_section_title || "About Me";
  const showStats = settings.settings.about_show_stats !== false;
  const showHighlights = settings.settings.about_show_highlights !== false;

  const highlights = [
    { 
      icon: Zap, 
      title: "Fast Learner", 
      description: "Quick to adapt to new technologies",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    { 
      icon: Heart, 
      title: "Passionate", 
      description: "Love what I do every day",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    { 
      icon: Briefcase, 
      title: "Professional", 
      description: "Committed to quality work",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      icon: Award, 
      title: "Dedicated", 
      description: "Always striving for excellence",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <section id='about' className="relative py-20 md:py-28 overflow-hidden bg-white">
      <div className="container mx-auto px-6 md:px-12 relative">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-700">Get to know me</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
            {sectionTitle}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Image Section */}
          <div className="w-full lg:w-5/12 flex justify-center">
            <div className="relative group">
              {/* Decorative background */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl"></div>
              
              {/* Main image */}
              <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500 border-8 border-white">
                <Image
                  src={aboutImage}
                  alt={aboutImageAlt}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 320px, 384px"
                  className="object-cover"
                />
              </div>

              {/* Stats badge */}
              {showStats && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-2xl shadow-xl border border-slate-100 min-w-[280px] hidden sm:block">
                  <div className="flex justify-around gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        {years}+
                      </div>
                      <div className="text-xs text-slate-600 font-medium">Years Exp.</div>
                    </div>
                    <div className="w-px bg-slate-200"></div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        {projects}+
                      </div>
                      <div className="text-xs text-slate-600 font-medium">Projects</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Content Section */}
          <div className="w-full lg:w-7/12 space-y-8">
            {/* About text */}
            <div className="space-y-4 text-lg text-slate-700 leading-relaxed text-center lg:text-left">
              {aboutText.split('\n').map((para:any, index:any) => (
                para.trim() && <p key={index}>{para}</p>
              ))}
            </div>
            
            {/* Stats for mobile */}
            {showStats && (
              <div className="flex flex-row justify-center lg:justify-start gap-12 sm:hidden">
                <div className="text-center lg:text-left">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {years}+
                  </div>
                  <p className="text-sm font-medium text-slate-600 mt-1">Years Experience</p>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div className="text-center lg:text-left">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    {projects}+
                  </div>
                  <p className="text-sm font-medium text-slate-600 mt-1">Projects Done</p>
                </div>
              </div>
            )}

            {/* Highlights */}
            {showHighlights && (
              <div className="grid grid-cols-2 gap-4">
                {highlights.map((item, index) => (
                  <div 
                    key={index}
                    className={`${item.bgColor} p-5 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-default group`}
                  >
                    <div className={`${item.color} mb-2 transition-transform group-hover:scale-110`}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1 text-sm md:text-base">{item.title}</h4>
                    <p className="text-xs md:text-sm text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start pt-4">
              <a 
                href="#contact" 
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Let's Work Together
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
