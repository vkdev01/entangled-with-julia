import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx-components";

const prettyCodeOptions: Options = {
  theme: {
    dark: "github-dark-default",
    light: "github-light-default",
  },
  keepBackground: false,
  onVisitLine(node) {
    // keep empty lines from collapsing
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
};

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [
            [rehypePrettyCode, prettyCodeOptions],
            rehypeSlug,
            [rehypeKatex, { throwOnError: false }],
          ],
        },
      }}
    />
  );
}
