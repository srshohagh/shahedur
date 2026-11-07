/** @type {import('next').NextConfig} */
// Works for BOTH kinds of GitHub Pages repository:
//  - user site   (repo named <username>.github.io)  -> served at the root, no base path
//  - project site (any other repo name)             -> served at /<repo-name>/, base path added automatically
const repo = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';
const isUserSite = repo.toLowerCase().endsWith('.github.io');
const basePath = process.env.BASE_PATH ?? (repo && !isUserSite ? `/${repo}` : '');

module.exports = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
