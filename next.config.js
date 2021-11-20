module.exports = {
  webpack5: false,
  images: {
    domains: ["heal-community-portal-api.s3.amazonaws.com"],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secretheal',
    secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
  },
};
