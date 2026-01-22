// frontend2\src\components\TechBadge.tsx
export default function TechBadge({ tech }: { tech: string }) {
  return (
    <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
      {tech}
    </span>
  );
}