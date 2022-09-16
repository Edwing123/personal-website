import type { MarkdownLayoutProps } from 'astro'

export type PostProps = MarkdownLayoutProps<{
    title: string
    author: string
    date: string
    description: string
    tags: string[]
    slug: string
    coverImage: {
        url: string
        creator: string
        original: string
    }
}>

export type PostFrontmatter = PostProps['frontmatter']
