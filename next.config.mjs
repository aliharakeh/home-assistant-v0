import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
    cacheOnNavigation: true,
    swSrc: 'app/sw.ts',
    swDest: 'public/sw.js',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
};

export default withSerwist(nextConfig);
