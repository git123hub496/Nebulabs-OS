'use server';
/**
 * @fileOverview A terminal-based AI assistant flow.
 *
 * - executeTerminalAiCommand - A function that handles AI responses for the shell.
 * - TerminalAiInput - The input type for the executeTerminalAiCommand function.
 * - TerminalAiOutput - The return type for the executeTerminalAiCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TerminalAiInputSchema = z.object({
  command: z.string().describe('The user command or question entered in the terminal.'),
  history: z.array(z.string()).optional().describe('Previous terminal interactions for context.'),
});
export type TerminalAiInput = z.infer<typeof TerminalAiInputSchema>;

const TerminalAiOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the terminal command.'),
  suggestedAction: z.string().optional().describe('An optional system action to perform.'),
});
export type TerminalAiOutput = z.infer<typeof TerminalAiOutputSchema>;

export async function executeTerminalAiCommand(input: TerminalAiInput): Promise<TerminalAiOutput> {
  return terminalAiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'terminalAiPrompt',
  input: {schema: TerminalAiInputSchema},
  output: {schema: TerminalAiOutputSchema},
  prompt: `You are the Nebula Shell Assistant, a high-tech AI integrated into the Nebulabs WebOS terminal.

Respond to the user's terminal input in a concise, technical, and helpful manner.
If the input looks like a question about the system, answer it.
If the input looks like a request to perform a task, explain how it might be done or provide a simulated technical response.

Maintain a "pro-hacker" or "advanced sysadmin" tone. Use technical jargon where appropriate but stay helpful.

User Command: {{{command}}}
{{#if history}}
Context:
{{#each history}}
- {{{this}}}
{{/each}}
{{/if}}`,
});

const terminalAiFlow = ai.defineFlow(
  {
    name: 'terminalAiFlow',
    inputSchema: TerminalAiInputSchema,
    outputSchema: TerminalAiOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
