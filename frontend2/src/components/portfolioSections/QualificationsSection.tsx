// frontend2\src\components\portfolioSections\QualificationsSection.tsx (Server Component)
import { AllSettings } from '@/types';
import { getQualifications, getDisplayLimit } from '@/lib/data';
import QualificationsClient from '@/components/QualificationsClient';

export default async function QualificationsSection({ settings }: { settings: AllSettings }) {
  try {
    const qualifications = await getQualifications();
    const limit = getDisplayLimit(settings, 'home', 'qualifications', 10);

    if (!qualifications || qualifications.length === 0) {
      console.log('No qualifications found');
      return null;
    }

    console.log('Rendering qualifications:', qualifications.length);

    return <QualificationsClient qualifications={qualifications.slice(0, limit)} />;
  } catch (error) {
    console.error('Error rendering qualifications:', error);
    return null;
  }
}