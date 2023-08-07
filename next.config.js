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
                'mongodb_username': 'juanmiguel431',
                'mongodb_password': 'hMasqJdJALJF4uns',
                'mongodb_cluster': 'cluster0.3polqrh',
                'mongodb_database': 'next-events-dev',
            }
        };
    }

    return {
        reactStrictMode: true,
        env: {
            'mongodb_username': 'juanmiguel431',
            'mongodb_password': 'hMasqJdJALJF4uns',
            'mongodb_cluster': 'cluster0.3polqrh',
            'mongodb_database': 'next-events',
        }
    };
}

module.exports = nextConfig
