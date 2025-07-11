
'use server';
/**
 * @fileOverview An AI flow to analyze a student's performance.
 *
 * - analyzePerformance - A function that handles the performance analysis process.
 * - AnalyzePerformanceInput - The input type for the analyzePerformance function.
 * - AnalyzePerformanceOutput - The return type for the analyzePerformance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MetricHistorySchema = z.object({
  date: z.string().describe('The date of the measurement (e.g., "2024-08-01").'),
  weight: z.number().optional().describe('Body weight in kg.'),
  bodyFat: z.number().optional().describe('Body fat percentage.'),
  arm: z.number().optional().describe('Arm circumference in cm.'),
  leg: z.number().optional().describe('Leg circumference in cm.'),
  waist: z.number().optional().describe('Waist circumference in cm.'),
});

const ExercisePerformanceSchema = z.object({
    name: z.string().describe('Name of the exercise.'),
    isCompleted: z.boolean().describe('Whether the student completed this exercise in their last session.'),
});

const DailyWorkoutPerformanceSchema = z.object({
    day: z.string().describe('Day of the workout (e.g., "Monday").'),
    focus: z.string().describe('The focus of the workout (e.g., "Chest & Triceps").'),
    exercises: z.array(ExercisePerformanceSchema),
});

const WorkoutPlanPerformanceSchema = z.object({
    name: z.string().describe('Name of the workout plan.'),
    focus: z.string().describe('The main goal of the plan.'),
    schedule: z.array(DailyWorkoutPerformanceSchema),
});

const AnalyzePerformanceInputSchema = z.object({
    studentName: z.string().describe('The name of the student being analyzed.'),
    metricHistory: z.array(MetricHistorySchema).describe('The history of the student\'s body measurements.'),
    workoutPlan: WorkoutPlanPerformanceSchema.optional().describe('The student\'s current workout plan and completion status.'),
});
export type AnalyzePerformanceInput = z.infer<typeof AnalyzePerformanceInputSchema>;

const AnalyzePerformanceOutputSchema = z.object({
  analysis: z.string().describe('A comprehensive analysis of the student\'s performance, including strengths, weaknesses, and actionable suggestions. Should be formatted with markdown-style lists.'),
});
export type AnalyzePerformanceOutput = z.infer<typeof AnalyzePerformanceOutputSchema>;


const prompt = ai.definePrompt({
  name: 'analyzePerformancePrompt',
  input: { schema: AnalyzePerformanceInputSchema },
  output: { schema: AnalyzePerformanceOutputSchema },
  prompt: `You are a highly experienced personal trainer and data analyst. Your task is to analyze the performance of a student, named {{studentName}}, based on their body metric history and workout plan adherence.

Provide a concise, insightful, and encouraging analysis. The analysis should be easy to read, using bullet points for key observations.

**Analysis Sections:**
1.  **Resumo Geral:** Start with a brief, encouraging summary of the student's journey.
2.  **Pontos Fortes:** Identify areas where the student is excelling. This could be consistency in weight loss, adherence to the workout plan, or specific measurement improvements.
3.  **Áreas para Melhoria:** Pinpoint areas that need attention. This could be stagnant progress in a specific measurement, inconsistency in workouts, or a metric that's not aligning with their goals.
4.  **Sugestões Acionáveis:** Provide 2-3 clear, simple, and actionable suggestions. For example, "Considerar o aumento da carga no agachamento para desafiar mais as pernas" or "Focar em completar todos os exercícios do treino de Costas e Bíceps na próxima semana."

**Dados do Aluno:**

**Histórico de Métricas:**
{{#each metricHistory}}
- Data: {{date}}, Peso: {{weight}}kg, % Gordura: {{#if bodyFat}}{{bodyFat}}%{{else}}N/A{{/if}}, Braço: {{#if arm}}{{arm}}cm{{else}}N/A{{/if}}, Perna: {{#if leg}}{{leg}}cm{{else}}N/A{{/if}}, Cintura: {{#if waist}}{{waist}}cm{{else}}N/A{{/if}}
{{/each}}

{{#if workoutPlan}}
**Plano de Treino Atual: {{workoutPlan.name}}**
Foco: {{workoutPlan.focus}}
Adesão ao plano:
{{#each workoutPlan.schedule}}
- {{day}} ({{focus}}): {{#if exercises.length}}{{#if (every exercises 'isCompleted')}}Completo{{else}}Incompleto{{/if}}{{else}}Descanso{{/if}}
{{/each}}
{{/if}}

Generate the analysis based on these data points.
`,
});

const analyzePerformanceFlow = ai.defineFlow(
  {
    name: 'analyzePerformanceFlow',
    inputSchema: AnalyzePerformanceInputSchema,
    outputSchema: AnalyzePerformanceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate performance analysis.');
    }
    return output;
  }
);

export async function analyzePerformance(input: AnalyzePerformanceInput): Promise<AnalyzePerformanceOutput> {
    return analyzePerformanceFlow(input);
}
