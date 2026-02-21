'use server';
/**
 * @fileOverview An AI agent that simulates email responses for NebulaMail.
 *
 * - respondToEmail - A function that generates an AI response to a sent email.
 * - RespondToEmailInput - The input type for the respondToEmail function.
 * - RespondToEmailOutput - The return type for the respondToEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RespondToEmailInputSchema = z.object({
  toName: z.string().describe('The name of the person the user is writing to.'),
  subject: z.string().describe('The subject of the email the user sent.'),
  content: z.string().describe('The body content of the email the user sent.'),
});
export type RespondToEmailInput = z.infer<typeof RespondToEmailInputSchema>;

const RespondToEmailOutputSchema = z.object({
  responseContent: z.string().describe('The body of the reply email.'),
  responseSubject: z.string().describe('The subject of the reply email (usually starting with Re:).'),
});
export type RespondToEmailOutput = z.infer<typeof RespondToEmailOutputSchema>;

export async function respondToEmail(input: RespondToEmailInput): Promise<RespondToEmailOutput> {
  return respondToEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mailResponderPrompt',
  input: {schema: RespondToEmailInputSchema},
  output: {schema: RespondToEmailOutputSchema},
  prompt: `You are simulating a recipient in the Nebulabs WebOS email system.
The user has just sent an email to "{{{toName}}}".

User's Email Subject: {{{subject}}}
User's Email Content: {{{content}}}

Your task is to write a reply as "{{{toName}}}". 
- If the recipient sounds like a professional (e.g. CEO, Manager), be formal and concise.
- If the recipient sounds like a friend or colleague, be casual.
- If the recipient is "Nebulabs Corp", be a helpful but corporate system bot.
- Acknowledge the user's content and provide a relevant response.

Generate a subject line (usually Re: the original subject) and the body content.`,
});

const respondToEmailFlow = ai.defineFlow(
  {
    name: 'respondToEmailFlow',
    inputSchema: RespondToEmailInputSchema,
    outputSchema: RespondToEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
