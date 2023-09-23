/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.BASE_URL || 'https://family.eviloma.org',
  generateRobotsTxt: true,
  exclude: ['/admin/*'],
};
