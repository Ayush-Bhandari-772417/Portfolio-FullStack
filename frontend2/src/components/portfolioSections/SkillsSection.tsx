// frontend2\src\components\portfolioSections\SkillsSection.tsx (Server Component)
import { AllSettings } from '@/types';
import { getSkills, getSubSkills } from '@/lib/data';
import SkillsClient from '@/components/SkillsClient';

export default async function SkillsSection({ settings }: { settings: AllSettings }) {
  try {
    const [skills, allSubSkills] = await Promise.all([
      getSkills(),
      getSubSkills(),
    ]);

    console.log('Skills fetched:', skills?.length || 0);
    console.log('SubSkills fetched:', allSubSkills?.length || 0);

    if (!skills || skills.length === 0) {
      console.log('No skills found');
      return null;
    }

    // Attach subskills to each skill by matching skill.id with subskill.skill
    const skillsWithSubSkills = skills.map(skill => {
      const matchingSubSkills = skill?.subskills;
      return {
        ...skill,
        subskills: matchingSubSkills,
      };
    });

    // return <SkillsClient skills={skillsWithSubSkills} />;
    return <SkillsClient skills={skills} />;
  } catch (error) {
    console.error('Error rendering skills:', error);
    return null;
  }
}