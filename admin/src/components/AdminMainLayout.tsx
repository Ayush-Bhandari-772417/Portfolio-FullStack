// admin\src\components\AdminMainLayout.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FaBriefcase, FaChartBar, FaCode, FaEnvelope, FaGraduationCap, FaProjectDiagram, FaSignOutAlt, FaTools, FaUserCog, FaUsers, FaUserTie } from 'react-icons/fa';
import { TbCategory2 } from "react-icons/tb";
import { TiSocialAtCircular } from "react-icons/ti";
import Link from 'next/link';
import { useAuth } from './AuthProvider';

// Define content types enum
enum ContentType {
  Dashboard = 'dashboard',
  Projects = 'projects',
  Categories = 'categories',
  Creations = 'creations',
  Skills = 'skills',
  Subskills = 'subskills',
  Services = 'services',
  Experiences = 'experiences',
  Qualifications = 'qualifications',
  Messages = 'messages',
  Hires = 'hires',
  Subscriptions = 'subscriptions',
  Profile = 'profile',
  Settings = 'settings',
  SocialMedias = 'socialmedias',
}

// Sidebar Link Component
interface SidebarLinkProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  href: string;
}

const SidebarLink = ({ icon, text, active, href }: SidebarLinkProps) => {
  return (
    <Link href={href} className={`flex items-center p-3 rounded-lg mb-1 ${active ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
      <div className="mr-3">{icon}</div>
      <span>{text}</span>
    </Link>
  );
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [activeContent, setActiveContent] = useState<ContentType>(ContentType.Dashboard);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth(); // use the same logout function

  // Update activeContent based on pathname
  useEffect(() => {
    if (pathname === '/admin') {
      setActiveContent(ContentType.Dashboard);
    } else if (pathname?.includes('/admin/projects')) {
      setActiveContent(ContentType.Projects);
    } else if (pathname?.includes('/admin/categories')) {
      setActiveContent(ContentType.Categories);
    } else if (pathname?.includes('/admin/creations')) {
      setActiveContent(ContentType.Creations);
    } else if (pathname?.includes('/admin/skills')) {
      setActiveContent(ContentType.Skills);
    } else if (pathname?.includes('/admin/subskills')) {
      setActiveContent(ContentType.Subskills);
    } else if (pathname?.includes('/admin/services')) {
      setActiveContent(ContentType.Services);
    } else if (pathname?.includes('/admin/experiences')) {
      setActiveContent(ContentType.Experiences);
    } else if (pathname?.includes('/admin/qualifications')) {
      setActiveContent(ContentType.Qualifications);
    } else if (pathname?.includes('/admin/contacts')) {
      setActiveContent(ContentType.Messages);
    } else if (pathname?.includes('/admin/hires')) {
      setActiveContent(ContentType.Hires);
    } else if (pathname?.includes('/admin/subscriptions')) {
      setActiveContent(ContentType.Subscriptions);
    } else if (pathname?.includes('/admin/profile')) {
      setActiveContent(ContentType.Profile);
    } else if (pathname?.includes('/admin/settings')) {
      setActiveContent(ContentType.Settings);
    } else if (pathname?.includes('/admin/socialmedias')) {
      setActiveContent(ContentType.SocialMedias);
    }
  }, [pathname]);

  return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2 px-3">Main</h2>
              <SidebarLink 
                icon={<FaChartBar />} 
                text="Dashboard" 
                active={activeContent === ContentType.Dashboard} 
                href="/admin"
              />
              <SidebarLink 
                icon={<FaProjectDiagram />} 
                text="Projects" 
                active={activeContent === ContentType.Projects} 
                href="/admin/projects"
              />
              <SidebarLink 
                icon={<TbCategory2  />} 
                text="Categories" 
                active={activeContent === ContentType.Categories} 
                href="/admin/categories"
              />
              <SidebarLink 
                icon={<FaCode />} 
                text="Creations" 
                active={activeContent === ContentType.Creations} 
                href="/admin/creations"
              />
              <SidebarLink 
                icon={<FaTools />} 
                text="Skills" 
                active={activeContent === ContentType.Skills} 
                href="/admin/skills"
              />
              <SidebarLink 
                icon={<FaTools />} 
                text="Sub Skills" 
                active={activeContent === ContentType.Subskills} 
                href="/admin/subskills"
              />
              <SidebarLink 
                icon={<FaTools />} 
                text="Services" 
                active={activeContent === ContentType.Services} 
                href="/admin/services"
              />
              <SidebarLink 
                icon={<FaBriefcase />} 
                text="Experiences" 
                active={activeContent === ContentType.Experiences} 
                href="/admin/experiences"
              />
              <SidebarLink 
                icon={<FaGraduationCap />} 
                text="Qualifications" 
                active={activeContent === ContentType.Qualifications} 
                href="/admin/qualifications"
              />
              <SidebarLink 
                icon={<TiSocialAtCircular />} 
                text="Social Medias" 
                active={activeContent === ContentType.SocialMedias} 
                href="/admin/socialmedias"
              />
            </div>
            
            <div className="mb-6">
              <h2 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2 px-3">Messages</h2>
              <SidebarLink 
                icon={<FaEnvelope />} 
                text="Contact Messages" 
                active={activeContent === ContentType.Messages} 
                href="/admin/contacts"
              />
              <SidebarLink 
                icon={<FaUserTie />} 
                text="Hire Requests" 
                active={activeContent === ContentType.Hires} 
                href="/admin/hires"
              />
              <SidebarLink 
                icon={<FaUsers />} 
                text="Subscriptions" 
                active={activeContent === ContentType.Subscriptions} 
                href="/admin/subscriptions"
              />
            </div>
            
            <div>
              <h2 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2 px-3">Account</h2>
              <SidebarLink 
                icon={<FaUserCog />} 
                text="Profile" 
                active={activeContent === ContentType.Profile} 
                href="/admin/profile"
              />
              <SidebarLink 
                icon={<FaUserCog />} 
                text="Settings" 
                active={activeContent === ContentType.Settings} 
                href="/admin/settings"
              />
              <div
                className="flex items-center p-3 rounded-lg mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                onClick={logout} // call AuthProvider.logout
              >
                <div className="mr-3"><FaSignOutAlt /></div>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
  );
}