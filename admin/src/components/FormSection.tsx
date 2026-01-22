// admin\src\components\FormSection.tsx
export default function FormSection({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
}
