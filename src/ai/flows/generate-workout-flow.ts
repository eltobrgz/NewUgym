
'use server';
/**
 * @fileOverview A workout plan generation AI flow.
 *
 * - generateWorkoutPlan - A function that handles the workout plan generation process.
 * - GenerateWorkoutInput - The input type for the generateWorkoutPlan function.
 * - GenerateWorkoutOutput - The return type for the generateWorkoutPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateWorkoutInputSchema = z.object({
  goal: z.string().describe('The primary fitness goal (e.g., Hypertrophy, Strength, Endurance, Weight Loss).'),
  level: z.string().describe('The user\'s experience level (Beginner, Intermediate, Advanced).'),
  daysPerWeek: z.number().min(1).max(7).describe('How many days per week the user can train.'),
  sessionDuration: z.number().min(15).max(120).describe('The average duration of each training session in minutes.'),
  notes: z.string().optional().describe('Any additional notes or preferences from the user (e.g., equipment limitations, specific exercises to include/avoid).'),
});
export type GenerateWorkoutInput = z.infer<typeof GenerateWorkoutInputSchema>;


const ExerciseSchema = z.object({
  name: z.string().describe('The name of the exercise.'),
  sets: z.number().optional().describe('The number of sets.'),
  reps: z.string().optional().describe('The number of repetitions (e.g., "8-12", "15").'),
  duration: z.string().optional().describe('The duration of the exercise if it is time-based (e.g., "30 seconds", "5 minutes").'),
  rest: z.string().optional().describe('The rest time between sets (e.g., "60s", "2 minutes").')
});

const DailyWorkoutSchema = z.object({
    day: z.string().describe("The day of the week for this workout (e.g., Monday, Tuesday)."),
    focus: z.string().describe("The main focus for the day's workout (e.g., 'Upper Body Strength', 'Cardio & Core', 'Rest Day')."),
    exercises: z.array(ExerciseSchema).optional().describe("A list of exercises for the day. Should be empty if it's a Rest Day."),
});

const GenerateWorkoutOutputSchema = z.object({
  planName: z.string().describe("A catchy and descriptive name for the generated workout plan."),
  weeklySchedule: z.array(DailyWorkoutSchema).length(7).describe("A complete 7-day workout schedule, including rest days."),
});

export type GenerateWorkoutOutput = z.infer<typeof GenerateWorkoutOutputSchema>;


export async function generateWorkoutPlan(input: GenerateWorkoutInput): Promise<GenerateWorkoutOutput> {
  const result = await generateWorkoutFlow(input);
  // Basic validation, in a real app you might want more robust checks
  if (!result || !result.weeklySchedule || result.weeklySchedule.length !== 7) {
    throw new Error("AI failed to generate a valid 7-day workout plan.");
  }
  return result;
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPrompt',
  input: { schema: GenerateWorkoutInputSchema },
  output: { schema: GenerateWorkoutOutputSchema },
  prompt: `You are an expert personal trainer and fitness coach. Your task is to create a comprehensive, safe, and effective weekly workout plan based on the user's profile and goals.

Generate a 7-day plan, including specific exercises for each training day and clearly marking rest days. The plan should be structured and easy to follow.

User Profile:
- Fitness Goal: {{{goal}}}
- Experience Level: {{{level}}}
- Days per Week Available: {{{daysPerWeek}}}
- Session Duration: {{{sessionDuration}}} minutes
{{#if notes}}- Additional Notes: {{{notes}}}{{/if}}

Instructions:
1.  Create a fitting name for the plan (e.g., "Beginner's Strength Foundation", "Intermediate Hypertrophy Split").
2.  **You MUST structure the output for a full 7-day week (e.g., Monday to Sunday). The 'weeklySchedule' array MUST contain exactly 7 items.**
3.  Distribute the {{{daysPerWeek}}} training sessions logically across the week. The remaining days must be "Rest Day".
4.  For each training day, provide a list of exercises with appropriate sets, reps, and rest times. For cardio exercises, specify duration.
5.  Ensure the plan is appropriate for the user's experience level.
6.  For any "Rest Day", the "focus" property should be "Rest Day", and the "exercises" array MUST be empty.
7.  Provide a clear and concise response in the requested JSON format.
`,
});

const generateWorkoutFlow = ai.defineFlow(
  {
    name: 'generateWorkoutFlow',
    inputSchema: GenerateWorkoutInputSchema,
    outputSchema: GenerateWorkoutOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("Failed to generate workout plan from the model.");
    }
    return output;
  }
);
