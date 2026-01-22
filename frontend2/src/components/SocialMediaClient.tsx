// frontend2\src\components\SocialMediaClient.tsx
'use client';
import DynamicIcon from '@/utils/getIconComponent';
import { SocialMedia } from '@/types';

export default function SocialMediaClient({ socialMedias }: { socialMedias: SocialMedia[] }) {
  return (
    <div>
      {/* Social Media Links */}
      {socialMedias.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Follow Me</h4>
          <div className="flex flex-wrap gap-3">
            {socialMedias.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                title={social.name}
                aria-label={social.name}
              >
                <DynamicIcon name={social.icon} className="text-xl" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}