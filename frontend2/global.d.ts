// frontend2\global.d.ts
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Google Analytics type definitions
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}