import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const docsDirectory = path.join(process.cwd(), "content/docs");

export interface DocsPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
  next?: string;
  prev?: string;
}

export interface DocsPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
}

export function getDocsPostSlugs(): string[] {
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(docsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}

export function getDocsPostBySlug(slug: string): DocsPost | null {
  try {
    const fullPath = path.join(docsDirectory, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author,
      tags: data.tags || [],
      content,
      next: data.next,
      prev: data.prev,
    };
  } catch (error) {
    console.error(`Error reading docs post ${slug}:`, error);
    return null;
  }
}

export function getAllDocsPosts(): DocsPostMeta[] {
  const slugs = getDocsPostSlugs();
  const posts = slugs
    .map((slug) => {
      const post = getDocsPostBySlug(slug);
      if (!post) return null;

      return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date,
        author: post.author,
        tags: post.tags,
      };
    })
    .filter((post): post is DocsPostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getDocsPostsByTag(tag: string): DocsPostMeta[] {
  return getAllDocsPosts().filter((post) => post.tags.includes(tag));
}

export async function getMDXContent(content: string) {
  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              keepBackground: false,
              theme: {
                dark: "github-dark",
                light: "github-light",
              },
              transformers: [
                {
                  code(node: { properties: Record<string, string> }) {
                    node.properties["data-line-numbers"] = "";
                  },
                },
              ],
            },
          ],
        ],
      },
    },
    components: mdxComponents,
  });

  return mdxContent;
}
