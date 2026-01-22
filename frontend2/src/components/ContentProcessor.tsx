// frontend2\src\components\ContentProcessor.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Props {
  htmlContent: string;
  onHeadingsExtracted: (h: Heading[]) => void;
  onActiveHeadingChange: (id: string) => void;
}

/* ===================== PROCESSORS ===================== */

function processHeadings(root: HTMLElement): Heading[] {
  const headings: Heading[] = [];
  const nodes = root.querySelectorAll('h1,h2,h3,h4,h5,h6');

  nodes.forEach((h, i) => {
    const level = Math.min(parseInt(h.tagName[1]) + 1, 6);
    const nh = document.createElement(`h${level}`);
    nh.innerHTML = h.innerHTML;
    nh.id = `heading-${i}`;
    nh.style.scrollMarginTop = '100px';
    nh.className = h.className;
    h.replaceWith(nh);

    headings.push({
      id: nh.id,
      text: nh.textContent?.trim() || '',
      level,
    });
  });

  return headings;
}

function processLists(root: HTMLElement) {
  root.querySelectorAll('ul').forEach(ul => {
    ul.classList.add('list-disc', 'ml-6', 'my-4');
  });
  root.querySelectorAll('ol').forEach(ol => {
    ol.classList.add('list-decimal', 'ml-6', 'my-4');
  });
}
function processFigures(root: HTMLElement) {
  let count = 0;

  // Collect images first — avoids live collection mutation problems
  const allImages = Array.from(root.querySelectorAll('img'));

  allImages.forEach((oldImg) => {
    const src = oldImg.getAttribute('src') || '';
    if (!src.trim() || src === window.location.href) {
      oldImg.remove();
      return;
    }

    count++;

    // ─── Create fresh structure ────────────────────────────────────
    const figure = document.createElement('figure');
    figure.id = `figure-${count}`;
    figure.className = 'my-8 flex flex-col items-center';
    figure.style.scrollMarginTop = '100px';

    // New image element — prevents any node ownership conflicts
    const img = document.createElement('img');
    img.src = src;
    img.alt = ''; // we don't use alt for display anymore
    img.className = 'max-w-full h-auto rounded-md mx-auto';

    // Try to recover caption text from most likely places
    let captionText = '';

    // 1. Look right next to the image (common in editors)
    let possibleCaption = oldImg.nextElementSibling;
    if (possibleCaption?.tagName === 'FIGCAPTION') {
      captionText = possibleCaption.textContent?.trim() || '';
    }

    // 2. Look inside closest figure
    if (!captionText) {
      const parentFig = oldImg.closest('figure');
      if (parentFig) {
        const cap = parentFig.querySelector('figcaption');
        if (cap) captionText = cap.textContent?.trim() || '';
      }
    }

    // 3. Fallback to alt only if nothing else
    if (!captionText && oldImg.alt?.trim()) {
      captionText = oldImg.alt.trim();
    }

    // ─── Build caption ─────────────────────────────────────────────
    const figcaption = document.createElement('figcaption');
    figcaption.className = 'mt-3 text-sm text-slate-600 italic text-center';

    // Label + caption in one flow (no extra line break)
    figcaption.innerHTML = `
      <strong>Figure ${count}:</strong> ${captionText}
    `;

    // Assemble
    figure.appendChild(img);
    figure.appendChild(figcaption);

    // Replace the original image (or its wrapping figure)
    const target = oldImg.closest('figure') || oldImg;
    target.replaceWith(figure);
  });
}

function processTables(root: HTMLElement) {
  let count = 0;

  root.querySelectorAll('div[data-labeled-table]').forEach(div => {
    const table = div.querySelector('table');
    if (!table) {
      div.remove();
      return;
    }

    count++;

    let captionText = '';
    const cap = div.querySelector('figcaption[data-caption]');
    if (cap) {
      captionText = cap.textContent?.trim() || '';
      cap.remove();
    }

    const wrapper = document.createElement('div');
    wrapper.id = `table-${count}`;
    wrapper.className = 'my-8 flex flex-col items-center';
    wrapper.style.scrollMarginTop = '100px';

    const caption = document.createElement('div');
    caption.className = 'mb-3 text-sm text-slate-600 italic text-center';
    caption.innerHTML = `<strong>Table ${count}:</strong> ${captionText}`;

    const clonedTable = table.cloneNode(true) as HTMLTableElement;
    clonedTable.className = 'border-collapse mx-auto';

    wrapper.append(caption, clonedTable);
    div.replaceWith(wrapper);
  });
}

function processEquations(root: HTMLElement) {
  let count = 0;

  root.querySelectorAll('div[data-equation]').forEach(eqDiv => {
    count++;

    // Extract clean LaTeX - only from <p>
    const p = eqDiv.querySelector('p');
    const latex = p?.textContent?.trim() || '';

    // Get caption if present
    let captionText = '';
    const cap = eqDiv.querySelector('figcaption[data-caption]');
    if (cap) {
      captionText = cap.textContent?.trim() || '';
      cap.remove();
    }

    const wrapper = document.createElement('div');
    wrapper.id = `equation-${count}`;
    wrapper.className = 'my-10 relative flex flex-col items-center';
    wrapper.style.scrollMarginTop = '100px';

    const mathBox = document.createElement('div');
    mathBox.className = 'equation-math w-full max-w-3xl text-center';

    const content = document.createElement('div');
    content.className = 'katex-target inline-block';
    try {
      katex.render(latex, content, {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      content.textContent = latex;
    }
    mathBox.appendChild(content);

    const label = document.createElement('div');
    label.className = 'absolute right-2 top-0 text-sm text-slate-600 italic';
    label.textContent = `(${count})`;

    const captionDiv = document.createElement('div');
    captionDiv.className = 'mt-3 text-sm text-slate-600 italic text-center';
    if (captionText) captionDiv.textContent = captionText;

    wrapper.append(mathBox, label, captionDiv);
    eqDiv.replaceWith(wrapper);
  });
}

function processReferences(root: HTMLElement) {
  const rx = /(Figure|Table|Equation)\s+(\d+)/gi;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }

  nodes.forEach(node => {
    const parent = node.parentElement;
    if (!parent || parent.tagName === 'A') return;

    const text = node.textContent || '';
    if (rx.test(text)) {
      const span = document.createElement('span');
      span.innerHTML = text.replace(rx, (_, type, num) => {
        const id = `${type.toLowerCase()}-${num}`;
        return `<a href="#${id}" class="text-slate-600 italic hover:underline">${type} ${num}</a>`;
      });
      parent.replaceChild(span, node);
    }
  });
}

/* ===================== COMPONENT ===================== */

export default function ContentProcessor({
  htmlContent,
  onHeadingsExtracted,
  onActiveHeadingChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (!htmlContent) return;

    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;

    const headings = processHeadings(temp);
    processLists(temp);
    processFigures(temp);
    processTables(temp);
    processEquations(temp);
    processReferences(temp);

    setHtml(temp.innerHTML);
    onHeadingsExtracted(headings);
  }, [htmlContent, onHeadingsExtracted]);

  // KaTeX rendering - run after html is set
  useEffect(() => {
    if (!ref.current || !html) return;

    const targets = ref.current.querySelectorAll('.katex-target');
    targets.forEach(target => {
      const latex = target.textContent?.trim() || '';
      if (!latex) return;

      try {
        katex.render(latex, target as HTMLElement, {
          displayMode: true,
          throwOnError: false,
          strict: false,
        });
      } catch (err) {
        console.error('KaTeX failed:', err, 'latex:', latex);
        target.textContent = latex; // fallback
      }
    });
  }, [html]);

  // Scroll spy
  useEffect(() => {
    if (!ref.current) return;

    const headings = ref.current.querySelectorAll('h2,h3,h4,h5,h6');
    const observer = new IntersectionObserver(
      entries => {
        let active = '';
        for (const entry of entries) {
          if (entry.isIntersecting) {
            active = entry.target.id;
            break;
          }
        }
        if (active) onActiveHeadingChange(active);
      },
      { rootMargin: '-120px 0px -50% 0px', threshold: 0 }
    );

    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [html, onActiveHeadingChange]);

  if (!html) return <div className="italic text-slate-500">Loading content…</div>;

  return (
    <div
      ref={ref}
      className="prose prose-lg prose-slate max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}