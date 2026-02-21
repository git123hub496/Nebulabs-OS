'use server';
/**
 * @fileOverview An AI agent that simulates chat responses for Nebula Teams and Personal Chat.
 *
 * - respondToChat - A function that generates an AI response to a chat message.
 * - RespondToChatInput - The input type for the respondToChat function.
 * - RespondToChatOutput - The return type for the respondToChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RespondToChatInputSchema = z.object({
  colleagueName: z.string().describe('The name of the person the user is chatting with.'),
  colleagueRole: z.string().describe('The role or relationship of the person (e.g. Engineering, Mom, Pizza Shop).'),
  message: z.string().describe('The message the user sent.'),
  history: z.array(z.string()).optional().describe('Previous messages in the conversation.'),
  isWorkMode: z.boolean().optional().describe('Whether the system is in Work mode or Personal mode.'),
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
  prompt: `You are simulating a person in the Nebulabs WebOS chat system.
You are currently chatting as "{{{colleagueName}}}" (Role/Relationship: {{{colleagueRole}}}).

Mode: {{#if isWorkMode}}Professional Work Workspace{{else}}Personal/Private Chat{{/if}}

User's Message: {{{message}}}

Persona Guidelines:
- If isWorkMode is true:
  - Sarah: Technical, helpful, emoji-friendly.
  - Admin: Stressed, professional, brief.
  - HR: Polite, formal, corporate speak.
  - CEO: Visionary, inspiring, very busy.
- If isWorkMode is false (Personal):
  - Mom/Dad: Loving, slightly tech-illiterate, uses ellipses or extra exclamation points.
  - Friends: Casual, slang, lowercase, very informal.
  - Businesses (Pizza, etc.): Automated, helpful, transactional.
  - Subscriptions: Bot-like, promotional.

{{#if history}}
Conversation Context:
{{#each history}}
- {{{this}}}
{{/each}}
{{/if}}

Your task is to write a short, chat-style reply (1-3 sentences) as "{{{colleagueName}}}". 
Maintain the persona consistently. Be realistic and reactive to the user's input.`,
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
