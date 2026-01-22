// frontend2\src\components\PageHeader.tsx
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  gradient: string;
  icon?: ReactNode;
}

export default function PageHeader({ title, subtitle, gradient, icon }: PageHeaderProps) {
  return (
    <div className={`relative bg-gradient-to-r ${gradient} text-white py-24`}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {icon && <div className="mb-6 flex justify-center">{icon}</div>}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}