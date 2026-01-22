// frontend2/src/components/TableOfContents.tsx
'use client';

import { Book, ChevronRight, ChevronDown } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  activeId: string;
  onHeadingClick: (id: string) => void;
}

export default function TableOfContents({ headings, activeId, onHeadingClick }: TableOfContentsProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const handleClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onHeadingClick(id);
  }, [onHeadingClick]);

  const toggleSection = useCallback((headingId: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(headingId)) {
        next.delete(headingId);
      } else {
        next.add(headingId);
      }
      return next;
    });
  }, []);

  if (headings.length === 0) {
    return null;
  }

  // Build hierarchical structure
  const buildHierarchy = () => {
    const result: Array<{heading: Heading; children: Heading[]}> = [];
    let currentH2: {heading: Heading; children: Heading[]} | null = null;

    headings.forEach((heading) => {
      if (heading.level === 2) {
        currentH2 = { heading, children: [] };
        result.push(currentH2);
      } else if (heading.level === 3 && currentH2) {
        currentH2.children.push(heading);
      } else if (heading.level > 3) {
        if (currentH2) {
          currentH2.children.push(heading);
        }
      }
    });

    return result;
  };

  const hierarchy = buildHierarchy();

  return (
    <div className="lg:sticky lg:top-24">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border-2 border-blue-100 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Book className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Contents</h2>
        </div>
        
        <nav 
          ref={navRef}
          className="space-y-1 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50"
        >
          {hierarchy.map(({ heading, children }) => {
            const isCollapsed = collapsedSections.has(heading.id);
            const hasChildren = children.length > 0;

            return (
              <div key={heading.id}>
                {/* H2 Level */}
                <div className="flex items-center gap-1">
                  {hasChildren && (
                    <button
                      onClick={() => toggleSection(heading.id)}
                      className="p-1 hover:bg-white/60 rounded transition-colors"
                      aria-label={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                  )}
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={`flex-1 block text-sm transition-all duration-200 py-2.5 px-4 rounded-xl relative font-semibold ${
                      !hasChildren ? 'ml-5' : ''
                    } text-slate-700 hover:bg-white/60 hover:text-blue-600 hover:shadow-sm`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="line-clamp-2 leading-tight">{heading.text}</span>
                    </div>
                  </a>
                </div>

                {/* H3+ Children */}
                {hasChildren && !isCollapsed && (
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-blue-200 pl-2">
                    {children.map((child) => {
                      const indent = (child.level - 3) * 12;

                      return (
                        <a
                          key={child.id}
                          href={`#${child.id}`}
                          onClick={(e) => handleClick(e, child.id)}
                          style={{ paddingLeft: `${16 + indent}px` }}
                          className="block text-sm transition-all duration-200 py-2 px-3 rounded-lg relative font-medium text-slate-600 hover:bg-white/60 hover:text-blue-600"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-60"></span>
                            <span className="line-clamp-2 leading-tight text-xs">{child.text}</span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        {/* Reading Info (without progress bar) */}
        <div className="mt-6 pt-6 border-t border-blue-200">
          <div className="flex items-center justify-center text-xs text-slate-600">
            <span className="font-semibold">
              {headings.length} {headings.length === 1 ? 'section' : 'sections'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}