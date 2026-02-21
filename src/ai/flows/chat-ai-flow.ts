'use server';
/**
 * @fileOverview An AI agent that simulates chat responses for Nebula Teams.
 *
 * - respondToChat - A function that generates an AI response to a chat message.
 * - RespondToChatInput - The input type for the respondToChat function.
 * - RespondToChatOutput - The return type for the respondToChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RespondToChatInputSchema = z.object({
  colleagueName: z.string().describe('The name of the colleague the user is chatting with.'),
  colleagueRole: z.string().describe('The role of the colleague (e.g. Engineering, HR).'),
  message: z.string().describe('The message the user sent.'),
  history: z.array(z.string()).optional().describe('Previous messages in the conversation.'),
});
export type RespondToChatInput = z.infer<typeof RespondToChatInputSchema>;

const RespondToChatOutputSchema = z.object({
  response: z.string().describe('The AI-generated chat response.'),
});
export type RespondToChatOutput = z.infer<typeof RespondToChatOutputSchema>;

export async function respondToChat(input: RespondToChatInput): Promise<RespondToChatOutput> {
  return respondToChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatResponderPrompt',
  input: {schema: RespondToChatInputSchema},
  output: {schema: RespondToChatOutputSchema},
  prompt: `You are simulating a colleague in the Nebulabs WebOS "Nebula Teams" chat system.
You are currently chatting as "{{{colleagueName}}}" (Role: {{{colleagueRole}}}).

User's Message: {{{message}}}

Colleague Personalities:
- Dev Lead (Sarah): Highly technical, helpful, uses emoji occasionally, very focused on kernel performance and code quality.
- System Admin: Brief, professional, sounds slightly stressed but competent, talks about servers, hardware, and uptime.
- Nebulabs HR: Very polite, formal but friendly, uses "Corporate Speak," helpful with benefits or company policy.
- Nebulabs CEO: Visionary, inspiring, busy but appreciative, talks about the future of WebOS and quantum threading.

{{#if history}}
Conversation Context:
{{#each history}}
- {{{this}}}
{{/each}}
{{/if}}

Your task is to write a short, chat-style reply (1-3 sentences) as "{{{colleagueName}}}". 
Maintain the persona consistently. Be helpful and realistic.`,
});

const respondToChatFlow = ai.defineFlow(
  {
    name: 'respondToChatFlow',
    inputSchema: RespondToChatInputSchema,
    outputSchema: RespondToChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
