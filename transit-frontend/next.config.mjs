/** @type {import('next').NextConfig} */
const requiredEnv = ['GOOGLE_MAPS_API_KEY'];
for (const name of requiredEnv) {
  if (!process.env[name] || process.env[name].trim() === '') {
    throw new Error(
      `Missing required environment variable: ${name} (set it in .env.local or CI secrets)`
    );
  }
}

const nextConfig = {
  images: {
    unoptimized: true
  },
  env: {
    // Expose client-side API key via NEXT_PUBLIC_.* only if set, with server fallback
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY,
  },
};

export default nextConfig;
