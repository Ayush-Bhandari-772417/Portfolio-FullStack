// admin\next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the specific IP and port
  allowedDevOrigins: [
    '192.168.81.1:3000',
    'localhost:3000',
//     'local-origin.dev', 
//     '*.local-origin.dev',
//     // The following entries are likely wrong for this use case
//     // 'http://127.0.0.1:8000/*',
    'http://192.168.81.1:3000'
  ],
  // Optional: Disable HMR if still problematic
  // webpackDevMiddleware: (config) => {
  //   config.hotModuleReplacement = false;
  //   return config;
  // },
};

export default nextConfig;