/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "entangled-with-julia";

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "mdx"],
  // GitHub Pages serves this repo from /<repo>/, so assets and links need the prefix.
  // Locally (npm run dev) there is no prefix.
  basePath: isPages ? `/${repo}` : undefined,
  assetPrefix: isPages ? `/${repo}/` : undefined,
  images: { unoptimized: true },
  // emits a fully static out/ — required for GitHub Pages
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
