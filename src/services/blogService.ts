import { blogPosts } from '../data/blogPosts'
import type { BlogPost } from '../types'
import { delay } from './http'

export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    return delay([...blogPosts])
  },

  async getBySlug(slug: string): Promise<BlogPost | undefined> {
    return delay(blogPosts.find((post) => post.slug === slug))
  },
}
