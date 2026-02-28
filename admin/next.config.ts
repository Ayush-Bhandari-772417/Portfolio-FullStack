// admin\next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the specific IP and port
  allowedDevOrigins: [
    '192.168.81.1:3000',
    'localhost:3000',
    'http://192.168.81.1:3000'
  ],
  // Optional: Disable HMR if still problematic
  // webpackDevMiddleware: (config) => {
  //   config.hotModuleReplacement = false;
  //   return config;
  // },
};

export default nextConfig;