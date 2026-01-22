// frontend2\src\components\portfolioSections\ExperienceSection.tsx
import { AllSettings } from '@/types';
import { getExperiences, getDisplayLimit } from '@/lib/data';
import ExperienceCard from '@/components/ExperienceCard';

export default async function ExperienceSection({ settings }: { settings: AllSettings }) {
  const experiences = await getExperiences();
  const limit = getDisplayLimit(settings, 'home', 'experiences', 3);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Experience</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            My professional journey and career highlights
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {experiences.slice(0, limit).map((exp, index) => (
            <ExperienceCard key={exp.id} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}