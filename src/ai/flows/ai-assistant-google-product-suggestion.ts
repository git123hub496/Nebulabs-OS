
'use server';
/**
 * @fileOverview An AI assistant flow that suggests relevant applications
 *               available within Nebulabs WebOS based on user queries.
 *
 * - suggestGoogleProduct - A function that handles the product suggestion process.
 * - SuggestGoogleProductInput - The input type for the suggestGoogleProduct function.
 * - SuggestGoogleProductOutput - The return type for the suggestGoogleProduct function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGoogleProductInputSchema = z.object({
  query: z.string().describe('The user\'s question or description of their needs.'),
});
export type SuggestGoogleProductInput = z.infer<typeof SuggestGoogleProductInputSchema>;

const SuggestGoogleProductOutputSchema = z.object({
  suggestions: z
    .array(
      z.object({
        name: z.string().describe('The name of the suggested product or application.'),
        description: z
          .string()
          .describe('A brief description of the suggested product or application.'),
        reason: z.string().describe('Why this product is relevant to the user\'s query.'),
      })
    )
    .describe('A list of suggested products or applications.'),
  explanation: z
    .string()
    .optional()
    .describe('An overall explanation or summary of the suggestions.'),
});
export type SuggestGoogleProductOutput = z.infer<typeof SuggestGoogleProductOutputSchema>;

export async function suggestGoogleProduct(
  input: SuggestGoogleProductInput
): Promise<SuggestGoogleProductOutput> {
  return suggestGoogleProductFlow(input);
}

const prompt = ai.definePrompt({
  name: 'googleProductSuggestionPrompt',
  input: {schema: SuggestGoogleProductInputSchema},
  output: {schema: SuggestGoogleProductOutputSchema},
  prompt: `You are an AI assistant in Nebulabs WebOS. Your task is to suggest relevant applications
that are part of the Nebulabs WebOS ecosystem, based on the user's query.

Nebulabs WebOS includes the following popular applications:
- Nebula Browser: A full-featured web browser for surfing the internet and searching.
- Google Drive: For cloud storage and file synchronization.
- Nebula Notes: A built-in text editor for quick note-taking.
- Calculator: For math and quick calculations.
- Terminal: A command-line interface for system exploration and dev tools.
- Google Calendar: For scheduling and time management.
- Google Meet: For video conferencing and online meetings.
- Google Photos: For organizing and sharing photos.

Based on the user's needs or question, suggest which of these applications would be most helpful.
Provide a clear reason for each suggestion.

User Query: {{{query}}}`,
});

const suggestGoogleProductFlow = ai.defineFlow(
  {
    name: 'suggestGoogleProductFlow',
    inputSchema: SuggestGoogleProductInputSchema,
    outputSchema: SuggestGoogleProductOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
