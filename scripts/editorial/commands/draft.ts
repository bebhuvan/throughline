import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { askLong } from '../lib/anthropic.js';
import { SYSTEM_DRAFT } from '../lib/prompts.js';

export async function draft(options: { slug: string; from: string }) {
  console.log(`Drafting article: ${options.slug}`);

  const outline = readFileSync(options.from, 'utf-8');
  const dir = join('src/content/explainers', options.slug);

  mkdirSync(join(dir, 'data'), { recursive: true });
  mkdirSync(join(dir, 'images'), { recursive: true });

  const result = await askLong({
    system: SYSTEM_DRAFT,
    prompt: `Write a full MDX article based on this outline:

${outline}

Requirements:
- Start with proper frontmatter (title, subtitle, description, author, publishedAt, category, tags, status: draft)
- Import visualization components at the top
- Write in clear, elegant prose — editorially serious
- Include visualization components with placeholder/sample data where appropriate
- Use {/* VIZ: description */} for visuals that need real data
- Use editorial components (Callout, KeyInsight, PullQuote, StatCard/StatRow) throughout
- Create a strong rhythm between text and visuals
- Focus on second and third-order effects, not just the obvious

The article should be publication-ready in terms of writing quality.`,
    maxTokens: 8192,
  });

  writeFileSync(join(dir, 'index.mdx'), result, 'utf-8');
  console.log(`Draft saved to ${join(dir, 'index.mdx')}`);
}
