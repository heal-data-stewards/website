module.exports = {
  transpilePackages: ["@mui/x-data-grid"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "heal-community-portal-api.s3.amazonaws.com",
      },
    ],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
}
