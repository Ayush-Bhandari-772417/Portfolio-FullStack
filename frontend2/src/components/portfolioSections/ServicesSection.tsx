// frontend2\src\components\portfolioSections\ServicesSection.tsx (Server Component)
import { AllSettings } from '@/types';
import { getServices, getDisplayLimit } from '@/lib/data';
import ServicesClient from '@/components/ServicesClient';

export default async function ServicesSection({ settings }: { settings: AllSettings }) {
  try {
    const services = await getServices();
    const limit = getDisplayLimit(settings, 'home', 'services', 6);

    if (!services || services.length === 0) {
      console.log('No services found');
      return null;
    }

    console.log('Rendering services:', services.length);

    return <ServicesClient services={services.slice(0, limit)} />;
  } catch (error) {
    console.error('Error rendering services:', error);
    return null;
  }
}

