/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.producthunt.com',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/text-behind-image',
        destination: '/',
        permanent: true,
      },
      {
        source: '/text-behind-image-tool',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/text-behind-image',
        destination: '/',
      },
      {
        source: '/text-behind-image-tool',
        destination: '/',
      },
      {
        source: '/ai-text-effects',
        destination: '/',
      },
      {
        source: '/image-text-overlay',
        destination: '/',
      },
      {
        source: '/text-behind-image-online',
        destination: '/',
      },
      {
        source: '/text-behind-image-free',
        destination: '/',
      },
      {
        source: '/text-behind-image-generator',
        destination: '/',
      },
      {
        source: '/text-behind-image-editor',
        destination: '/',
      },
      {
        source: '/text-behind-image-maker',
        destination: '/',
      },
      {
        source: '/text-behind-image-website',
        destination: '/',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Handle Node.js modules in client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Handle .mjs files properly
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Handle import.meta issues
    config.resolve.alias = {
      ...config.resolve.alias,
      'import.meta': 'undefined',
    };

    // Externalize problematic modules
    config.externals = [
      ...(config.externals || []),
      {
        '@imgly/background-removal': 'commonjs @imgly/background-removal',
      },
    ];

    // Custom plugin to handle @imgly modules
    config.plugins.push({
      name: 'imgly-external',
      apply(compiler) {
        compiler.hooks.optimizeChunkModules.tap('ImglyExternal', (chunks, modules) => {
          modules.forEach((module) => {
            if (module.resource && module.resource.includes('@imgly')) {
              module.external = true;
            }
          });
        });
      },
    });

    return config;
  },
};

module.exports = nextConfig;
