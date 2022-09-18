import type { MDXLayoutProps } from 'astro'

export type PostProps = MDXLayoutProps<{
    title: string
    author: string
    date: string
    description: string
    tags: string[]
    coverImage: {
        url: string
        creator: string
        original: string
    }
}>

export type PostFrontmatter = PostProps['frontmatter']
