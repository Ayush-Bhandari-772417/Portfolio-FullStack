// admin\src\app\admin\settings\page.tsx
import SettingsContent from "@/components/contentpage/SettingsContent";

export default function SettingsPage() {
  return (
    <>
      <SettingsContent type = 'settings' />
      <SettingsContent type = 'seosettings' />
      <SettingsContent type = 'sitemapsettings' />
      <SettingsContent type = 'displaysettings' />
    </>
  );
}