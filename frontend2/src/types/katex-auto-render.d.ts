// frontend2\src\types\katex-auto-render.d.ts
declare module 'katex/contrib/auto-render' {
  const renderMathInElement: (
    element: HTMLElement,
    options?: {
      delimiters?: {
        left: string;
        right: string;
        display: boolean;
      }[];
      throwOnError?: boolean;
    }
  ) => void;

  export default renderMathInElement;
}
