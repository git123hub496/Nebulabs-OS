
'use server';
/**
 * @fileOverview A general-purpose AI assistant flow for Nebulabs WebOS.
 *
 * - suggestGoogleProduct - A function that handles general queries and product suggestions.
 * - SuggestGoogleProductInput - The input type for the assistant function.
 * - SuggestGoogleProductOutput - The return type for the assistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGoogleProductInputSchema = z.object({
  query: z.string().describe('The user\'s question, request, or description of their needs.'),
});
export type SuggestGoogleProductInput = z.infer<typeof SuggestGoogleProductInputSchema>;

const SuggestGoogleProductOutputSchema = z.object({
  answer: z.string().describe('The main, comprehensive answer to the user\'s query.'),
  suggestions: z
    .array(
      z.object({
        name: z.string().describe('The name of the suggested Nebulabs product or application.'),
        description: z
          .string()
          .describe('A brief description of the suggested product or application.'),
        reason: z.string().describe('Why this product is relevant to the user\'s current query.'),
      })
    )
    .optional()
    .describe('A list of suggested products or applications within the OS, if applicable.'),
});
export type SuggestGoogleProductOutput = z.infer<typeof SuggestGoogleProductOutputSchema>;

export async function suggestGoogleProduct(
  input: SuggestGoogleProductInput
): Promise<SuggestGoogleProductOutput> {
  return suggestGoogleProductFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nebulaAssistantPrompt',
  input: {schema: SuggestGoogleProductInputSchema},
  output: {schema: SuggestGoogleProductOutputSchema},
  prompt: `You are the Nebula AI Assistant, a highly intelligent and helpful AI integrated into the Nebulabs WebOS environment.

Your goal is to provide comprehensive, accurate, and engaging answers to any question or request the user has. You are not limited to system help; you can provide creative writing, coding assistance, analysis, or general conversation.

If the user's request can be fulfilled or enhanced by one of the built-in applications in Nebulabs WebOS, you should include them in the suggestions field.

Nebulabs WebOS Applications:
- Nebula Browser: Full web access and research.
- Google Drive: Cloud file storage and sync.
- Nebula Notes: Text editing and documentation.
- Calculator: Math and data processing.
- Terminal: Command-line system access and dev tools.
- Calendar: Scheduling and time management.
- Nebula Maps: Global navigation and location intelligence.
- Nebula Paint: Creative drawing and image editing.
- Nebula Camera: Live hardware photo capture.
- Nebula Slides: Professional presentation creation.
- System Monitor: Performance telemetry and resource tracking.

User Query: {{{query}}}`,
});

const suggestGoogleProductFlow = ai.defineFlow(
  {
    name: 'nebulaAssistantFlow',
    inputSchema: SuggestGoogleProductInputSchema,
    outputSchema: SuggestGoogleProductOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
