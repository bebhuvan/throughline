import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { askLong } from '../lib/anthropic.js';
import { SYSTEM_REVIEW } from '../lib/prompts.js';

export async function review(options: { slug: string; output: string }) {
  console.log(`Reviewing article: ${options.slug}`);

  const mdxPath = join('src/content/explainers', options.slug, 'index.mdx');
  const content = readFileSync(mdxPath, 'utf-8');

  const result = await askLong({
    system: SYSTEM_REVIEW,
    prompt: `Review this explainer article:

${content}

Provide a detailed editorial review in markdown format covering clarity, accuracy, flow, depth, concreteness, and visual balance.`,
  });

  writeFileSync(options.output, result, 'utf-8');
  console.log(`Review saved to ${options.output}`);
}
