import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import { askLong } from '../lib/anthropic.js';
import { SYSTEM_DATAPREP } from '../lib/prompts.js';

export async function dataPrep(options: { slug: string; source: string; spec?: string }) {
  console.log(`Preparing data for: ${options.slug}`);

  const raw = readFileSync(options.source, 'utf-8');
  const dataDir = join('src/content/explainers', options.slug, 'data');
  mkdirSync(dataDir, { recursive: true });

  const specNote = options.spec ? `\n\nSpecific requirement: ${options.spec}` : '';

  const result = await askLong({
    system: SYSTEM_DATAPREP,
    prompt: `Transform this raw data into chart-ready JSON:

Filename: ${basename(options.source)}
Data:
${raw}
${specNote}

Return a JSON array ready for use with D3/Observable Plot chart components. Include only the fields needed for visualization. Sort meaningfully.`,
  });

  const outputName = basename(options.source).replace(/\.(csv|tsv|json)$/i, '') + '.json';
  const outputPath = join(dataDir, outputName);
  writeFileSync(outputPath, result, 'utf-8');
  console.log(`Prepared data saved to ${outputPath}`);
}
