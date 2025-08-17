/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        esmExternals: 'loose',
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }
        
        // Fix for import.meta issues
        config.module.rules.push({
            test: /\.m?js$/,
            resolve: {
                fullySpecified: false,
            },
        });
        
        // Additional fix for import.meta
        config.resolve.alias = {
            ...config.resolve.alias,
            'import.meta': 'undefined',
        };
        
        // Ignore problematic modules
        config.externals = config.externals || [];
        config.externals.push({
            '@imgly/background-removal': 'commonjs @imgly/background-removal',
        });
        
        // Custom plugin to replace import.meta
        config.plugins.push({
            name: 'replace-import-meta',
            apply: (compiler) => {
                compiler.hooks.compilation.tap('replace-import-meta', (compilation) => {
                    compilation.hooks.optimizeChunkModules.tap('replace-import-meta', (chunks, modules) => {
                        modules.forEach((module) => {
                            if (module.resource && module.resource.includes('@imgly')) {
                                // Skip problematic modules
                                module.external = true;
                            }
                        });
                    });
                });
            },
        });
        
        return config;
    },
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'images.unsplash.com',
            },
            {
              protocol: 'https',
              hostname: 'lxlfwrdbdhafahrrgtzk.supabase.co',
            },
            {
              protocol: 'http',
              hostname: 'localhost',
            },
            {
              protocol: 'https',
              hostname: 'localhost',
            },
            {
              protocol: 'https',
              hostname: 'api.producthunt.com',
            },
          ],
    },

    // SEO and Performance optimizations
    compress: true,
    poweredByHeader: false,
    generateEtags: false,

    async headers() {
      return [
        {
          source: "/app/:path*", 
          headers: [
            { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
            { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          ],
        },
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

    // Redirects for SEO
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

    // Rewrites for clean URLs
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
};

export default nextConfig;
