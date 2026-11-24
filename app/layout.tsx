import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "julia/playground — a runnable Julia lab",
    template: "%s · julia/playground",
  },
  description:
    "Notes, tutorials and experiments in Julia: 1-based indexing, multiple dispatch, Flux.jl neural networks, Yao.jl quantum circuits and honest benchmarks.",
  metadataBase: new URL("https://julia-playground.vercel.app"),
  openGraph: {
    title: "julia/playground",
    description:
      "A runnable Julia lab: notes, tutorials and experiments with expected output and gotchas.",
    type: "website",
  },
};

const themeScript = `try{var t=localStorage.getItem('jp:theme');if(t==='light'){document.documentElement.classList.remove('dark')}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans">
        <SiteHeader />
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
