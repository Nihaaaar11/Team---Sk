/** @type {import('next').NextConfig} */
const requiredEnv = ['NEXT_PUBLIC_GEOAPIFY_API_KEY'];
for (const name of requiredEnv) {
  if (!process.env[name] || process.env[name].trim() === '') {
    throw new Error(
      `Missing required environment variable: ${name} (set it in .env.local or CI secrets)`
    );
  }
}

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
};

export default nextConfig;
