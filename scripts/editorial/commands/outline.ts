import { readFileSync, writeFileSync } from 'fs';
import { askLong } from '../lib/anthropic.js';
import { SYSTEM_OUTLINE } from '../lib/prompts.js';

export async function outline(options: { from: string; output: string }) {
  console.log(`Generating outline from ${options.from}`);

  const research = readFileSync(options.from, 'utf-8');

  const result = await askLong({
    system: SYSTEM_OUTLINE,
    prompt: `Based on this research, create a detailed article outline:

${research}

Return a JSON object with:
{
  "title": "...",
  "subtitle": "...",
  "description": "SEO description",
  "category": "geopolitics|economics|climate|technology|health|energy|trade|demographics",
  "estimatedReadingTime": 12,
  "sections": [
    {
      "id": "section-slug",
      "heading": "...",
      "narrative": "What story this section tells",
      "visuals": [
        {
          "type": "BarChart|LineChart|AreaChart|MapView|ScrollySection|StatRow|PlotChart",
          "description": "...",
          "dataNeeded": "...",
          "position": "inline|breakout|full-bleed"
        }
      ],
      "keyPoints": ["..."]
    }
  ],
  "dataFiles": [
    { "filename": "...", "description": "...", "format": "json|csv|geojson" }
  ]
}`,
  });

  writeFileSync(options.output, result, 'utf-8');
  console.log(`Outline saved to ${options.output}`);
}
