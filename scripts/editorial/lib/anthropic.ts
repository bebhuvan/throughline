import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const client = new Anthropic();

interface MessageOptions {
  system: string;
  prompt: string;
  maxTokens?: number;
  model?: string;
}

export async function ask({ system, prompt, maxTokens = 4096, model = 'claude-sonnet-4-6' }: MessageOptions): Promise<string> {
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude');
  }
  return textBlock.text;
}

export async function askLong(options: MessageOptions): Promise<string> {
  return ask({ ...options, maxTokens: 8192, model: 'claude-sonnet-4-6' });
}
