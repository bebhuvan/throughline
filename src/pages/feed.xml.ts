import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const explainers = await getCollection('explainers');
  const published = explainers
    .filter((e) => e.data.status === 'published')
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

  return rss({
    title: 'Throughline',
    description: 'Visual stories that trace the consequences of the developments that matter most.',
    site: context.site!,
    items: published.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedAt,
      link: `/stories/${entry.id}/`,
      categories: [entry.data.category, ...entry.data.tags],
    })),
    customData: '<language>en</language>',
  });
}
