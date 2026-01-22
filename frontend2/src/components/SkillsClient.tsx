// frontend2\src\components\SkillsClient.tsx
'use client';

import { useState } from 'react';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import DynamicIcon from '@/utils/getIconComponent';
import { Skill } from '@/types';

interface SkillsClientProps {
  skills: Skill[];
}

// export default function SkillsClient({ skills }: SkillsClientProps) {
const SkillsClient: React.FC<SkillsClientProps> = ({ skills }) => {
  const [expandedSkill, setExpandedSkill] = useState<number | null>(null);

  const toggleSkill = (id: number) => {
    setExpandedSkill(expandedSkill === id ? null : id);
  };

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Skills</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {skills.map((skill, index) => {
            const hasSubSkills = skill.subskills && skill.subskills.length > 0;
            const isExpanded = expandedSkill === skill.id;

            return (
              <div
                key={skill.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group h-fit"
                style={{ 
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  animationDelay: `${index * 50}ms`,
                  opacity: 0
                }}
              >
                {/* Skill Header */}
                <div
                  className={`flex items-center justify-between p-6 ${
                    hasSubSkills ? 'cursor-pointer hover:bg-slate-50' : ''
                  } transition-colors rounded-t-2xl`}
                  onClick={() => hasSubSkills && toggleSkill(skill.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-4xl group-hover:scale-110 transition-transform">
                      <DynamicIcon name={skill.icon} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                        {skill.name}
                      </h3>
                      {hasSubSkills && (
                        <p className="text-sm text-slate-500 mt-1">
                          {skill.subskills.length} {skill.subskills.length === 1 ? 'technology' : 'technologies'}
                        </p>
                      )}
                    </div>
                  </div>
                  {hasSubSkills && (
                    <div className="text-slate-400 ml-2">
                      {isExpanded ? (
                        <FaAngleUp className="text-lg" />
                      ) : (
                        <FaAngleDown className="text-lg" />
                      )}
                    </div>
                  )}
                </div>

                {/* SubSkills - Collapsible with smooth height transition */}
                {hasSubSkills && isExpanded && (
                  <div className="px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-100">
                    <ul className="space-y-3">
                      {skill.subskills.map((subSkill) => (
                        <li 
                          key={subSkill.id} 
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="text-2xl flex-shrink-0">
                              <DynamicIcon name={subSkill.icon} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-slate-700 block truncate">
                                {subSkill.name}
                              </span>
                              <span className="text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded-full inline-block mt-1">
                                {subSkill.level}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`text-base ${i < subSkill.rating ? 'text-amber-400' : 'text-slate-300'}`}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SkillsClient;