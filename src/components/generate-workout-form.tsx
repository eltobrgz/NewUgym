'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateWorkoutPlan, GenerateWorkoutInput, GenerateWorkoutOutput } from '@/ai/flows/generate-workout-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

type GenerateWorkoutFormProps = {
  onPlanGenerated: (plan: GenerateWorkoutOutput | null) => void;
};

// Re-define the schema here for client-side validation
const GenerateWorkoutInputSchema = z.object({
  goal: z.string().describe('O principal objetivo de fitness (ex: Hipertrofia, Força, Resistência, Perda de Peso).'),
  level: z.string().describe('O nível de experiência do usuário (Iniciante, Intermediário, Avançado).'),
  daysPerWeek: z.number().min(1).max(7).describe('Quantos dias por semana o usuário pode treinar.'),
  sessionDuration: z.number().min(15).max(120).describe('A duração média de cada sessão de treino em minutos.'),
  notes: z.string().optional().describe('Quaisquer notas ou preferências adicionais do usuário (ex: limitações de equipamento, exercícios específicos para incluir/evitar).'),
});

export function GenerateWorkoutForm({ onPlanGenerated }: GenerateWorkoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GenerateWorkoutOutput | null>(null);

  const form = useForm<GenerateWorkoutInput>({
    resolver: zodResolver(GenerateWorkoutInputSchema),
    defaultValues: {
      goal: 'Hipertrofia',
      level: 'Iniciante',
      daysPerWeek: 3,
      sessionDuration: 60,
      notes: '',
    },
  });

  async function onSubmit(values: GenerateWorkoutInput) {
    setIsLoading(true);
    setGeneratedPlan(null);
    try {
      const plan = await generateWorkoutPlan(values);
      setGeneratedPlan(plan);
    } catch (error) {
      console.error("Erro ao gerar plano de treino:", error);
      // Aqui você pode mostrar um toast para o usuário
    } finally {
      setIsLoading(false);
    }
  }

  if (generatedPlan) {
    return (
      <div className="space-y-4">
        <Card className="max-h-[50vh] overflow-y-auto">
            <CardHeader>
                <CardTitle>{generatedPlan.planName}</CardTitle>
                <CardDescription>Aqui está seu plano de treino gerado por IA. Revise e salve-o se estiver satisfeito.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {generatedPlan.weeklySchedule.map((day, index) => (
                    <div key={index}>
                        <h4 className="font-semibold">{day.day} - <Badge variant="secondary">{day.focus}</Badge></h4>
                        {day.exercises && day.exercises.length > 0 ? (
                        <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                            {day.exercises.map((ex, exIndex) => (
                                <li key={exIndex}>
                                    {ex.name}: {ex.sets && `${ex.sets} séries de`} {ex.reps && `${ex.reps} reps`} {ex.duration && ex.duration} {ex.rest && `(descanso: ${ex.rest})`}
                                </li>
                            ))}
                        </ul>
                         ) : <p className="text-sm text-muted-foreground mt-2 pl-5">Dia de descanso.</p>}
                    </div>
                ))}
            </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setGeneratedPlan(null)}>Gerar Novamente</Button>
            <Button onClick={() => onPlanGenerated(generatedPlan)}>Salvar Plano</Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual é o seu principal objetivo?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um objetivo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hypertrophy">Hipertrofia (Ganho de Massa)</SelectItem>
                      <SelectItem value="Strength">Força</SelectItem>
                      <SelectItem value="Weight Loss">Perda de Peso</SelectItem>
                      <SelectItem value="Endurance">Resistência</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual é o seu nível de experiência?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu nível" />
                      </Trigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Iniciante</SelectItem>
                      <SelectItem value="Intermediate">Intermediário</SelectItem>
                      <SelectItem value="Advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <FormField
              control={form.control}
              name="daysPerWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantos dias por semana?</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sessionDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração da sessão (minutos)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
         <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações Adicionais</FormLabel>
                   <FormControl>
                     <Textarea
                      placeholder="Ex: Tenho uma lesão no joelho, não tenho acesso a uma barra fixa, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Gerar Plano de Treino
                </>
              )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
