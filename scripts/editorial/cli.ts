import { Command } from 'commander';
import { research } from './commands/research.js';
import { outline } from './commands/outline.js';
import { draft } from './commands/draft.js';
import { vizSpec } from './commands/viz-spec.js';
import { review } from './commands/review.js';
import { dataPrep } from './commands/data-prep.js';

const program = new Command();

program
  .name('editorial')
  .description('LLM-assisted editorial pipeline for Explainer')
  .version('0.1.0');

program
  .command('research')
  .description('Research a topic — gather angles, data sources, and cascade effects')
  .argument('<topic>', 'Topic to research')
  .option('-o, --output <path>', 'Output file path', 'research-output.json')
  .action(research);

program
  .command('outline')
  .description('Generate an article outline with visualization plan')
  .option('--from <path>', 'Research output file', 'research-output.json')
  .option('-o, --output <path>', 'Output file path', 'outline.json')
  .action(outline);

program
  .command('draft')
  .description('Generate an MDX draft from an outline')
  .requiredOption('--slug <slug>', 'Article slug (directory name)')
  .option('--from <path>', 'Outline file', 'outline.json')
  .action(draft);

program
  .command('viz-spec')
  .description('Generate visualization specifications from a draft')
  .requiredOption('--slug <slug>', 'Article slug')
  .option('-o, --output <path>', 'Output file path', 'viz-specs.json')
  .action(vizSpec);

program
  .command('review')
  .description('Run an editorial review pass on an article')
  .requiredOption('--slug <slug>', 'Article slug')
  .option('-o, --output <path>', 'Output file path', 'review-notes.md')
  .action(review);

program
  .command('data-prep')
  .description('Transform raw data into chart-ready JSON')
  .requiredOption('--slug <slug>', 'Article slug')
  .requiredOption('--source <path>', 'Raw data file (CSV or JSON)')
  .option('--spec <description>', 'What to produce from the data')
  .action(dataPrep);

program.parse();
