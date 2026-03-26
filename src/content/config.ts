import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const explainers = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: 'src/content/explainers' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    author: z.string().default('Editorial'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum([
      'geopolitics',
      'economics',
      'climate',
      'technology',
      'health',
      'energy',
      'trade',
      'demographics',
    ]),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    heroCaption: z.string().optional(),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(),
    mapCenter: z.tuple([z.number(), z.number()]).optional(),
    mapZoom: z.number().optional(),
    relatedSlugs: z.array(z.string()).default([]),
    status: z.enum(['draft', 'review', 'published']).default('draft'),
  }),
});

export const collections = { explainers };
