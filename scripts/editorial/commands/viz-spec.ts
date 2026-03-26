import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { askLong } from '../lib/anthropic.js';
import { SYSTEM_VIZSPEC } from '../lib/prompts.js';

export async function vizSpec(options: { slug: string; output: string }) {
  console.log(`Generating viz specs for: ${options.slug}`);

  const mdxPath = join('src/content/explainers', options.slug, 'index.mdx');
  const content = readFileSync(mdxPath, 'utf-8');

  const result = await askLong({
    system: SYSTEM_VIZSPEC,
    prompt: `Analyze this article and generate visualization specifications for every chart, map, and visual element:

${content}

Return a JSON object with:
{
  "visualizations": [
    {
      "id": "viz-id",
      "component": "BarChart|LineChart|AreaChart|MapView|PlotChart",
      "props": { ... },
      "dataSchema": { "fields": [...] },
      "sampleData": [...],
      "designNotes": "...",
      "dataSource": "..."
    }
  ]
}`,
  });

  writeFileSync(options.output, result, 'utf-8');
  console.log(`Viz specs saved to ${options.output}`);
}
