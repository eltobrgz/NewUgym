
'use server';
/**
 * @fileOverview An AI flow to describe an exercise and find a relevant GIF.
 * 
 * - describeExercise - A function that handles the exercise description process.
 * - DescribeExerciseInput - The input type for the describeExercise function.
 * - DescribeExerciseOutput - The return type for the describeExercise function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DescribeExerciseInputSchema = z.object({
  exerciseName: z.string().describe('The name of the exercise to describe, e.g., "Agachamento com Barra".'),
});
export type DescribeExerciseInput = z.infer<typeof DescribeExerciseInputSchema>;

const DescribeExerciseOutputSchema = z.object({
  name: z.string().describe('The official or corrected name of the exercise.'),
  description: z.string().describe('A detailed, step-by-step guide on how to perform the exercise correctly.'),
  musclesWorked: z.array(z.string()).describe('A list of primary and secondary muscles targeted by the exercise.'),
  safetyTips: z.array(z.string()).describe('A list of important tips to avoid injury and ensure proper form.'),
  media: z.object({
      gifUrl: z.string().url().describe('A URL to an animated GIF demonstrating the exercise.'),
  }).describe('Media assets related to the exercise.'),
});
export type DescribeExerciseOutput = z.infer<typeof DescribeExerciseOutputSchema>;


/**
 * A mock tool to find a relevant GIF for an exercise.
 * In a real app, this would call an API like Giphy or Tenor.
 */
const findExerciseGif = ai.defineTool(
    {
        name: 'findExerciseGif',
        description: 'Finds a relevant animated GIF for a given fitness exercise.',
        inputSchema: z.object({
            query: z.string().describe('A search query for the exercise GIF, e.g., "barbell squat".'),
        }),
        outputSchema: z.object({
            url: z.string().url(),
        }),
    },
    async ({ query }) => {
        // Mock implementation: returns a placeholder GIF.
        console.log(`Searching for GIF with query: ${query}`);
        const placeholderUrl = `https://placehold.co/400x400/EAB308/000000.gif?text=${encodeURIComponent(query)}`;
        return { url: placeholderUrl };
    }
);


const describeExercisePrompt = ai.definePrompt({
    name: 'describeExercisePrompt',
    input: { schema: DescribeExerciseInputSchema },
    output: { schema: DescribeExerciseOutputSchema },
    tools: [findExerciseGif],
    prompt: `You are a world-class personal trainer and kinesiologist.
A user has asked for information about a specific exercise.
Your task is to provide a detailed, helpful, and safe description of the exercise: "{{exerciseName}}".

You must perform the following steps:
1.  **Analyze the Exercise:** Determine the standard name for "{{exerciseName}}".
2.  **Generate Description:** Write a clear, step-by-step guide on how to perform it. Focus on proper form from start to finish.
3.  **Identify Muscles:** List the primary and secondary muscle groups targeted.
4.  **Provide Safety Tips:** Give crucial advice to prevent common injuries.
5.  **Find a Visual:** Use the 'findExerciseGif' tool to find a relevant animated GIF. The search query for the tool should be the English name of the exercise.

Respond ONLY with the structured JSON output.
`,
});

const describeExerciseFlow = ai.defineFlow(
  {
    name: 'describeExerciseFlow',
    inputSchema: DescribeExerciseInputSchema,
    outputSchema: DescribeExerciseOutputSchema,
  },
  async (input) => {
    const { output } = await describeExercisePrompt(input);
    if (!output) {
      throw new Error('AI failed to generate exercise description.');
    }
    return output;
  }
);

export async function describeExercise(input: DescribeExerciseInput): Promise<DescribeExerciseOutput> {
    return describeExerciseFlow(input);
}
