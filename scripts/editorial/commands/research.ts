import { writeFileSync } from 'fs';
import { askLong } from '../lib/anthropic.js';
import { SYSTEM_RESEARCH } from '../lib/prompts.js';

export async function research(topic: string, options: { output: string }) {
  console.log(`Researching: ${topic}`);

  const result = await askLong({
    system: SYSTEM_RESEARCH,
    prompt: `Research this topic for a visual explainer article: "${topic}"

Return a JSON object with:
{
  "topic": "...",
  "summary": "2-3 sentence overview",
  "firstOrderEffects": ["..."],
  "secondOrderEffects": ["..."],
  "thirdOrderEffects": ["..."],
  "geographicDimensions": [{ "region": "...", "relevance": "..." }],
  "dataOpportunities": [{ "metric": "...", "chartType": "...", "source": "..." }],
  "humanImpact": ["..."],
  "keyStatistics": [{ "value": "...", "label": "...", "source": "..." }],
  "suggestedAngles": ["..."],
  "sourcesToConsult": ["..."]
}`,
  });

  writeFileSync(options.output, result, 'utf-8');
  console.log(`Research saved to ${options.output}`);
}
