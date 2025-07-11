import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
    cacheOnNavigation: true,
    swSrc: 'app/sw.ts',
    swDest: 'public/sw.js',
});

export default withSerwist(
    /** @type {import('next').NextConfig} */
    {
        eslint: {
            ignoreDuringBuilds: true,
        },
        typescript: {
            ignoreBuildErrors: true,
        },
        images: {
            unoptimized: true,
        },
    }
);
