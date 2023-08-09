const {PHASE_DEVELOPMENT_SERVER} = require('next/constants');

/**
 * @param {string} phase
 * @return {import('next').NextConfig}
 */
const nextConfig = (phase) => {
    if (process.env.NODE_ENV !== 'production') {
        return {
            reactStrictMode: true,
            env: {
                'MONGODB_USERNAME': 'juanmiguel431',
                'MONGODB_PASSWORD': 'hMasqJdJALJF4uns',
                'MONGODB_CLUSTER': 'cluster0.3polqrh',
                'MONGODB_DATABASE': 'next-auth-dev',
            }
        };
    }

    return {
        reactStrictMode: true,
        env: {
            'MONGODB_USERNAME': 'juanmiguel431',
            'MONGODB_PASSWORD': 'hMasqJdJALJF4uns',
            'MONGODB_CLUSTER': 'cluster0.3polqrh',
            'MONGODB_DATABASE': 'next-auth',
        }
    };
}

module.exports = nextConfig
